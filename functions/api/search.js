const CACHE_SECONDS = 300;

const KNOWN_STORES = [
  "mercadolivre.com.br",
  "amazon.com.br",
  "shopee.com.br",
  "temu.com",
  "tiktok.com",
  "aliexpress.com",
  "shein.com",
  "magazineluiza.com.br",
  "casasbahia.com.br",
  "americanas.com.br",
  "carrefour.com.br",
  "olx.com.br",
  "enjoei.com.br",
  "ebay.com",
  "etsy.com",
  "alibaba.com",
  "dhgate.com",
  "banggood.com",
  "walmart.com",
  "bestbuy.com",
  "elo7.com.br",
  "gringa.com.br",
  "repassa.com.br",
  "shopping.google.com",
  "zoom.com.br",
  "buscape.com.br",
  "promobit.com.br",
  "pelando.com.br",
  "cuponomia.com.br",
  "kabum.com.br",
  "pichau.com.br",
  "terabyteshop.com.br",
  "fastshop.com.br",
  "waz.com.br",
  "gkinfostore.com.br",
  "inpower.com.br",
  "guerradigital.com.br",
  "ibyte.com.br",
  "miranda.com.br",
  "dell.com",
  "lenovo.com",
  "samsung.com",
  "apple.com",
  "asus.com",
  "acer.com",
  "logitech.com",
  "hp.com",
  "mi.com",
  "trocafone.com",
  "trocafy.com.br",
  "iplace.com.br",
  "girafa.com.br",
  "newegg.com",
  "bhphotovideo.com",
  "claro.com.br",
  "lojaonline.vivo.com.br",
  "leroymerlin.com.br",
  "madeiramadeira.com.br",
  "mobly.com.br",
  "westwing.com.br",
  "tokstok.com.br",
  "camicado.com.br",
  "telhanorte.com.br",
  "cec.com.br",
  "sodimac.com.br",
  "obramax.com.br",
  "ferreiracosta.com",
  "havan.com.br",
  "madesa.com",
  "electrolux.com.br",
  "brastemp.com.br",
  "consul.com.br",
  "tramontina.com.br",
  "midea.com.br",
  "copafer.com.br",
  "balaroti.com.br",
  "mmartan.com.br",
  "karsten.com.br",
  "buddemeyer.com.br",
  "netshoes.com.br",
  "centauro.com.br",
  "decathlon.com.br",
  "dafiti.com.br",
  "zattini.com.br",
  "lojasrenner.com.br",
  "cea.com.br",
  "riachuelo.com.br",
  "marisa.com.br",
  "posthaus.com.br",
  "nike.com",
  "adidas.com",
  "br.puma.com",
  "fila.com.br",
  "hering.com.br",
  "lojasreserva.com.br",
  "useinsider.com.br",
  "newbalance.com.br",
  "vans.com.br",
  "arezzo.com.br",
  "schutz.com.br",
  "farmrio.com.br",
  "zara.com",
  "havaianas.com.br",
  "youcom.com.br",
  "amaro.com",
  "oqvestir.com.br",
  "sephora.com.br",
  "epocacosmeticos.com.br",
  "belezanaweb.com.br",
  "boticario.com.br",
  "natura.com.br",
  "quemdisseberenice.com.br",
  "eudora.com.br",
  "avon.com.br",
  "sallve.com.br",
  "creamy.com.br",
  "simpleorganic.com.br",
  "drogasil.com.br",
  "drogaraia.com.br",
  "drogariasaopaulo.com.br",
  "drogariaspacheco.com.br",
  "panvel.com",
  "paguemenos.com.br",
  "ultrafarma.com.br",
  "araujo.com.br",
  "nissei.com.br",
  "drogariavenancio.com.br",
  "granado.com.br",
  "petlove.com.br",
  "cobasi.com.br",
  "petz.com.br",
  "paodeacucar.com",
  "assai.com.br",
  "shopper.com.br",
  "zonasul.com.br",
  "mambo.com.br",
  "angeloni.com.br",
  "supermuffato.com.br",
  "zaffari.com.br",
  "swift.com.br",
  "ifood.com.br",
  "rappi.com.br",
  "obahortifruti.com.br",
  "naturaldaterra.com.br",
  "daki.com.br",
  "connectparts.com.br",
  "jocar.com.br",
  "autoz.com.br",
  "pneustore.com.br",
  "acheipneus.com.br",
  "dpaschoal.com.br",
  "pneufree.com.br",
  "mercadocar.com.br",
  "lojadomecanico.com.br",
  "dutramaquinas.com.br",
  "palaciodasferramentas.com.br",
  "webmotors.com.br",
  "icarros.com.br",
  "mobiauto.com.br",
  "rihappy.com.br",
  "pbkids.com.br",
  "lego.com",
  "estantevirtual.com.br",
  "leitura.com.br",
  "travessa.com.br",
  "martinsfontespaulista.com.br",
  "livrariadavila.com.br",
  "cirandacultural.com.br",
  "ftd.com.br",
  "playstation.com",
  "steampowered.com",
  "nuuvem.com",
  "epicgames.com",
  "playtech.com.br",
  "madeinbrazil.com.br",
  "musicalexpress.com.br",
  "mundomax.com.br",
  "gog.com",
  "humblebundle.com",
  "play-asia.com",
  "sebodomessias.com.br",
  "agrofy.com.br",
  "mfrural.com.br",
  "globalsources.com",
  "reverb.com",
  "discogs.com",
  "saldaodainformatica.com.br"
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
  const tiktokPath = (() => { try { return new URL(url).pathname.toLowerCase(); } catch { return ""; } })();
  const isTikTokShop = hostMatches(host, "tiktok.com") && (tiktokPath.split("/").includes("shop") || tiktokPath.split("/").includes("product"));
  if (EXCLUDED_HOSTS.some((domain) => hostMatches(host, domain)) && !isTikTokShop) return -100;

  let score = 0;
  const providerScore = Number(result.score || 0);
  score += Math.max(0, providerScore) * 3;
  const store = KNOWN_STORES.some((domain) => hostMatches(host, domain));
  const searchOrHome = looksLikeSearchOrHome(url);
  let pathSuggestsProduct = false;
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    pathSuggestsProduct = segments.some((segment) => segment.length >= 8);
  } catch { /* URL was validated above. */ }
  const direct = isProductPath(url) || (store && !searchOrHome && pathSuggestsProduct);
  if (direct) score += 7;
  if (store) score += 4;
  if (searchOrHome) score -= 7;

  const haystack = (String(result.title || "") + " " + String(result.content || result.description || "")).toLowerCase();
  const words = query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2);
  const uniqueWords = Array.from(new Set(words));
  const matched = uniqueWords.filter((word) => haystack.includes(word)).length;
  if (uniqueWords.length) score += (matched / uniqueWords.length) * 4;
  return { score, direct, store, host };
}

function storeLabel(host) {
  const labels = [
    ["mercadolivre.com.br", "Mercado Livre"],
    ["amazon.com.br", "Amazon Brasil"],
    ["shopee.com.br", "Shopee"],
    ["temu.com", "Temu"],
    ["tiktok.com", "TikTok Shop"],
    ["aliexpress.com", "AliExpress"],
    ["shein.com", "Shein"],
    ["magazineluiza.com.br", "Magalu"],
    ["casasbahia.com.br", "Casas Bahia"],
    ["americanas.com.br", "Americanas"],
    ["carrefour.com.br", "Carrefour"],
    ["olx.com.br", "OLX"],
    ["enjoei.com.br", "Enjoei"],
    ["ebay.com", "eBay"],
    ["etsy.com", "Etsy"],
    ["alibaba.com", "Alibaba"],
    ["dhgate.com", "DHgate"],
    ["banggood.com", "Banggood"],
    ["walmart.com", "Walmart"],
    ["bestbuy.com", "Best Buy"],
    ["elo7.com.br", "Elo7"],
    ["gringa.com.br", "Gringa"],
    ["repassa.com.br", "Repassa"],
    ["shopping.google.com", "Google Shopping"],
    ["zoom.com.br", "Zoom"],
    ["buscape.com.br", "Buscapé"],
    ["promobit.com.br", "Promobit"],
    ["pelando.com.br", "Pelando"],
    ["cuponomia.com.br", "Cuponomia"],
    ["kabum.com.br", "KaBuM!"],
    ["pichau.com.br", "Pichau"],
    ["terabyteshop.com.br", "TerabyteShop"],
    ["fastshop.com.br", "Fast Shop"],
    ["waz.com.br", "WAZ"],
    ["gkinfostore.com.br", "GK InfoStore"],
    ["inpower.com.br", "Inpower"],
    ["guerradigital.com.br", "Guerra Digital"],
    ["ibyte.com.br", "iByte"],
    ["miranda.com.br", "Miranda"],
    ["dell.com", "Dell"],
    ["lenovo.com", "Lenovo"],
    ["samsung.com", "Samsung"],
    ["apple.com", "Apple"],
    ["asus.com", "ASUS"],
    ["acer.com", "Acer"],
    ["logitech.com", "Logitech"],
    ["hp.com", "HP"],
    ["mi.com", "Xiaomi"],
    ["trocafone.com", "Trocafone"],
    ["trocafy.com.br", "Trocafy"],
    ["iplace.com.br", "iPlace"],
    ["girafa.com.br", "Girafa"],
    ["newegg.com", "Newegg"],
    ["bhphotovideo.com", "B&H Photo Video"],
    ["claro.com.br", "Claro Loja"],
    ["lojaonline.vivo.com.br", "Vivo Loja"],
    ["leroymerlin.com.br", "Leroy Merlin"],
    ["madeiramadeira.com.br", "MadeiraMadeira"],
    ["mobly.com.br", "Mobly"],
    ["westwing.com.br", "Westwing"],
    ["tokstok.com.br", "Tok&Stok"],
    ["camicado.com.br", "Camicado"],
    ["telhanorte.com.br", "Telhanorte"],
    ["cec.com.br", "C&C"],
    ["sodimac.com.br", "Sodimac"],
    ["obramax.com.br", "Obramax"],
    ["ferreiracosta.com", "Ferreira Costa"],
    ["havan.com.br", "Havan"],
    ["madesa.com", "Madesa"],
    ["electrolux.com.br", "Electrolux"],
    ["brastemp.com.br", "Brastemp"],
    ["consul.com.br", "Consul"],
    ["tramontina.com.br", "Tramontina"],
    ["midea.com.br", "Midea"],
    ["copafer.com.br", "Copafer"],
    ["balaroti.com.br", "Balaroti"],
    ["mmartan.com.br", "MMartan"],
    ["karsten.com.br", "Karsten"],
    ["buddemeyer.com.br", "Buddemeyer"],
    ["netshoes.com.br", "Netshoes"],
    ["centauro.com.br", "Centauro"],
    ["decathlon.com.br", "Decathlon"],
    ["dafiti.com.br", "Dafiti"],
    ["zattini.com.br", "Zattini"],
    ["lojasrenner.com.br", "Renner"],
    ["cea.com.br", "C&A"],
    ["riachuelo.com.br", "Riachuelo"],
    ["marisa.com.br", "Marisa"],
    ["posthaus.com.br", "Posthaus"],
    ["nike.com", "Nike"],
    ["adidas.com", "Adidas"],
    ["br.puma.com", "Puma"],
    ["fila.com.br", "Fila"],
    ["hering.com.br", "Hering"],
    ["lojasreserva.com.br", "Reserva"],
    ["useinsider.com.br", "Insider"],
    ["newbalance.com.br", "New Balance"],
    ["vans.com.br", "Vans"],
    ["arezzo.com.br", "Arezzo"],
    ["schutz.com.br", "Schutz"],
    ["farmrio.com.br", "Farm Rio"],
    ["zara.com", "Zara"],
    ["havaianas.com.br", "Havaianas"],
    ["youcom.com.br", "Youcom"],
    ["amaro.com", "AMARO"],
    ["oqvestir.com.br", "OQVestir"],
    ["sephora.com.br", "Sephora"],
    ["epocacosmeticos.com.br", "Época Cosméticos"],
    ["belezanaweb.com.br", "Beleza na Web"],
    ["boticario.com.br", "O Boticário"],
    ["natura.com.br", "Natura"],
    ["quemdisseberenice.com.br", "Quem Disse, Berenice?"],
    ["eudora.com.br", "Eudora"],
    ["avon.com.br", "Avon"],
    ["sallve.com.br", "Sallve"],
    ["creamy.com.br", "Creamy"],
    ["simpleorganic.com.br", "Simple Organic"],
    ["drogasil.com.br", "Drogasil"],
    ["drogaraia.com.br", "Droga Raia"],
    ["drogariasaopaulo.com.br", "Drogaria São Paulo"],
    ["drogariaspacheco.com.br", "Drogarias Pacheco"],
    ["panvel.com", "Panvel"],
    ["paguemenos.com.br", "Pague Menos"],
    ["ultrafarma.com.br", "Ultrafarma"],
    ["araujo.com.br", "Drogaria Araujo"],
    ["nissei.com.br", "Nissei"],
    ["drogariavenancio.com.br", "Drogaria Venancio"],
    ["granado.com.br", "Granado"],
    ["petlove.com.br", "Petlove"],
    ["cobasi.com.br", "Cobasi"],
    ["petz.com.br", "Petz"],
    ["paodeacucar.com", "Pão de Açúcar"],
    ["assai.com.br", "Assaí Atacadista"],
    ["shopper.com.br", "Shopper"],
    ["zonasul.com.br", "Zona Sul"],
    ["mambo.com.br", "Mambo"],
    ["angeloni.com.br", "Angeloni"],
    ["supermuffato.com.br", "Super Muffato"],
    ["zaffari.com.br", "Zaffari"],
    ["swift.com.br", "Swift"],
    ["ifood.com.br", "iFood"],
    ["rappi.com.br", "Rappi"],
    ["obahortifruti.com.br", "Oba Hortifruti"],
    ["naturaldaterra.com.br", "Natural da Terra"],
    ["daki.com.br", "Daki"],
    ["connectparts.com.br", "Connect Parts"],
    ["jocar.com.br", "Jocar"],
    ["autoz.com.br", "AutoZ"],
    ["pneustore.com.br", "PneuStore"],
    ["acheipneus.com.br", "Achei Pneus"],
    ["dpaschoal.com.br", "DPaschoal"],
    ["pneufree.com.br", "Pneu Free"],
    ["mercadocar.com.br", "MercadoCar"],
    ["lojadomecanico.com.br", "Loja do Mecânico"],
    ["dutramaquinas.com.br", "Dutra Máquinas"],
    ["palaciodasferramentas.com.br", "Palácio das Ferramentas"],
    ["webmotors.com.br", "Webmotors"],
    ["icarros.com.br", "iCarros"],
    ["mobiauto.com.br", "Mobiauto"],
    ["rihappy.com.br", "Ri Happy"],
    ["pbkids.com.br", "PBKids"],
    ["lego.com", "LEGO"],
    ["estantevirtual.com.br", "Estante Virtual"],
    ["leitura.com.br", "Livraria Leitura"],
    ["travessa.com.br", "Livraria da Travessa"],
    ["martinsfontespaulista.com.br", "Martins Fontes"],
    ["livrariadavila.com.br", "Livraria da Vila"],
    ["cirandacultural.com.br", "Ciranda Cultural"],
    ["ftd.com.br", "FTD"],
    ["playstation.com", "PlayStation Store"],
    ["steampowered.com", "Steam"],
    ["nuuvem.com", "Nuuvem"],
    ["epicgames.com", "Epic Games Store"],
    ["playtech.com.br", "PlayTech"],
    ["madeinbrazil.com.br", "Made in Brazil"],
    ["musicalexpress.com.br", "Musical Express"],
    ["mundomax.com.br", "Mundomax"],
    ["gog.com", "GOG"],
    ["humblebundle.com", "Humble Bundle"],
    ["play-asia.com", "Play-Asia"],
    ["sebodomessias.com.br", "Sebo do Messias"],
    ["agrofy.com.br", "Agrofy"],
    ["mfrural.com.br", "MF Rural"],
    ["globalsources.com", "Global Sources"],
    ["reverb.com", "Reverb"],
    ["discogs.com", "Discogs"],
    ["saldaodainformatica.com.br", "Saldão da Informática"]
  ];
  const match = labels.find(([domain]) => hostMatches(host, domain));
  if (match) return match[1];
  return host.replace(/^www\./, "");
}

function getPageFavicon(result) {
  const candidate = result && typeof result.favicon === "string" ? result.favicon : "";
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch { return null; }
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
  const match = value.match(/R\$\s?\d+(?:\.\d{3})*(?:,\d{2})?(?!\d)/i);
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

  const normalized = query.toLocaleLowerCase("pt-BR");
  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  cacheUrl.searchParams.set("q", normalized);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  try {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  } catch { /* Cache is an optimization, not a requirement. */ }

  const candidates = [];
  const problems = [];
  const termWords = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2);
  const queryTerms = Array.from(new Set(termWords));

  function titleMatchRatio(title) {
    const normalizedTitle = String(title || "").toLocaleLowerCase("pt-BR")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!queryTerms.length) return 1;
    const matchCount = queryTerms.filter((word) => normalizedTitle.includes(word)).length;
    return matchCount / queryTerms.length;
  }

  function secureImage(value) {
    try {
      const u = new URL(String(value || ""));
      if (u.protocol === "http:") u.protocol = "https:";
      return u.protocol === "https:" ? u.href : null;
    } catch { return null; }
  }

  function money(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  function imageForTavily(images, title, productQuery) {
    if (!Array.isArray(images) || !images.length) return null;
    const target = (String(title || "") + " " + String(productQuery || ""))
      .toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const targetTerms = Array.from(new Set(target.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 3)));
    let best = null;
    let bestScore = 0;
    for (const image of images) {
      const description = String((image && (image.description || image.title || image.alt)) || "")
        .toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const url = secureImage(image && (image.url || image.image_url || image.src));
      if (!url || !description) continue;
      const score = targetTerms.filter((word) => description.includes(word)).length;
      if (score > bestScore) { bestScore = score; best = url; }
    }
    return bestScore > 0 ? best : null;
  }

  // Optional source: Mercado Livre item listings. The current API requires an access token.
  // Without one, skip this source rather than failing the whole search.
  if (env.MERCADOLIVRE_ACCESS_TOKEN) {
    try {
      const mlUrl = new URL("https://api.mercadolibre.com/sites/MLB/search");
      mlUrl.searchParams.set("q", query);
      mlUrl.searchParams.set("sort", "price_asc");
      mlUrl.searchParams.set("limit", "50");
      const mlResponse = await fetch(mlUrl.toString(), {
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + env.MERCADOLIVRE_ACCESS_TOKEN
        }
      });
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        const listings = Array.isArray(mlData.results) ? mlData.results : [];
        for (const item of listings) {
          const title = String(item.title || "").trim();
          const url = String(item.permalink || "");
          const price = Number(item.price);
          const ratio = titleMatchRatio(title);
          if (!title || !/^https:\/\//i.test(url) || !Number.isFinite(price) || price <= 0) continue;
          if (queryTerms.length && ratio < (queryTerms.length > 2 ? 0.34 : 0.5)) continue;
          const imageUrl = secureImage(item.secure_thumbnail || item.thumbnail);
          const condition = item.condition === "used" ? "usado" : "novo";
          const originalPrice = Number(item.original_price);
          const shippingFree = Boolean(item.shipping && item.shipping.free_shipping);
          const reasonParts = [];
          if (Number.isFinite(originalPrice) && originalPrice > price) {
            reasonParts.push("O anúncio indica preço promocional: de " + money(originalPrice) + " por " + money(price) + ". Confira a validade e as regras na página do vendedor.");
          }
          if (condition === "usado") {
            reasonParts.push("O anúncio está marcado como usado; o preço menor pode refletir a condição do produto. Confira fotos, descrição, garantia e devolução.");
          }
          if (shippingFree) {
            reasonParts.push("O anúncio indica frete grátis, o que pode reduzir o custo final dependendo do seu CEP.");
          }
          if (!reasonParts.length) {
            reasonParts.push("Este é um dos anúncios de menor preço retornados para a pesquisa. A API não informa um motivo confirmado para o valor; compare modelo, condição, vendedor, frete e garantia.");
          }
          const seller = item.seller && item.seller.nickname ? "Vendedor: " + item.seller.nickname + "." : "";
          const conditionText = condition === "usado" ? "Condição informada: usado." : "Condição informada: novo.";
          const descriptionParts = [seller, conditionText, shippingFree ? "Frete grátis indicado no anúncio." : ""].filter(Boolean);
          candidates.push({
            title: title.slice(0, 180),
            url,
            description: descriptionParts.join(" "),
            domain: "mercadolivre.com.br",
            store: "Mercado Livre",
            imageUrl,
            favicon: "https://www.mercadolivre.com.br/favicon.ico",
            priceMention: money(price),
            priceValue: price,
            priceSource: "listing",
            priceReason: reasonParts.join(" "),
            priceReasonEvidence: (Number.isFinite(originalPrice) && originalPrice > price) || condition === "used" || shippingFree,
            directProductPage: true,
            relevance: Math.round(Math.max(0, Math.min(1, ratio)) * 100),
            sourceQuality: 2
          });
        }
      } else {
        problems.push("marketplace_" + mlResponse.status);
      }
    } catch {
      problems.push("marketplace_unavailable");
    }
  }

  // Web search source for direct product pages.
  if (!env.TAVILY_API_KEY && !env.MERCADOLIVRE_ACCESS_TOKEN) {
    return json({
      error: "search_not_configured",
      message: "A busca ainda não está configurada. Confira o segredo TAVILY_API_KEY no ambiente Production do Cloudflare."
    }, 503, { "Cache-Control": "no-store" });
  }

  if (env.TAVILY_API_KEY) {
    let tavilyResponse;
    try {
      tavilyResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.TAVILY_API_KEY
        },
        body: JSON.stringify({
          query: query + " produto preço comprar no Brasil",
          topic: "general",
          search_depth: "basic",
          max_results: 20,
          country: "brazil",
          language: "pt",
          include_answer: false,
          include_raw_content: false,
          include_images: true,
          include_image_descriptions: true,
          include_favicon: true
        })
      });
    } catch {
      return json({
        error: "search_unavailable",
        message: "O provedor de busca não respondeu. Tente novamente em instantes."
      }, 502, { "Cache-Control": "no-store" });
    }

    if (!tavilyResponse.ok) {
      const status = tavilyResponse.status;
      if (status === 401 || status === 403) {
        return json({
          error: "search_auth_error",
          message: "O Tavily recusou a chave de API. Confirme se TAVILY_API_KEY está correto e salvo como Secret no ambiente Production do Cloudflare."
        }, 502, { "Cache-Control": "no-store" });
      }
      if (status === 429 || status === 432 || status === 433 || status === 402) {
        return json({
          error: "search_limit",
          message: "O limite ou a cota do plano de busca foi atingido. Confira o uso no painel do Tavily e tente novamente mais tarde."
        }, 429, { "Cache-Control": "no-store" });
      }
      return json({
        error: "search_unavailable",
        message: "O Tavily respondeu com erro (" + status + "). Confira o plano e a configuração da API."
      }, 502, { "Cache-Control": "no-store" });
    }

    let tavilyData;
    try { tavilyData = await tavilyResponse.json(); }
    catch {
      return json({
        error: "search_invalid_response",
        message: "O provedor de busca retornou uma resposta inválida. Tente novamente."
      }, 502, { "Cache-Control": "no-store" });
    }
    const rawResults = Array.isArray(tavilyData.results) ? tavilyData.results : [];
    const queryImages = Array.isArray(tavilyData.images) ? tavilyData.images : [];
    for (const item of rawResults) {
      const rating = scoreResult(item, query);
      if (!rating || typeof rating !== "object" || !rating.direct || rating.score < 1) continue;
      const url = String(item.url || "");
      let parsed;
      try { parsed = new URL(url); } catch { continue; }
      if (parsed.protocol !== "https:" || looksLikeSearchOrHome(url)) continue;
      const title = String(item.title || "Produto encontrado").trim();
      const ratio = titleMatchRatio(title);
      if (queryTerms.length && ratio < (queryTerms.length > 2 ? 0.34 : 0.5)) continue;
      const content = String(item.content || item.description || "");
      const pageText = title + " " + content;
      const price = getPriceMention(pageText);
      const priceWhy = explainPrice(pageText);
      const imageUrl = getPageImage(item) || imageForTavily(queryImages, title, query);
      candidates.push({
        title: title.slice(0, 180),
        url: parsed.href,
        description: content.slice(0, 360),
        domain: rating.host,
        store: storeLabel(rating.host),
        imageUrl,
        favicon: getPageFavicon(item),
        priceMention: price ? price.label : null,
        priceValue: price ? price.value : null,
        priceSource: price ? "snippet" : null,
        priceReason: priceWhy.reason,
        priceReasonEvidence: priceWhy.evidenceFound,
        directProductPage: true,
        relevance: Math.round(Math.max(0, Math.min(1, rating.score / 15)) * 100),
        sourceQuality: 1
      });
    }
  }

  // If broad web search didn't find a direct product page, try only the known shopping domains.
  // This extra request runs only when the first pass found no offers, conserving free search credits.
  if (candidates.filter((item) => item.directProductPage).length < 3 && env.TAVILY_API_KEY) {
    try {
      const targetedResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.TAVILY_API_KEY
        },
        body: JSON.stringify({
          query: query + " produto comprar preço",
          topic: "general",
          search_depth: "basic",
          max_results: 20,
          country: "brazil",
          language: "pt",
          include_domains: KNOWN_STORES,
          include_answer: false,
          include_raw_content: false,
          include_images: true,
          include_image_descriptions: true,
          include_favicon: true
        })
      });
      if (targetedResponse.ok) {
        const targetedData = await targetedResponse.json();
        const rawResults = Array.isArray(targetedData.results) ? targetedData.results : [];
        const queryImages = Array.isArray(targetedData.images) ? targetedData.images : [];
        for (const item of rawResults) {
          const rating = scoreResult(item, query);
          if (!rating || typeof rating !== "object" || !rating.direct || rating.score < 1) continue;
          const url = String(item.url || "");
          let parsed;
          try { parsed = new URL(url); } catch { continue; }
          if (parsed.protocol !== "https:" || looksLikeSearchOrHome(url)) continue;
          const title = String(item.title || "Produto encontrado").trim();
          const ratio = titleMatchRatio(title);
          if (queryTerms.length && ratio < (queryTerms.length > 2 ? 0.34 : 0.5)) continue;
          const content = String(item.content || item.description || "");
          const price = getPriceMention(title + " " + content);
          const priceWhy = explainPrice(title + " " + content);
          candidates.push({
            title: title.slice(0, 180),
            url: parsed.href,
            description: content.slice(0, 360),
            domain: rating.host,
            store: storeLabel(rating.host),
            imageUrl: getPageImage(item) || imageForTavily(queryImages, title, query),
            favicon: getPageFavicon(item),
            priceMention: price ? price.label : null,
            priceValue: price ? price.value : null,
            priceSource: price ? "snippet" : null,
            priceReason: priceWhy.reason,
            priceReasonEvidence: priceWhy.evidenceFound,
            directProductPage: true,
            relevance: Math.round(Math.max(0, Math.min(1, rating.score / 15)) * 100),
            sourceQuality: 1
          });
        }
      }
    } catch {
      // Leave the no-result state in place; never invent an offer.
    }
  }

  // Deduplicate direct URLs, preferring the exact listing data over search snippets.
  const byUrl = new Map();
  for (const item of candidates) {
    const key = item.url.replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase();
    const previous = byUrl.get(key);
    if (!previous || item.sourceQuality > previous.sourceQuality ||
        (item.sourceQuality === previous.sourceQuality && item.priceValue !== null && (previous.priceValue === null || item.priceValue < previous.priceValue))) {
      byUrl.set(key, item);
    }
  }
  const results = Array.from(byUrl.values());
  results.sort((a, b) => {
    if (a.priceValue !== null && b.priceValue === null) return -1;
    if (a.priceValue === null && b.priceValue !== null) return 1;
    if (a.priceValue !== null && b.priceValue !== null && a.priceValue !== b.priceValue) return a.priceValue - b.priceValue;
    if (a.sourceQuality !== b.sourceQuality) return b.sourceQuality - a.sourceQuality;
    if (a.relevance !== b.relevance) return b.relevance - a.relevance;
    return a.title.localeCompare(b.title, "pt-BR");
  });

  const topResults = results.slice(0, 12);
  const response = json({
    query,
    results: topResults,
    sort: "price_ascending_when_available",
    source: env.MERCADOLIVRE_ACCESS_TOKEN ? "Mercado Livre API + Tavily Search" : "Tavily Search",
    disclaimer: "As ofertas com preço de listagem são ordenadas do menor para o maior entre os resultados encontrados. Preços podem mudar; valores extraídos de snippets não são confirmação em tempo real. Confira anúncio, vendedor, estado, frete e total antes de comprar."
  });
  try { context.waitUntil(caches.default.put(cacheKey, response.clone())); } catch { /* Cache is optional. */ }
  return response;
}
