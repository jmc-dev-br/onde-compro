# Onde compro?

Buscador de produtos em português para ajudar a encontrar páginas diretas de produtos comuns e itens difíceis de achar.

## Como funciona

1. A pessoa digita o produto.
2. A API consulta resultados da web e prioriza links que parecem apontar para páginas de produtos e lojas conhecidas.
3. O site exibe até três resultados, com links para abrir a página de origem e comprar diretamente na loja.

A classificação é uma estimativa de relevância, não uma garantia de menor preço, qualidade ou confiabilidade do vendedor. Preços, frete, estoque, prazo e condições devem ser verificados no site da loja. A compra acontece fora do Onde compro?.

## Busca

A API usa Tavily Search. O plano gratuito anunciado inclui 1.000 créditos por mês sem exigir cartão de crédito. Em geral, usar uma pesquisa básica ajuda a economizar créditos. Consulte os termos e limites atuais da Tavily antes de lançar para mais usuários.

Para ativar a API no Cloudflare Pages:

1. Crie uma conta em https://www.tavily.com/ e gere uma API key.
2. No Cloudflare, acesse **Workers & Pages → onde-compro → Settings → Variables and Secrets**.
3. Adicione `TAVILY_API_KEY` como **Secret** no ambiente de produção. Depois de alterar o segredo, publique novamente para que a Function de busca receba a configuração atualizada.
4. Faça um novo deploy do projeto.

Mantenha a chave como secret do servidor. Nunca coloque a chave no HTML ou no repositório GitHub.

Quando a chave não está configurada ou a cota acaba, a interface mostra atalhos de busca como alternativa.

## Executar localmente

Abra `index.html` em um navegador para testar o layout. Para testar a busca real, rode o projeto com Pages Functions usando Wrangler e configure `TAVILY_API_KEY` no ambiente local.

## Publicação automática

O workflow `.github/workflows/deploy.yml` publica o projeto no Cloudflare Pages `onde-compro` quando houver um push para a branch `main`.

Os secrets de repositório necessários para publicar são:

- `CLOUDFLARE_API_TOKEN`: token com permissão de edição para Cloudflare Pages.
- `CLOUDFLARE_ACCOUNT_ID`: ID da conta Cloudflare.

Site: https://onde-compro.pages.dev/
