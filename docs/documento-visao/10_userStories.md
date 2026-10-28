# User Stories do Produto

Este documento apresenta as histórias de usuário do produto, distinguindo as histórias selecionadas para o MVP daquelas planejadas para entregas posteriores. Cada história possui identificação própria, requisito funcional de origem, nome, tema e épico relacionados, além de espaços destinados aos critérios de aceitação e à verificação da Definition of Ready (DoR).

As histórias são declaradas preferencialmente no formato:

> Como `<usuário>`, quero `<objetivo>`, para `<benefício ou valor>`.

## Checklist de Definition of Ready (DoR)

Uma história estará preparada para entrar no desenvolvimento do Design de Usuário ou na construção rápida quando atender integralmente à [Definition of Ready definida para o projeto](9_dor_dod.md#91-definition-of-ready-dor). Para cada história, a equipe deve verificar os seguintes itens:

- [ ] **Documentação e rastreabilidade:** a história está associada a um requisito, tema e épico, e essas relações estão atualizadas nas páginas de Requisitos, Backlog e User Stories.
- [ ] **Viabilidade:** o tempo e a complexidade foram avaliados pela equipe por meio do formulário definido para as estimativas, e o trabalho previsto possui tamanho adequado para caber em um ciclo.
- [ ] **Testabilidade e gestão:** os critérios de aceitação estão definidos e são verificáveis, e a história está associada a uma Issue no GitHub Projects.
- [ ] **Clareza e delimitação:** o fluxo principal está compreendido, incluindo entradas necessárias, saídas esperadas, restrições e comportamentos que o sistema não deve permitir.
- [ ] **Regras relacionadas:** as regras de negócio aplicáveis foram identificadas, listadas e vinculadas à história ou ao requisito de origem.
- [ ] **Prototipação, quando aplicável:** as histórias que exigem interface visual possuem protótipo de baixa fidelidade associado e previamente validado pelo cliente ou pelo proxy do cliente.
- [ ] **Validação:** a história foi validada pelo cliente ou pelo proxy, e a aprovação está registrada em ata, vídeo ou comentário na Issue.
- [ ] **Confirmação da validação por proxy:** quando a validação tiver sido realizada pelo proxy, sua confirmação pela presidência está prevista para a reunião do ciclo seguinte.
- [ ] **Decisões reservadas à presidência:** decisões relacionadas a escopo, prioridade, valores dos pacotes e uso de imagens ou conhecimentos das comunidades foram encaminhadas à presidência do IBRADA.

Uma história que não cumpra algum item aplicável deve permanecer em refinamento e não deve ser considerada pronta para implementação. Itens não aplicáveis, como prototipação para histórias sem interface visual, devem ser registrados como `N/A` com uma justificativa breve.

## Critérios de aceitação das histórias

Os critérios abaixo são específicos, verificáveis e vinculados ao requisito de origem. Eles orientam os testes e a validação da história; regras de negócio e requisitos não funcionais relacionados continuam aplicáveis quando indicados no catálogo.

| História | Critérios de aceitação |
| --- | --- |
| US01 | O formulário apresenta perguntas guiadas e permite concluir a triagem sem cadastro. As respostas encaminham o visitante ao setor ou canal correspondente e são registradas. |
| US02 | O catálogo lista experiências com nome, descrição, data, vagas e valor. O visitante consegue abrir uma experiência disponível a partir da listagem. |
| US03 | A tela de detalhes exibe as informações completas da experiência selecionada. O visitante consegue compartilhar o conteúdo sem perder a identificação da experiência. |
| US04 | O cadastro exige os campos obrigatórios e valida formato e unicidade do email. Com dados válidos, a conta é criada e o usuário recebe confirmação. |
| US05 | O cliente autenticado visualiza seus dados atuais. Alterações válidas são salvas e ficam disponíveis no próximo acesso; dados inválidos são rejeitados com mensagem. |
| US06 | Credenciais válidas permitem acesso à conta. Credenciais inválidas não permitem acesso e exibem mensagem sem revelar qual dado falhou. |
| US07 | O cliente consegue encerrar a sessão. Após o encerramento, páginas protegidas exigem nova autenticação. |
| US08 | O cliente consegue selecionar uma experiência com vaga disponível e informar os dados da reserva. O sistema impede reserva quando não há vaga. |
| US09 | Antes do pagamento, o sistema exibe experiência, data, quantidade, valores e condições. A confirmação só prossegue após o cliente confirmar os dados. |
| US10 | O cliente é encaminhado ao gateway externo e visualiza o status retornado. Reserva aprovada gera confirmação; falha não confirma a vaga. |
| US11 | O gestor autenticado consegue cadastrar experiência com campos obrigatórios válidos. A experiência criada aparece no catálogo conforme sua disponibilidade. |
| US12 | O gestor consegue marcar uma experiência como disponível ou indisponível. Experiências indisponíveis não aceitam novas reservas. |
| US13 | O gestor consegue cadastrar oportunidade com habilidades, duração, disponibilidade e projeto. O sistema rejeita campos obrigatórios ausentes. |
| US14 | O visitante visualiza detalhes, habilidades, duração, disponibilidade e projeto da oportunidade selecionada. |
| US15 | O interessado consegue criar perfil com habilidades, experiências, interesses e disponibilidade. O sistema valida os campos obrigatórios antes de salvar. |
| US16 | O voluntário autenticado consegue candidatar-se a uma oportunidade aberta. O sistema impede candidatura duplicada ou para oportunidade encerrada. |
| US17 | Credenciais válidas permitem acesso ao perfil de voluntário. Credenciais inválidas mantêm o usuário fora das áreas protegidas. |
| US18 | O gestor visualiza candidatos agrupados por etapa do funil. Cada candidato exibe dados suficientes para aplicação dos critérios de seleção. |
| US19 | O representante consegue enviar solicitação com dados de contato, tipo e área da parceria. O sistema confirma o envio e registra a solicitação. |
| US20 | O gestor autenticado visualiza a lista e os detalhes das solicitações recebidas. Usuários sem permissão não acessam esse painel. |
| US21 | O interessado visualiza somente oportunidades abertas. A listagem apresenta informações suficientes para decidir se deseja consultar os detalhes. |
| US22 | O voluntário consegue encerrar a sessão. Após sair, o acesso ao perfil e às funções protegidas é bloqueado. |
| US23 | O usuário visualiza a versão vigente do termo antes de aceitar. O sistema registra aceite, data, hora e versão e não permite aceite implícito. |
| US24 | O visitante consegue compartilhar uma experiência por meio do recurso disponível. O conteúdo compartilhado identifica corretamente a experiência. |

---

## User Stories do MVP

## US01 — Realizar triagem

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF05 |
| Tema | T01 — Atendimento e Triagem |
| Épico | EP01 — Triagem e direcionamento |

**História de usuário**

> Como visitante da plataforma, quero responder a um formulário de triagem guiado e simplificado, para ser encaminhado ao setor ou fluxo de comunicação adequado à minha necessidade.

### Critérios de aceitação

- [ ] O formulário apresenta perguntas guiadas e pode ser concluído sem cadastro.
- [ ] As respostas encaminham o visitante ao setor ou canal correspondente e são registradas.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US02 — Visualizar catálogo de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF06 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP02 — Descoberta de experiências e pacotes |

**História de usuário**

> Como visitante, quero visualizar o catálogo de pacotes de ecoturismo, para conhecer as opções disponíveis e escolher a mais adequada ao meu interesse e planejamento.

### Critérios de aceitação

- [ ] O catálogo lista experiências com nome, descrição, data, vagas e valor.
- [ ] O visitante consegue abrir uma experiência disponível a partir da listagem.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US03 — Visualizar detalhes de pacote de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF07 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP02 — Descoberta de experiências e pacotes |

**História de usuário**

> Como visitante, quero visualizar as informações detalhadas de um pacote de ecoturismo selecionado, para planejar minha participação com precisão.

### Critérios de aceitação

- [ ] A tela exibe as informações completas da experiência selecionada.
- [ ] O visitante consegue compartilhar o conteúdo identificando corretamente a experiência.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US04 — Cadastrar-se como cliente

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF08 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP03 — Conta do cliente |

**História de usuário**

> Como visitante da plataforma, quero me cadastrar como cliente de ecoturismo, para criar uma conta pessoal e acessar as funcionalidades de compra de pacotes de ecoturismo.

### Critérios de aceitação

- [ ] O cadastro exige os campos obrigatórios e valida formato e unicidade do email.
- [ ] Com dados válidos, a conta é criada e o usuário recebe confirmação.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US05 — Visualizar e editar dados pessoais

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF09 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP03 — Conta do cliente |

**História de usuário**

> Como cliente, quero visualizar e editar meus dados pessoais registrados, para manter minhas informações corretas e atualizadas durante o uso dos serviços da plataforma.

### Critérios de aceitação

- [ ] O cliente visualiza seus dados atuais e consegue editá-los.
- [ ] Alterações válidas são salvas; dados inválidos são rejeitados com mensagem.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US06 — Autenticar-se como cliente

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF10 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP03 — Conta do cliente |

**História de usuário**

> Como cliente, quero autenticar-me no sistema informando minhas credenciais, para acessar minha conta de forma segura e utilizar as funcionalidades de compra de pacotes de ecoturismo.

### Critérios de aceitação

- [ ] Credenciais válidas permitem acesso à conta.
- [ ] Credenciais inválidas não permitem acesso e exibem mensagem adequada.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US07 — Encerrar sessão de cliente

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF11 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP03 — Conta do cliente |

**História de usuário**

> Como cliente, quero encerrar minha sessão ativa no sistema, para proteger minha conta e impedir acessos não autorizados no dispositivo utilizado.

### Critérios de aceitação

- [ ] O cliente consegue encerrar a sessão.
- [ ] Após o encerramento, páginas protegidas exigem nova autenticação.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US08 — Reservar pacote de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF12 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero realizar a reserva de um pacote de ecoturismo selecionado, para garantir minha vaga na experiência desejada.

### Critérios de aceitação

- [ ] O cliente seleciona uma experiência com vaga disponível e informa os dados da reserva.
- [ ] O sistema impede reserva quando não há vaga.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US09 — Revisar e confirmar reserva

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF13 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero visualizar um resumo completo da minha reserva e confirmar os dados antes do pagamento, para validar as informações do passeio e os valores, evitando erros ou cobranças indevidas.

### Critérios de aceitação

- [ ] O sistema exibe experiência, data, quantidade, valores e condições antes do pagamento.
- [ ] A confirmação só prossegue após o cliente confirmar os dados.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US10 — Pagar reserva

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF14 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero realizar o pagamento dos pacotes de ecoturismo que reservei, para confirmar minha vaga e receber o comprovante da transação.

### Critérios de aceitação

- [ ] O cliente é encaminhado ao gateway externo e visualiza o status retornado.
- [ ] Pagamento aprovado confirma a reserva; falha não confirma a vaga.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US11 — Cadastrar experiência de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF15 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP05 — Gestão de experiências e pacotes |

**História de usuário**

> Como gestor do IBRADA, quero cadastrar novas experiências de ecoturismo, informando seus roteiros, datas, valores e disponibilidade, para oferecê-las aos clientes interessados.

### Critérios de aceitação

- [ ] O gestor cadastra experiência com os campos obrigatórios válidos.
- [ ] A experiência criada aparece no catálogo conforme sua disponibilidade.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US12 — Controlar disponibilidade de pacotes

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF17 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP05 — Gestão de experiências e pacotes |

**História de usuário**

> Como gestor, quero habilitar ou desabilitar a disponibilidade de pacotes de ecoturismo, para controlar a oferta dos pacotes.

### Critérios de aceitação

- [ ] O gestor marca uma experiência como disponível ou indisponível.
- [ ] Experiências indisponíveis não aceitam novas reservas.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US13 — Cadastrar oportunidade de voluntariado

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF18 |
| Tema | T03 — Voluntariado |
| Épico | EP08 — Gestão de oportunidades e candidatos |

**História de usuário**

> Como gestor, quero cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado, para divulgar as vagas disponíveis e atrair voluntários com o perfil adequado às necessidades de cada ação.

### Critérios de aceitação

- [ ] O gestor cadastra oportunidade com habilidades, duração, disponibilidade e projeto.
- [ ] O sistema rejeita campos obrigatórios ausentes.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US14 — Visualizar detalhes da oportunidade

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF22 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como visitante da plataforma, quero visualizar as informações detalhadas de uma oportunidade de voluntariado selecionada, para conhecer o projeto associado, a duração, a disponibilidade e as habilidades requeridas.

### Critérios de aceitação

- [ ] O visitante visualiza detalhes, habilidades, duração, disponibilidade e projeto da oportunidade.
- [ ] A tela identifica claramente a oportunidade selecionada.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US15 — Criar perfil de voluntário

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF23 |
| Tema | T03 — Voluntariado |
| Épico | EP06 — Conta e perfil do voluntário |

**História de usuário**

> Como interessado em atuar como voluntário, quero criar um perfil informando minhas habilidades, experiências, áreas de interesse e disponibilidade, para apresentar ao IBRADA como posso contribuir com seus projetos.

### Critérios de aceitação

- [ ] O interessado cria perfil com habilidades, experiências, interesses e disponibilidade.
- [ ] O sistema valida os campos obrigatórios antes de salvar.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US16 — Candidatar-se a uma oportunidade

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF25 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como voluntário, quero me candidatar a oportunidades de voluntariado que se encaixem no meu perfil, para que o gestor visualize meu interesse em participar do projeto.

### Critérios de aceitação

- [ ] O voluntário autenticado candidata-se a uma oportunidade aberta.
- [ ] O sistema impede candidatura duplicada ou para oportunidade encerrada.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US17 — Autenticar-se como voluntário

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF26 |
| Tema | T03 — Voluntariado |
| Épico | EP06 — Conta e perfil do voluntário |

**História de usuário**

> Como voluntário cadastrado, quero autenticar-me com minhas credenciais, para acessar com segurança meu perfil e as funcionalidades destinadas aos voluntários.

### Critérios de aceitação

- [ ] Credenciais válidas permitem acesso ao perfil de voluntário.
- [ ] Credenciais inválidas mantêm o usuário fora das áreas protegidas.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US18 — Visualizar candidatos em funil

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF28 |
| Tema | T03 — Voluntariado |
| Épico | EP08 — Gestão de oportunidades e candidatos |

**História de usuário**

> Como gestor membro da equipe do IBRADA, quero visualizar os candidatos voluntários de uma oportunidade em formato de funil, para acompanhar com clareza o processo de triagem e seleção.

### Critérios de aceitação

- [ ] O gestor visualiza candidatos agrupados por etapa do funil.
- [ ] Cada candidato exibe dados suficientes para aplicação dos critérios de seleção.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US19 — Enviar solicitação de parceria

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF33 |
| Tema | T04 — Parcerias Institucionais |
| Épico | EP09 — Solicitação e análise de parcerias |

**História de usuário**

> Como representante de uma organização interessada, quero enviar uma solicitação contendo meus dados de contato e as informações da proposta, para iniciar uma possível parceria com o IBRADA.

### Critérios de aceitação

- [ ] O representante envia solicitação com dados de contato, tipo e área da parceria.
- [ ] O sistema confirma o envio e registra a solicitação.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US20 — Visualizar solicitações de parceria

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF34 |
| Tema | T04 — Parcerias Institucionais |
| Épico | EP09 — Solicitação e análise de parcerias |

**História de usuário**

> Como gestor do IBRADA, quero visualizar as solicitações de parceria recebidas e suas informações, para organizar sua análise e entrar em contato com os potenciais parceiros.

### Critérios de aceitação

- [ ] O gestor visualiza a lista e os detalhes das solicitações recebidas.
- [ ] Usuários sem permissão não acessam esse painel.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US21 — Consultar oportunidades abertas

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF21 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como interessado em voluntariado, quero consultar as oportunidades abertas, para encontrar formas de contribuir compatíveis com meus interesses e disponibilidade.

### Critérios de aceitação

- [ ] O interessado visualiza somente oportunidades abertas.
- [ ] A listagem apresenta informações suficientes para consultar os detalhes.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US22 — Encerrar sessão de voluntário

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF27 |
| Tema | T03 — Voluntariado |
| Épico | EP06 — Conta e perfil do voluntário |

**História de usuário**

> Como voluntário autenticado, quero encerrar minha sessão, para proteger minha conta contra acessos não autorizados no dispositivo utilizado.

### Critérios de aceitação

- [ ] O voluntário consegue encerrar a sessão.
- [ ] Após sair, o acesso ao perfil e às funções protegidas é bloqueado.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US23 — Registrar consentimento de uso de dados

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF29 |
| Temas | T02 — Ecoturismo e Reservas; T03 — Voluntariado |
| Épicos | EP03 — Conta do cliente; EP06 — Conta e perfil do voluntário |

**História de usuário**

> Como usuário em processo de cadastro, quero consultar e aceitar explicitamente o termo de uso de dados pessoais, para decidir de forma consciente sobre o tratamento das minhas informações.

### Critérios de aceitação

- [ ] O usuário visualiza a versão vigente do termo antes de aceitar.
- [ ] O sistema registra aceite, data, hora e versão, sem permitir aceite implícito.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---

## US24 — Compartilhar experiência de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF07 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP02 — Descoberta de experiências e pacotes |

**História de usuário**

> Como visitante, quero compartilhar uma experiência de ecoturismo, para apresentá-la a outras pessoas interessadas.

### Critérios de aceitação

- [ ] O visitante compartilha uma experiência pelo recurso disponível.
- [ ] O conteúdo compartilhado identifica corretamente a experiência.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.

---
