# Atividade 1 - Disponibilização dos requisitos

## [Reunião de elicitação](../atas-reuniao/unidade-2/28-09.md)

## [Reunião de refinamento](../atas-reuniao/unidade-2/04-10.md)

Os requisitos foram disponibilizados no documento de visão na seção [8 - REQUISITOS DE SOFTWARE](../documento-visao/8_requisitos.md). Neste documento se concentra a explicação dessa elicitação e como ocorreu

## Elicitação e Descoberta de Requisitos

Conforme a abordagem de Engenharia de Requisitos adotada, a elicitação não foi tratada como uma simples coleta de dados, mas como um processo contínuo de comunicação, interpretação e mediação com os stakeholders. O foco inicial consistiu em compreender o domínio do negócio do IBRADA e delimitar o problema a ser resolvido, capturando expectativas, necessidades latentes e restrições reais de uso. A transição dessas informações brutas para requisitos estruturados utilizou interações colaborativas (como análise do contexto de uso) para construir um entendimento compartilhado antes da formalização. Essa etapa garantiu que os requisitos fossem orientados a valor, separando claramente o que o sistema deve fazer (Requisitos Funcionais) de como deve se comportar (Requisitos Não Funcionais).   

## Síntese da Lista Final e Versão Avaliada

Para evitar duplicação, as descrições completas e detalhadas dos requisitos encontram-se centralizadas no Catálogo de Requisitos. A versão final avaliada e validada para este ciclo consolidou as seguintes frentes de produto:Gestão e Transparência: Cadastros, edição e painéis de impacto dos projetos, com filtros e gestão de notificações. A versão vigente reflete a decisão de simplificar os fluxos de triagem e unificar os painéis de gestão do IBRADA, diferindo das rodadas iniciais ao integrar um redirecionamento automatizado de WhatsApp e um gateway de pagamento assíncrono para melhorar a taxa de conversão do ecoturismo.

## Tratamento e Validação dos RNFs

Os Requisitos Não Funcionais (RNFs) foram mapeados como critérios críticos de qualidade que restringem e guiam a arquitetura da solução. Eles foram categorizados em dimensões de Usabilidade (responsividade e acessibilidade do formulário), Confiabilidade (integridade ACID contra overbooking), Performance (tempo de carregamento e escalabilidade) e Segurança/Legal (controle de acesso RBAC e conformidade com a LGPD). A validação desses critérios será realizada continuamente por meio de testes de carga, auditorias de segurança e validações de usabilidade junto aos perfis de usuários.  
