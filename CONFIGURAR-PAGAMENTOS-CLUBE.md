# Configurar pagamentos do Clube Onde compro?

Esta integração usa o checkout hospedado do Asaas e o Supabase Edge Functions. O site nunca recebe nem armazena número completo de cartão ou código de segurança.

## Estado atual

- Plano configurado no código: **R$ 6,00 por mês**.
- Checkout recorrente implementado: **cartão de crédito**.
- Assinatura confirmada via webhook antes de liberar o selo de membro.
- Cancelamento da renovação implementado.
- Ambiente padrão do backend: `sandbox`.
- **Não aceite pagamentos reais até concluir todos os passos deste guia e testar em sandbox.**
- PIX Automático não está ativado nesta versão. É uma integração separada, com consentimento de recorrência próprio.

## 1. Criar e validar sua conta Asaas

1. Abra [Asaas](https://www.asaas.com/) e crie sua conta.
2. Complete as etapas de identidade e de validação solicitadas pelo provedor.
3. Cadastre a conta bancária de sua titularidade ou o destino de saque/transferência na área financeira do Asaas.
4. Confira em **Menu do usuário → Taxas** os valores aplicados à sua conta. As taxas são descontadas dos pagamentos recebidos; o saldo entra primeiro na conta Asaas e depois pode ser transferido conforme as condições da conta.

Não é necessário enviar senha, cartão, CPF ou chave da API pelo chat.

## 2. Começar no sandbox

Use o ambiente de testes do Asaas primeiro. Crie uma chave de API no sandbox e depois abra as [secrets das Edge Functions do Supabase](https://supabase.com/dashboard/project/ynqtjkdoqmajxtfmpkbt/functions/secrets).

Cadastre os seguintes valores na tela de secrets:

| Nome da variável | Valor |
|---|---|
| `ASAAS_API_KEY` | Chave de API **do sandbox** Asaas |
| `ASAAS_ENVIRONMENT` | `sandbox` |
| `ASAAS_WEBHOOK_TOKEN` | Um token aleatório e privado, com pelo menos 32 caracteres |

Gere o token num gerenciador de senhas. **Não use a chave de API como token do webhook** e não salve nenhuma dessas credenciais no GitHub, em arquivos do site ou no código JavaScript.

## 3. Configurar o webhook no Asaas sandbox

No painel sandbox do Asaas, crie um webhook com estas opções:

- URL: `https://ynqtjkdoqmajxtfmpkbt.supabase.co/functions/v1/asaas-club-webhook`
- Versão da API: `3`
- Ativo: sim
- Envio: sequencial, se disponível
- Token de autenticação: exatamente o mesmo valor salvo em `ASAAS_WEBHOOK_TOKEN`

Selecione estes eventos:

- `CHECKOUT_PAID`
- `CHECKOUT_CANCELED`
- `CHECKOUT_EXPIRED`
- `SUBSCRIPTION_CREATED`
- `SUBSCRIPTION_UPDATED`
- `SUBSCRIPTION_INACTIVATED`
- `SUBSCRIPTION_DELETED`
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`
- `PAYMENT_OVERDUE`
- `PAYMENT_REFUNDED`
- `PAYMENT_CHARGEBACK_DISPUTE`

O backend valida o cabeçalho `asaas-access-token`, associa eventos à conta e não considera a página de retorno como comprovante de pagamento. O Asaas pode reenviar eventos; a integração registra IDs para evitar duplicações.

## 4. Testar antes de vender

1. Abra [Clube Onde compro?](https://onde-compro.pages.dev/clube.html) e entre com uma conta de teste.
2. Clique em **Assinar por R$ 6/mês** enquanto o backend está em sandbox.
3. Conclua o checkout usando apenas os dados de teste fornecidos pela documentação do próprio Asaas.
4. Confira no painel sandbox se o checkout e a assinatura foram criados.
5. Confira os logs de webhook no painel Asaas e confirme que o status da assinatura mudou no site após a confirmação do evento.
6. Teste o cancelamento e confirme no Asaas que a renovação foi encerrada.

Não use cartões reais no sandbox. A assinatura de teste não deve ser tratada como assinatura de produção.

## 5. Ativar produção quando tudo estiver testado

1. No Asaas de produção, confirme sua conta, seus dados financeiros e a conta bancária de recebimento.
2. Gere uma **chave de API de produção**.
3. No Supabase Secrets, substitua `ASAAS_API_KEY` pela chave de produção e altere `ASAAS_ENVIRONMENT` para `production`.
4. Crie também um webhook separado no painel **de produção** com a mesma URL e um token próprio; grave esse token em `ASAAS_WEBHOOK_TOKEN` no Supabase.
5. Faça uma última verificação com um pagamento real de baixo risco, confirme o webhook e o recebimento no painel Asaas antes de divulgar.

As funções consultam `ASAAS_ENVIRONMENT` no servidor, então o status e o cancelamento usam o ambiente correto. Secrets do Supabase são carregados sem precisar incluir as chaves em JavaScript ou no repositório.

## Taxas e valor líquido

Consulte as taxas diretamente na sua conta antes de lançar. A página pública do Asaas mostra uma taxa padrão de cartão de crédito e explica que a condição exata depende do contrato e pode variar após o período promocional: [preços e taxas Asaas](https://www.asaas.com/precos-e-taxas).

Para ter uma noção, usando apenas como estimativa a taxa pública de R$ 0,49 + 1,99% por assinatura, uma cobrança de R$ 6 deixaria cerca de **R$ 5,39 antes de impostos, reembolsos e outros custos**. Aplique as taxas que o painel mostrar para sua conta.

## PIX recorrente

O fluxo atual usa cartão de crédito porque a documentação do Asaas descreve o Checkout recorrente nesse formato. Cobrança Pix avulsa não é igual a uma assinatura. Para oferecer Pix recorrente, integre depois o **Pix Automático**, que requer autorização do pagador e fluxo específico do provedor.

## Segurança

- Nunca exponha `ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN` ou `SUPABASE_SERVICE_ROLE_KEY` no site ou no GitHub.
- O site guarda apenas identificadores e status de assinatura necessários para o acesso.
- Não libere membros só porque a URL de sucesso foi visitada: espere a confirmação assinada pelo webhook.
- Antes de cobrar de clientes reais, tenha termos da assinatura, política de cancelamento/reembolso e política de privacidade adequados ao serviço que será vendido.
