# Afiliados do Onde compro? — configuração

O buscador foi preparado para manter a URL normal do produto e usar um link comissionado apenas quando houver uma integração válida. Não use códigos inventados nem aplique a mesma tag indiscriminadamente a todas as lojas.

## O que já foi implementado

- O backend pode anexar a tag de Associados da Amazon Brasil a uma página direta de produto, quando a secret `AMAZON_ASSOCIATES_TAG` estiver configurada.
- O backend pode solicitar um link curto ao endpoint oficial da Shopee Affiliate Open API quando as duas credenciais da API estiverem configuradas. Se a chamada falhar, o resultado continua com o link normal da loja.
- Um painel privado em [`/afiliados.html`](https://onde-compro.pages.dev/afiliados.html) permite cadastrar links oficiais exatos para outros programas. Ele exige a conta marcada como proprietária no Supabase. A política RLS permite leitura pública dos mapeamentos para que o buscador consiga usá-los, mas só o proprietário pode criar, editar e excluir.
- Quando uma URL de produto corresponde ao registro, o cartão usa o link de afiliado e mostra uma indicação visível de link comissionado. O site não altera o destino para lojas sem uma regra válida.
- A transparência sobre possíveis comissões aparece nos cartões e abaixo dos resultados.

## 1. Ativar Amazon Associados (quando a conta estiver aprovada)

1. Entre no [Portal de Associados Amazon Brasil](https://associados.amazon.com.br/).
2. Copie sua ID de associado/rastreamento para o Brasil (ex.: um identificador terminado em `-20`, mas use a ID real fornecida a você).
3. No [Cloudflare Dashboard](https://dash.cloudflare.com/), abra **Workers & Pages → onde-compro → Settings → Variables and Secrets → Production**.
4. Crie uma **secret** chamada `AMAZON_ASSOCIATES_TAG` com sua ID real.
5. Salve e publique o site. O buscador adicionará/substituirá a query `tag` somente em URLs HTTPS de páginas de produto de `amazon.com.br`.

A integração não cria contas Amazon nem confirma que sua inscrição foi aprovada. Teste no verificador de links do próprio portal e siga as regras atuais de Associados, divulgação de comissões, conteúdo e atribuição da Amazon.

## 2. Ativar Shopee Affiliate Open API (quando tiver credenciais)

1. Cadastre-se e seja aprovado no programa de afiliados da Shopee.
2. Abra o portal oficial [Shopee Affiliate Open API](https://open-api.affiliate.shopee.com.br/explorer) e obtenha as credenciais App ID e Secret, se estiverem disponíveis para sua conta.
3. No Cloudflare **Production → Variables and Secrets**, crie estas secrets:
   - `SHOPEE_AFFILIATE_APP_ID`
   - `SHOPEE_AFFILIATE_APP_SECRET`
4. Publique novamente o site.
5. Faça uma pesquisa que retorne um produto da Shopee e confirme no programa se o link gerado foi atribuído à sua conta.

O buscador limita tentativas de geração por pesquisa e volta ao link original se o serviço rejeitar a chamada. Não salve as credenciais em HTML, JavaScript do navegador, README público ou repositório GitHub.

## 3. Outros marketplaces e redes

O painel privado permite mapear URLs de produto e links que você gerou por uma ferramenta oficial. Este recurso serve para links que não têm uma API de geração automática configurada.

- **Mercado Livre:** entre no [Programa de Afiliados e Criadores](https://www.mercadolivre.com.br/l/comece-a-recomendar), use o Gerador de Links ou a Barra de Afiliados para uma página específica de produto, e copie o link gerado.
- **Temu:** use seu [Programa de Afiliados oficial](https://www.temu.com/br/affiliate_recruit.html) para gerar o link/referral permitido para o produto ou campanha.
- **TikTok Shop:** conclua a verificação de identidade e gere os links de afiliado pelo aplicativo, conforme as instruções oficiais para tráfego externo: [guia para compartilhar links de afiliados](https://seller-br.tiktok.com/university/essay?knowledge_id=3901287218562833&lang=pt-BR).
- **AliExpress, Awin, Impact e outros:** use o deep link ou link de rastreamento gerado pelo painel da sua rede para o anunciante elegível.

Para cadastrar um link no painel:

1. Entre no Onde compro? com sua conta de proprietário.
2. Abra [Gerenciar links de afiliado](https://onde-compro.pages.dev/afiliados.html), disponível também dentro da sua área de conta.
3. Escolha o programa, cole a URL original de produto que aparece no buscador e cole o link de afiliado oficial correspondente.
4. Salve. O mapeamento se aplica quando o buscador retornar aquele mesmo endereço canônico do produto.

Um mapeamento manual é específico para aquele URL. Um produto novo ou uma URL diferente não herdará um link de afiliado automaticamente. Para automatizar uma rede em escala, será preciso ter uma API oficial de deep links ou uma integração de catálogo/feed aprovada.

## 4. Como funciona a correspondência

- O buscador normaliza o endereço original removendo parâmetros comuns de rastreamento e tenta encontrar uma correspondência no catálogo de links.
- Em URLs de produto da Amazon Brasil, a tag pode ser adicionada pelo servidor se `AMAZON_ASSOCIATES_TAG` estiver definida e válida.
- Para Shopee, se as duas secrets existirem, o servidor solicita um deep link à API e só o utiliza se a resposta for HTTPS em um domínio Shopee.
- Se nenhum método funcionar, o cartão continua usando a URL original. A pesquisa nunca deve ser interrompida só porque um programa de afiliados está indisponível.

## 5. Divulgação, atribuição e validação

- Os cartões assinalam links comissionados, e a página informa que o Onde compro? pode receber comissão sem custo adicional para o usuário.
- Não alegue que toda compra vai gerar comissão. A comissão depende de aprovação, produto elegível, último clique, janela de atribuição, cancelamentos, devoluções e regras do programa.
- Confira os links pelo painel oficial de cada programa e faça compras de teste apenas de acordo com seus termos; não clique repetidamente em seus próprios links nem faça compras para gerar comissão.
- O site não processa a compra nem armazena dados de pagamento da loja.
- Antes de divulgar o site, confira também os termos de cada programa, a identificação publicitária adequada e obrigações fiscais aplicáveis.

## Referências oficiais

- [Amazon Associados — SiteStripe](https://associados.amazon.com.br/help/node/topic/GJMMT7G4C8K4Y3AY)
- [Amazon Associados — contrato operacional](https://associados.amazon.com.br/help/operating/agreement)
- [Mercado Livre — gere seus links](https://www.mercadolivre.com.br/l/afiliados-gerar-link)
- [Temu — Programa de Afiliados](https://www.temu.com/br/affiliate_recruit.html)
- [TikTok Shop — guia de links externos de afiliados](https://seller-br.tiktok.com/university/essay?knowledge_id=3901287218562833&lang=pt-BR)
- [Shopee — Affiliate Open API](https://open-api.affiliate.shopee.com.br/explorer)
