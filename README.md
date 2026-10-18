# Onde compro?

Buscador de produtos em português para encontrar ofertas e páginas diretas de compra.

## Diretório de lojas

O site reúne **268 lojas, marketplaces, comparadores e serviços de nicho** organizados em 10 categorias, com um filtro para localizar uma plataforma pelo nome ou domínio. A seleção inclui marketplaces gerais e internacionais, comparadores de preço, tecnologia, casa e construção, moda, beleza e farmácias, supermercados e pets, automotivo, livros e games, agro e itens especializados.

O diretório é uma curadoria ampla, não uma lista literalmente completa de todas as lojas existentes. Algumas lojas atendem apenas certas regiões; lojas internacionais podem exigir importação, frete e impostos adicionais.

## Busca de produtos

Quando a pessoa pesquisa um item, a API tenta retornar até três páginas específicas de produtos, com foto e preço se os dados estiverem disponíveis. A busca combina resultados gerais e, quando faltam ofertas precificadas ou variedade de lojas, duas consultas direcionadas em grupos de domínios para ampliar a comparação.

A integração web usa Tavily Search. Além dos dados de API de marketplace quando configurados, o backend tenta conferir até cinco páginas diretas por consulta, lendo dados estruturados de produto (Schema.org Product/Offer/AggregateOffer e metadados de preço em BRL). Quando a fonte publica um valor exato, ele é marcado como encontrado na página; quando publica um AggregateOffer com limite inferior e superior, mostramos a faixa. Se a loja bloquear o acesso ou não publicar os metadados, um valor encontrado somente em um trecho indexado fica explicitamente marcado como referência não confirmada.

Os preços são ordenados por confiança: valor retornado pela API/listagem ou encontrado nos dados estruturados da página primeiro, faixa declarada pela página depois, e menções em trechos indexados por último. O filtro de orçamento aceita apenas preço exato identificado por fonte confiável ou uma faixa publicada cujo limite máximo esteja dentro do orçamento. A busca não cobre todos os vendedores nem garante o menor preço absoluto.

### Chat do Comprinho

A página inicial inclui um chat contextual para ajudar a comparar as ofertas da busca atual, explicar indícios de preço, diferenciar valor confirmado de referência e lembrar o que verificar antes da compra. O endpoint é `/api/chat`.

- O chat usa o binding Workers AI chamado `AI` quando configurado. Para habilitar respostas conversacionais com modelo: Cloudflare → Workers & Pages → projeto `onde-compro` → Settings → Bindings → Add → Workers AI → nome da variável `AI`; salve e faça um novo deploy.
- Se o binding não estiver habilitado, o endpoint tenta usar uma resposta baseada na web com a chave `TAVILY_API_KEY`, e mantém uma resposta de contingência fundamentada nos resultados atuais quando a pesquisa falhar.
- O chat não deve inventar preços, estoque, frete ou motivos de desconto. Mesmo um preço extraído da página pode variar no checkout.

### Limitações importantes

- Sites com conteúdo dinâmico, proteção anti-bot ou sem metadados estruturados podem não permitir conferência automática do preço.
- Um preço extraído de texto indexado pode estar desatualizado; a interface identifica esses valores como referência não confirmada.
- A explicação de possível preço menor usa sinais textuais (promoção, cupom, Pix, frete, usado, kit ou importado). Só é exibida como indício quando a fonte contém uma menção correspondente; isso não prova que a oferta seja a melhor.
- O usuário deve confirmar modelo/variante, vendedor, condição, estoque, frete, prazo, garantia e valor final na página da loja. A compra ocorre fora do Onde compro?.

## FairBasket — projeto de impacto social

Este repositório também inclui o protótipo de hackathon **FairBasket**, uma experiência de compras comunitárias transparentes que reaproveita a busca de produtos do Onde compro?.

- Demo pública: https://onde-compro.pages.dev/fairbasket.html
- Contrato Solidity: contracts/FairBasketRegistry.sol
- Resumo, pitch e roteiro de apresentação: HACKATHON-SUBMISSION.md
- Guia de validação social e entrevista com uma organização: FAIRBASKET-VALIDATION.md
- Passos para publicar o contrato de teste: FAIRBASKET-DEPLOY.md

O protótipo começa com um cenário fictício explicitamente identificado. Ele permite buscar ofertas reais pela API existente, marcar a fonte de preço, gerar um registro com SHA-256, exportar um pacote JSON e, após implantação manual do contrato e conexão de uma carteira de teste, ancorar o hash na Base Sepolia. Não movimenta doações ou dinheiro de compras.

**Importante:** a interface do site e o contrato fonte estão no repositório, mas a implantação do contrato e a transação de teste precisam ser concluídas com uma carteira do proprietário antes de afirmar que existe registro on-chain. Os valores de planejamento fictícios não são preços reais nem métricas de economia.

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
