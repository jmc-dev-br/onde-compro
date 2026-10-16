# Onde compro?

Buscador de produtos em português para encontrar caminhos de compra, inclusive itens difíceis de achar.

## O que a busca mostra

- Até três resultados relevantes da web com link para a página de origem.
- Foto do produto quando o buscador encontra imagens associadas à própria página.
- Preço mencionado no resultado quando o trecho de texto permite identificar um valor em reais.
- Uma explicação cautelosa do possível motivo de preço menor quando o texto cita promoção, cupom, desconto no Pix, frete grátis, produto usado/recondicionado, kit ou importação.

As fotos e preços vêm do conteúdo indexado e podem estar incompletos ou desatualizados. A explicação de preço é apenas uma pista textual, não prova de que a oferta é a mais barata. O usuário deve confirmar o preço final, frete, vendedor, estado do produto, estoque, garantia e devolução no site da loja. A compra acontece fora do Onde compro?.

## API de busca

A API é implementada como Cloudflare Pages Function em `functions/api/search.js` e usa Tavily Search. Ela solicita imagens associadas a cada página e retorna dados extraídos de título e snippet.

Para ativar:
1. Gere uma API key em https://app.tavily.com/.
2. No Cloudflare, vá a **Workers & Pages → onde-compro → Settings → Variables and Secrets**.
3. No ambiente **Production**, crie o segredo `TAVILY_API_KEY`.
4. Publique novamente o site.

Não coloque a API key no HTML nem no repositório.

## Desenvolvimento e publicação

Abra `index.html` no navegador para visualizar a página. Para testar a Function localmente, use Wrangler Pages com `TAVILY_API_KEY` configurada no ambiente local.

O workflow `.github/workflows/deploy.yml` publica `index.html`, os ativos e a pasta `functions/` no Cloudflare Pages após cada push para `main`.

Segredos do GitHub Actions necessários para publicar:
- `CLOUDFLARE_API_TOKEN`: token da API com permissão de edição para Cloudflare Pages.
- `CLOUDFLARE_ACCOUNT_ID`: ID da conta Cloudflare.

Site publicado: https://onde-compro.pages.dev/
