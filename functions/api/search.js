const CACHE_SECONDS = 300;

const KNOWN_STORES = [
  "mercadolivre.com.br", "amazon.com.br", "shopee.com.br", "magazineluiza.com.br",
  "magalu.com.br", "kabum.com.br", "pichau.com.br", "terabyteshop.com.br",
  "carrefour.com.br", "casasbahia.com.br", "americanas.com.br", "fastshop.com.br",
  "leroymerlin.com.br", "madeiramadeira.com.br", "lojadomecanico.com.br",
  "kalunga.com.br", "webcontinental.com.br", "walmart.com", "bestbuy.com"
];

const EXCLUDED_HOSTS = [
  "facebook.com", "instagram.com", "tiktok.com", "youtube.com", "pinterest.com",
  "x.com", "twitter.com", "reddit.com", "wikipedia.org"
];

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=0, s-maxage=" + CACHE_SECONDS,
      ...extraHeaders
    }
  });
}

function hostMatches(host, domain) {
  return host === domain || host.endsWith("." + domain);
}

function getHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); }
  catch { return ""; }
}

function isProductPath(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const productPatterns = [
      /\/dp\/[A-Z0-9]{8,}/i,
      /\/gp\/product\/[A-Z0-9]{8,}/i,
      /\/produto\//i,
      /\/produtos\/[^/]+/i,
      /\/product\/[^/]+/i,
      /\/p\/[A-Z0-9-]{5,}/i,
      /\/MLB-?\d{6,}/i,
      /[._-]i\.\d{3,}\.\d{3,}/i,
      /\/item\/[^/]+/i,
      /\/itm\//i
    ];
    return productPatterns.some((pattern) => pattern.test(path)) ||
      /(?:^|\/)[^/]{8,}-(?:produto|p)-\d+\.html?$/i.test(path);
  } catch { return false; }
}

function hasProductSchema(result) {
  const schemas = result && result.deep_results && Array.isArray(result.deep_results.schemas)
    ? result.deep_results.schemas : [];
  return schemas.some((schema) => {
    const type = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"] || schema.type];
    return type.some((value) => String(value || "").toLowerCase().includes("product"));
  });
}

function looksLikeSearchOrHome(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase().replace(/\/+$/, "");
    if (!path) return true;
    if (/\/(search|busca|buscar|s|results|resultados|collections|category|categorias)$/i.test(path)) return true;
    if ((parsed.searchParams.has("q") || parsed.searchParams.has("k") || parsed.searchParams.has("query") || parsed.searchParams.has("keyword")) &&
        !isProductPath(url)) return true;
    return false;
  } catch { return true; }
}

function scoreResult(result, query) {
  const url = String(result.url || "");
  const host = getHost(url);
  if (!host || !/^https:\/\//i.test(url)) return -100;
  if (EXCLUDED_HOSTS.some((domain) => hostMatches(host, domain))) return -100;

  let score = 0;
  const providerScore = Number(result.score || 0);
  score += Math.max(0, providerScore) * 3;
  const direct = isProductPath(url);
  const store = KNOWN_STORES.some((domain) => hostMatches(host, domain));
  if (direct) score += 7;
  if (store) score += 4;
  if (looksLikeSearchOrHome(url)) score -= 7;

  const haystack = (String(result.title || "") + " " + String(result.content || result.description || "")).toLowerCase();
  const words = query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2);
  const uniqueWords = Array.from(new Set(words));
  const matched = uniqueWords.filter((word) => haystack.includes(word)).length;
  if (uniqueWords.length) score += (matched / uniqueWords.length) * 4;
  return { score, direct, store, host };
}

function storeLabel(host) {
  const labels = [
    ["mercadolivre.com.br", "Mercado Livre"], ["amazon.com.br", "Amazon Brasil"],
    ["shopee.com.br", "Shopee"], ["magazineluiza.com.br", "Magazine Luiza"],
    ["magalu.com.br", "Magalu"], ["kabum.com.br", "KaBuM!"],
    ["pichau.com.br", "Pichau"], ["terabyteshop.com.br", "TerabyteShop"],
    ["carrefour.com.br", "Carrefour"], ["casasbahia.com.br", "Casas Bahia"],
    ["americanas.com.br", "Americanas"], ["fastshop.com.br", "Fast Shop"],
    ["leroymerlin.com.br", "Leroy Merlin"], ["madeiramadeira.com.br", "MadeiraMadeira"],
    ["lojadomecanico.com.br", "Loja do Mecânico"], ["kalunga.com.br", "Kalunga"],
    ["webcontinental.com.br", "Webcontinental"]
  ];
  const match = labels.find(([domain]) => hostMatches(host, domain));
  if (match) return match[1];
  return host.replace(/^www\./, "");
}


function getPageImage(result) {
  const images = Array.isArray(result && result.images) ? result.images : [];
  for (const image of images) {
    const candidate = typeof image === "string"
      ? image
      : image && (image.url || image.image_url || image.src || image.href);
    if (!candidate) continue;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === "https:" && !/\.svg(?:[?#]|$)/i.test(parsed.href)) return parsed.href;
    } catch { /* Ignore malformed image URLs. */ }
  }
  return null;
}

function getPriceMention(text) {
  const value = String(text || "");
  const match = value.match(/R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?|R\$\s?\d+(?:,\d{2})?/i);
  if (!match) return null;
  const label = match[0].replace(/\s+/g, " ").trim();
  const number = Number(label.replace(/R\$\s?/i, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(number) || number <= 0 || number > 100000000) return null;
  return { label, value: number };
}

function explainPrice(text) {
  const value = String(text || "");
  const checks = [
    { re: /\b(cupom|cupom de desconto|código promocional|cashback)\b/i, reason: "A página menciona cupom, código promocional ou cashback. Confira as regras e se o desconto é aplicado ao finalizar a compra." },
    { re: /\b(pix|desconto à vista|desconto no pix|pagamento à vista)\b/i, reason: "A página menciona condição de pagamento ou desconto à vista. Confira se o preço depende do método de pagamento." },
    { re: /\b(usado|seminovo|recondicionado|refurbished|open box|mostruário|vitrine)\b/i, reason: "O anúncio pode envolver produto usado, recondicionado ou de mostruário. Compare estado, garantia e política de devolução." },
    { re: /\b(frete grátis|frete gratis|frete gratuito)\b/i, reason: "A página menciona frete grátis. O custo total pode ficar menor, mas confira se o benefício vale para seu CEP." },
    { re: /\b(promoção|promocional|oferta|liquidação|desconto|sale)\b/i, reason: "A página menciona promoção ou desconto. Confira o preço final e a validade da oferta na loja." },
    { re: /\b(kit|combo|conjunto|pacote com|lote)\b/i, reason: "O anúncio pode ser de um kit ou conjunto. Confirme quantas unidades e acessórios estão incluídos antes de comparar." },
    { re: /\b(importado|internacional|sem garantia nacional)\b/i, reason: "A página menciona produto importado ou condição de garantia diferente. Verifique impostos, prazo, devolução e garantia antes de comprar." }
  ];
  const match = checks.find((entry) => entry.re.test(value));
  if (match) return { reason: match.reason, evidenceFound: true };
  return {
    reason: "A página não deixa claro por que o preço pode ser menor. Compare o preço final com frete, vendedor, estado do produto, garantia e devolução.",
    evidenceFound: false
  };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const incoming = new URL(request.url);
  const query = String(incoming.searchParams.get("q") || "").trim().replace(/\s+/g, " ");
  if (query.length < 2) return json({ error: "invalid_query", message: "Digite pelo menos 2 caracteres para pesquisar." }, 400);
  if (query.length > 120) return json({ error: "query_too_long", message: "A pesquisa deve ter no máximo 120 caracteres." }, 400);
  if (!env.TAVILY_API_KEY) {
    return json({
      error: "search_not_configured",
      message: "A busca direta ainda não foi ativada. Use os atalhos de lojas enquanto isso."
    }, 503, { "Cache-Control": "no-store" });
  }

  const normalized = query.toLocaleLowerCase("pt-BR");
  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  cacheUrl.searchParams.set("q", normalized);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  try {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  } catch { /* Cache is an optimization, not a requirement. */ }

  let upstream;
  try {
    upstream = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + env.TAVILY_API_KEY
      },
      body: JSON.stringify({
        query: query + " comprar produto no Brasil",
        topic: "general",
        search_depth: "basic",
        max_results: 20,
        country: "brazil",
        include_answer: false,
        include_raw_content: false,
        include_images: true
      })
    });
  } catch {
    return json({ error: "search_unavailable", message: "Não foi possível consultar a busca agora. Tente novamente." }, 502, { "Cache-Control": "no-store" });
  }

  if (!upstream.ok) {
    if (upstream.status === 401 || upstream.status === 403) {
      return json({ error: "search_auth_error", message: "A configuração do provedor de busca precisa ser verificada." }, 502, { "Cache-Control": "no-store" });
    }
    if (upstream.status === 429 || upstream.status === 402 || upstream.status === 432) {
      return json({ error: "search_limit", message: "O limite temporário de buscas foi atingido. Tente novamente mais tarde." }, 429, { "Cache-Control": "no-store" });
    }
    return json({ error: "search_unavailable", message: "A busca não respondeu corretamente. Tente novamente." }, 502, { "Cache-Control": "no-store" });
  }

  let payload;
  try { payload = await upstream.json(); }
  catch { return json({ error: "invalid_search_response", message: "A busca retornou uma resposta inválida." }, 502, { "Cache-Control": "no-store" }); }

  const rawResults = payload && Array.isArray(payload.results) ? payload.results : [];
  const ranked = rawResults.map((item) => {
    const rating = scoreResult(item, query);
    return { item, rating };
  }).filter(({ rating }) => typeof rating === "object" && rating.score > -20)
    .sort((a, b) => b.rating.score - a.rating.score);

  const results = [];
  const seen = new Set();
  for (const entry of ranked) {
    const item = entry.item;
    const rating = entry.rating;
    let parsed;
    try { parsed = new URL(item.url); } catch { continue; }
    const canonical = parsed.href;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const pageText = String(item.title || "") + " " + String(item.content || item.description || "");
    const price = getPriceMention(pageText);
    const priceWhy = explainPrice(pageText);
    const imageUrl = getPageImage(item);
    results.push({
      title: String(item.title || "Produto encontrado").slice(0, 180),
      url: canonical,
      description: String(item.content || item.description || "").slice(0, 360),
      domain: rating.host,
      store: storeLabel(rating.host),
      imageUrl,
      priceMention: price ? price.label : null,
      priceValue: price ? price.value : null,
      priceReason: priceWhy.reason,
      priceReasonEvidence: priceWhy.evidenceFound,
      directProductPage: Boolean(rating.direct),
      relevance: Math.round(Math.max(0, Math.min(1, rating.score / 15)) * 100)
    });
    if (results.length === 10) break;
  }

  const response = json({
    query,
    results,
    hasDirectProductPages: results.some((item) => item.directProductPage),
    source: "Tavily Search",
    disclaimer: "Os links levam às páginas encontradas na web. Relevância não garante o menor preço nem a confiabilidade do vendedor."
  });
  try { context.waitUntil(caches.default.put(cacheKey, response.clone())); } catch { /* Cache is optional. */ }
  return response;
}
