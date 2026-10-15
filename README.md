# Onde compro?

Buscador de produtos em português para encontrar caminhos relevantes para comprar itens comuns ou difíceis de achar.

O site é estático e pode ser hospedado no Cloudflare Pages. A busca monta links para mecanismos de busca e marketplaces conhecidos. Ela não afirma que encontrou o produto mais barato ou o anúncio mais popular sem dados reais de comparação.

## Executar localmente

Abra `index.html` em um navegador.

## Publicação automática

O workflow `.github/workflows/deploy.yml` publica o site no projeto Cloudflare Pages `onde-compro` sempre que há um push para a branch `main`, desde que as credenciais estejam configuradas.

No GitHub, acesse **Settings → Secrets and variables → Actions** e crie estes secrets:

- `CLOUDFLARE_API_TOKEN`: token da API do Cloudflare com permissão de edição para Cloudflare Pages.
- `CLOUDFLARE_ACCOUNT_ID`: ID da conta Cloudflare.

Depois disso, novos commits na branch `main` publicam automaticamente em https://onde-compro.pages.dev/. Não compartilhe o token no código nem no chat.
