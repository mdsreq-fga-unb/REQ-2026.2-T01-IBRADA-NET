# User Stories do Produto

Este documento apresenta as histórias de usuário do produto, distinguindo as histórias selecionadas para o MVP daquelas planejadas para entregas posteriores. Cada história possui identificação própria, requisito funcional de origem, nome, tema e épico relacionados, além de espaços destinados aos critérios de aceitação e à verificação da Definition of Ready (DoR).

As histórias são declaradas preferencialmente no formato:

> Como `<usuário>`, quero `<objetivo>`, para `<benefício ou valor>`.

## Checklist de Definition of Ready (DoR)

Uma história estará preparada para entrar no desenvolvimento do Design de Usuário ou na construção rápida quando atender integralmente à [Definition of Ready definida para o projeto](9_dor_dod.md#91-definition-of-ready-dor). Para cada história, a equipe deve verificar os itens da checklist presente no DoR.

Uma história que não cumpra algum item aplicável deve permanecer em refinamento e não deve ser considerada pronta para implementação. Itens não aplicáveis, como prototipação para histórias sem interface visual, devem ser registrados como `N/A` com uma justificativa breve.

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

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US02 — Visualizar catálogo de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF06 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP02 — Descoberta de experiências e pacotes |

**História de usuário**

> Como visitante, quero visualizar o catálogo de pacotes de ecoturismo, para conhecer as opções disponíveis e escolher a mais adequada ao meu interesse e planejamento.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US03 — Visualizar detalhes de pacote de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF07 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP02 — Descoberta de experiências e pacotes |

**História de usuário**

> Como visitante, quero visualizar as informações detalhadas de um pacote de ecoturismo selecionado, para planejar minha participação com precisão e poder compartilha-lá.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve verificar o preenchimento dos campos obrigatórios.
- [ ] A senha do cadastro deve ter no mínimo 8 caracteres, contendo um caractere maiúsculo, um número e um caractere especial.
- [ ] O sistema deve verificar se o email já foi registrado.
- [ ] O sistema deve retornar uma mensagem de erro caso o cadastro não seja realizado com sucesso.
- [ ] O sistema deve direcionar o usuário para a página de login após o cadastro.

<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve verificar se os dados preenchidos obedecem as regras de seu campo antes do salvamento.
- [ ] O sistema deve retornar uma mensagem de erro em caso a edição não seja concluida e retornar uma mensagem de sucesso caso os dados sejam salvos.

<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve verificar se as credenciais correspondem aos dados registrados da conta.
- [ ] Caso a autenticação falhe, o sistema deve bloquear o acesso e retornar uma mensagem de erro.
- [ ] Caso as credenciais sejam válidas, o sistema deve autenticar o usuário e direcioná-lo à página inicial.
<!--

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve solicitar confirmação antes de encessar a seção do usuário.
- [ ] Após a confirmação, o sistema deve invalidar a seção ativida e retornar para a página inicial ou página de login.
- [ ] Após o encerramento, o sistema deve impedir acesso a regiões protegidas sem uma nova autenticação.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US08 — Reservar pacote de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF12 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero realizar a reserva de um pacote de ecoturismo selecionado, para garantir minha vaga na experiência desejada.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US09 — Revisar e confirmar reserva

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF13 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero visualizar um resumo completo da minha reserva e confirmar os dados antes do pagamento, para validar as informações do passeio e os valores, evitando erros ou cobranças indevidas.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US10 — Pagar reserva

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF14 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP04 — Reserva e pagamento |

**História de usuário**

> Como cliente, quero realizar o pagamento dos pacotes de ecoturismo que reservei, para confirmar minha vaga e receber o comprovante da transação.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US11 — Cadastrar experiência de ecoturismo

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF15 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP05 — Gestão de experiências e pacotes |

**História de usuário**

> Como gestor do IBRADA, quero cadastrar novas experiências de ecoturismo, informando seus roteiros, datas, valores e disponibilidade, para oferecê-las aos clientes interessados.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US12 — Controlar disponibilidade de pacotes

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF17 |
| Tema | T02 — Ecoturismo e Reservas |
| Épico | EP05 — Gestão de experiências e pacotes |

**História de usuário**

> Como gestor, quero habilitar ou desabilitar a disponibilidade de pacotes de ecoturismo, para controlar a oferta dos pacotes.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US13 — Cadastrar oportunidade de voluntariado

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF18 |
| Tema | T03 — Voluntariado |
| Épico | EP08 — Gestão de oportunidades e candidatos |

**História de usuário**

> Como gestor, quero cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado, para divulgar as vagas disponíveis e atrair voluntários com o perfil adequado às necessidades de cada ação.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US14 — Visualizar detalhes da oportunidade

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF22 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como visitante da plataforma, quero visualizar as informações detalhadas de uma oportunidade de voluntariado selecionada, para conhecer o projeto associado, a duração, a disponibilidade e as habilidades requeridas.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve verificar o preenchimento dos campos obrigatórios.
- [ ] A senha do cadastro deve ter no mínimo 8 caracteres, contendo um caractere maiúsculo, um número e um caractere especial.
- [ ] O sistema deve verificar se o email já foi registrado.
- [ ] O sistema deve retornar uma mensagem de erro caso o cadastro não seja realizado com sucesso.
- [ ] Durante o cadastro, o sistema deve permitir se cadastrar como voluntário e registrar habilidades e interesses do usuário.
- [ ] O sistema deve autenticar automaticamento o usuário após cadastro e direcioná-lo a pagina principal.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US16 — Candidatar-se a uma oportunidade

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF25 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como voluntário, quero me candidatar a oportunidades de voluntariado que se encaixem no meu perfil, para que o gestor visualize meu interesse em participar do projeto.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve verificar se as credenciais correspondem aos dados registrados da conta.
- [ ] Caso a autenticação falhe, o sistema deve bloquear o acesso e retornar uma mensagem de erro.
- [ ] Caso as credenciais sejam válidas, o sistema deve autenticar o usuário e direcioná-lo à página inicial.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US18 — Visualizar candidatos em funil

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF28 |
| Tema | T03 — Voluntariado |
| Épico | EP08 — Gestão de oportunidades e candidatos |

**História de usuário**

> Como gestor membro da equipe do IBRADA, quero visualizar os candidatos voluntários de uma oportunidade em formato de funil, para acompanhar com clareza o processo de triagem e seleção.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve permitir o preenchimento dos dados de identificação e contato da organização e representante interessado.
- [ ] O sistema deve disponibilizar uma seção de texto livre para que o usuario possa descrever o tipo de parceria que queira sugerir ou trabalhar.
- [ ] Deve haver um botão para enviar a proposta. O botão deve ser bloqueado caso algum campo de identificação não seja preenchido.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US20 — Visualizar solicitações de parceria

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF34 |
| Tema | T04 — Parcerias Institucionais |
| Épico | EP09 — Solicitação e análise de parcerias |

**História de usuário**

> Como gestor do IBRADA, quero visualizar as solicitações de parceria recebidas e suas informações, para organizar sua análise e entrar em contato com os potenciais parceiros.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---

## US21 — Consultar oportunidades abertas

| Campo | Relação |
| --- | --- |
| Requisito de origem | RF21 |
| Tema | T03 — Voluntariado |
| Épico | EP07 — Descoberta e candidatura |

**História de usuário**

> Como interessado em voluntariado, quero consultar as oportunidades abertas, para encontrar formas de contribuir compatíveis com meus interesses e disponibilidade.

<!--
### Critérios de aceitação

- [ ] A definir durante o refinamento.

### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] O sistema deve solicitar confirmação antes de encessar a seção do usuário.
- [ ] Após a confirmação, o sistema deve invalidar a seção ativida e retornar para a página inicial ou página de login.
- [ ] Após o encerramento, o sistema deve impedir acesso a regiões protegidas sem uma nova autenticação.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

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

- [ ] Durante o cadastro, o sistema deve exibir uma opção para ver os termos de uso de dados pessoais.
- [ ] O sistema deve permitir que o usuário aceite os termos de uso de dados pessoais durante o cadastro.
- [ ] O sistema deve bloquear o cadastro de uma nova conta caso os termos de uso de dados pessoais não sejam aceitos.
<!--
### DoR da história

- [ ] Atende integralmente à DoR da Seção 9.1 e ao checklist definido no início deste documento.
-->

---
