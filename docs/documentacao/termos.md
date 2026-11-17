# Termos de Uso e Política de Privacidade (LGPD)

Os dois documentos ficam em uma única página do site, `/termos`, com as seções `#termos-de-uso` e `#privacidade`. Os links estão no rodapé e no formulário de cadastro.

Atende ao **RF29** (registrar consentimento de uso de dados) e apoia o **RNF08** (proteção de dados pessoais).

## Versão vigente

| Campo | Valor |
| :--- | :--- |
| Versão | 1.0 |
| Data | 05/11/2026 |
| Página | `src/front/app/termos/page.tsx` |
| Constante | `terms` em `src/front/lib/site.ts` |

No cadastro, o sistema deve registrar a data, a hora e a `terms.version` aceita pelo usuário.

## Como atualizar

1. Alterar o texto em `src/front/app/termos/page.tsx`.
2. Atualizar `terms.version` e `terms.updatedAt` em `src/front/lib/site.ts`.
3. Registrar a mudança no histórico abaixo.

## Histórico de versões

| Versão | Data | Descrição |
| :---: | :---: | :--- |
| 1.0 | 05/11/2026 | Versão inicial: Termos de Uso e Política de Privacidade (LGPD). Texto-modelo, pendente de revisão jurídica e confirmação do encarregado de dados pelo IBRADA. |
