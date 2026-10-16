# Onde compro?

Buscador de produtos em português para encontrar ofertas e páginas diretas de compra.

## Diretório de lojas

O site reúne **187 lojas, marketplaces, comparadores e serviços de nicho** organizados em 10 categorias, com um filtro para localizar uma plataforma pelo nome ou domínio. A seleção inclui marketplaces gerais e internacionais, comparadores de preço, tecnologia, casa e construção, moda, beleza e farmácias, supermercados e pets, automotivo, livros e games, agro e itens especializados.

O diretório é uma curadoria ampla, não uma lista literalmente completa de todas as lojas existentes. Algumas lojas atendem apenas certas regiões; lojas internacionais podem exigir importação, frete e impostos adicionais.

## Busca de produtos

Quando a pessoa pesquisa um item, a API tenta retornar até três páginas específicas de produtos, com foto e preço se esses dados estiverem disponíveis. Os resultados com preço identificado são ordenados do menor para o maior. Se a busca web não encontrar três links diretos, uma segunda consulta tenta pesquisar apenas nos domínios catalogados.

A integração web usa Tavily Search. Há uma busca geral e uma busca de recuperação que só roda quando são encontrados menos de três links diretos, para equilibrar cobertura e uso de créditos. A busca geral da web não garante que todo vendedor ou loja seja pesquisado em todas as consultas.

### Limitações importantes

- Os links devem levar à página específica do anúncio, mas nem todos os resultados de busca permitem confirmar isso automaticamente.
- Um preço extraído de texto indexado pode estar desatualizado; preços de listagem estruturados são preferíveis.
- A explicação de possível preço menor é baseada em sinais textuais (promoção, cupom, Pix, frete, usado, kit ou importado) e não prova que o anúncio seja a melhor oferta.
- O usuário deve confirmar modelo, vendedor, condição, estoque, frete, prazo, garantia e valor final na página da loja. A compra ocorre fora do Onde compro?.

## Configuração da API

1. Gere uma API key em https://app.tavily.com/.
2. No Cloudflare, vá a **Workers & Pages → onde-compro → Settings → Variables and Secrets**.
3. No ambiente **Production**, crie o segredo `TAVILY_API_KEY`.
4. Publique novamente o site. A chave deve ficar no servidor, nunca no HTML ou no repositório público.

A busca principal está implementada em `functions/api/search.js` como Cloudflare Pages Function.

## Desenvolvimento e publicação

Abra `index.html` para conferir o layout. Para testar a Function localmente, use Wrangler Pages com `TAVILY_API_KEY` configurada no ambiente local.

O workflow `.github/workflows/deploy.yml` publica os ativos do site no Cloudflare Pages após alterações na branch `main`. Ele cancela deploys antigos concorrentes para reduzir o risco de uma versão antiga sobrescrever a mais nova.

Segredos do GitHub Actions necessários para publicar:
- `CLOUDFLARE_API_TOKEN`: token com permissão de edição para Cloudflare Pages.
- `CLOUDFLARE_ACCOUNT_ID`: ID da conta Cloudflare.

Site: https://onde-compro.pages.dev/
Repositório: https://github.com/jmc-dev-br/onde-compro
