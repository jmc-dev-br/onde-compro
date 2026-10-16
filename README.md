# Onde compro?

Buscador de produtos em português para encontrar ofertas e páginas diretas de compra.

## Diretório de lojas

O site reúne **253 lojas, marketplaces, comparadores e serviços de nicho** organizados em 10 categorias, com um filtro para localizar uma plataforma pelo nome ou domínio. A seleção inclui marketplaces gerais e internacionais, comparadores de preço, tecnologia, casa e construção, moda, beleza e farmácias, supermercados e pets, automotivo, livros e games, agro e itens especializados.

O diretório é uma curadoria ampla, não uma lista literalmente completa de todas as lojas existentes. Algumas lojas atendem apenas certas regiões; lojas internacionais podem exigir importação, frete e impostos adicionais.

## Busca de produtos

Quando a pessoa pesquisa um item, a API tenta retornar até três páginas específicas de produtos, com foto e preço se esses dados estiverem disponíveis. Os resultados com preço identificado são ordenados do menor para o maior. A busca combina resultados gerais e, quando faltam ofertas com preço identificado ou variedade de lojas, faz uma segunda consulta nos domínios catalogados para ampliar a comparação.

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

## Links de afiliados

O backend de busca suporta links comissionados sem modificar o destino dos resultados quando não há integração válida:

- **Amazon Brasil:** define a secret `AMAZON_ASSOCIATES_TAG` no ambiente Production do Cloudflare. A tag é aplicada apenas a URLs HTTPS de páginas diretas de produto da Amazon Brasil.
- **Shopee:** opcionalmente configura `SHOPEE_AFFILIATE_APP_ID` e `SHOPEE_AFFILIATE_APP_SECRET` no Production para pedir links pelo Affiliate Open API. Se a API falhar, o site preserva o link normal.
- **Outros programas:** o proprietário pode cadastrar a URL original do produto e o link oficial de afiliado em [afiliados.html](https://onde-compro.pages.dev/afiliados.html). Os mapeamentos são protegidos por RLS; qualquer visitante pode lê-los para exibir os links, mas só a conta do proprietário pode modificá-los.
- O cartão indica links comissionados e explica que o site pode receber comissão sem custo adicional para o usuário.
- Para Mercado Livre, Temu, TikTok Shop, AliExpress, Awin, Impact e programas semelhantes, use o link gerado pelas ferramentas oficiais. Um mapeamento manual vale para o endereço canônico do produto que foi cadastrado; não inventa tags nem transforma automaticamente todos os produtos de uma loja.

Guia de configuração: [CONFIGURAR-AFILIADOS.md](https://github.com/jmc-dev-br/onde-compro/blob/main/CONFIGURAR-AFILIADOS.md).

**Importante:** o recurso só gera comissão quando a conta do proprietário estiver aprovada no programa e o programa reconhecer o link, o produto e a compra como elegíveis.
