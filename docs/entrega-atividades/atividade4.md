# Atividade 4 - Priorização dos requisitos e definição do MVP

## 1. Avaliação do valor de negócio

Durante a [reunião](../atas-reuniao/ata2.md) foi apurado a pontuação de valor de negócio baseado na medida **MoSCoW** adaptado de 1 a 4 juntamente ao cliente.

### 1.1 Critérios e escala de avaliação

| Pontuação | Classificação | Interpretação |
| --- | --- | --- |
| **4** | Must have | Requisito indispensável para atender uma necessidade central do IBRADA, viabilizar um fluxo principal do produto, atender obrigação relevante ou permitir o funcionamento de outras funcionalidades. |
| **3** | Should have | Requisito importante e com impacto significativo, mas cuja ausência temporária não impede o funcionamento dos principais fluxos do produto. |
| **2** | Could have | Requisito que agrega valor à solução, porém pode ser implementado posteriormente sem comprometer os objetivos principais da primeira versão. |
| **1** | Won't have now | Requisito de baixo valor para o momento atual, podendo ser planejado para versões futuras sem impacto relevante sobre o funcionamento inicial da solução. |


### 1.2 Avaliação dos Requisitos Funcionais

| Código | Requisito | Relação | Valor de negócio | Classificação | Justificativa do cliente |
| --- | --- | --- | ---: | --- | --- |
| RF01 | Cadastrar projetos | CP1 | **4** | Must have | É uma funcionalidade interessante para os gestores e para o público. |
| RF02 | Editar projetos | CP1 | **4** | Must have | É uma funcionalidade interessante para os gestores, complementar ao RF01. |
| RF03 | Remover projetos | CP1 | **4** | Must have | É uma funcionalidade interessante para os gestores, complementar ao RF01. |
| RF04 | Exibir dashboard de impacto | CP1 | **4** | Must have | É uma funcionalidade interessante para os gestores e para o público. |
| RF05 | Apresentar formulário de triagem | CP2 | **4** | Must have | Acelera o processo de comunicação. |
| RF06 | Visualizar catálogo de ecoturismo | CP3 | **4** | Must have | É a forma da instituição iniciar a oferta de pacotes de ecoturismo e beneficiar os agricultores relacionados. |
| RF07 | Detalhar experiências | CP3 | **3** | Should have | Atualmente já existem vídeos das trilhas que podem ser inseridos como conteúdo. Também seria um bom trabalho para voluntários. |
| RF08 | Cadastrar clientes | CP3 | **4** | Must have | É fundamental, pois o ecoturista possui o perfil de cliente do IBRADA. |
| RF09 | Editar perfil de clientes | CP3 | **4** | Must have | É fundamental, pois o ecoturista possui o perfil de cliente do IBRADA. |
| RF10 | Realizar login de cliente | CP3 | **4** | Must have | Complementar ao cadastro do cliente. |
| RF11 | Encerrar sessão de cliente | CP3 | **4** | Must have | Complementar ao cadastro do cliente. |
| RF12 | Selecionar pacote de ecoturismo | CP3 | **4** | Must have | Antes da compra, é essencial realizar a reserva do cliente. |
| RF13 | Confirmar reserva | CP3 | **4** | Must have | O cliente deve poder verificar as informações antes de concluir sua reserva. |
| RF14 | Pagar reserva | CP3 | **4** | Must have | É a primeira ligação comercial que o cliente terá com o IBRADA. |
| RF15 | Cadastrar experiências de ecoturismo | CP3 | **4** | Must have | É importante para que a equipe do IBRADA possa cadastrar novas experiências planejadas. |
| RF16 | Editar experiências de ecoturismo | CP3 | **4** | Must have | Caso similar ao RF15. |
| RF17 | Alterar disponibilidade de experiência de ecoturismo | CP3 | **4** | Must have | Sempre há um limite de vagas para as experiências. |
| RF18 | Cadastrar oportunidades de voluntariado | CP4 | **4** | Must have | Sem o cadastro das oportunidades, não é possível iniciar o relacionamento entre o IBRADA e o voluntário. É uma porta de entrada para esse relacionamento. |
| RF19 | Editar oportunidades de voluntariado | CP4 | **4** | Must have | É importante porque as oportunidades podem sofrer alterações após serem publicadas. |
| RF20 | Gerenciar papel de gestor | CP4 | **4** | Must have | Dependendo do envolvimento do usuário com as operações do IBRADA, é importante ampliar seu acesso às operações do sistema quando necessário. |
| RF21 | Listar oportunidades de voluntariado | CP4 | **4** | Must have | Caso similar ao RF18, sendo importante para estabelecer o relacionamento com os voluntários. |
| RF22 | Visualizar detalhes de oportunidade de voluntariado | CP4 | **4** | Must have | Caso similar à necessidade de detalhamento presente no RF06. |
| RF23 | Cadastrar perfil do voluntário | CP4 | **4** | Must have | Importante para que os gestores possam analisar de forma ágil possíveis voluntários. |
| RF24 | Editar perfil do voluntário | CP4 | **4** | Must have | Caso similar ao RF09. |
| RF25 | Candidatar-se a oportunidade | CP4 | **4** | Must have | É uma expectativa do voluntário poder se candidatar a uma oportunidade disponível. |
| RF26 | Realizar login de voluntário | CP4 | **4** | Must have | Complementar ao cadastro de voluntário. |
| RF27 | Encerrar sessão de voluntários | CP4 | **4** | Must have | Complementar ao cadastro de voluntário. |
| RF28 | Visualizar candidatos | CP4 | **4** | Must have | É um facilitador para a equipe do IBRADA durante a análise dos candidatos. |
| RF29 | Registrar consentimento de uso de dados | CP4 | **4** | Must have | Trata-se de uma exigência legal relacionada ao tratamento de dados pessoais. |
| RF30 | Configurar preferências de notificação | CP5 | **4** | Must have | O usuário deve poder modificar suas preferências e decidir quais notificações deseja receber. |
| RF31 | Exibir estatísticas de alcance das notificações | CP5 | **3** | Should have | É importante para que a equipe do IBRADA possa analisar o alcance e o processo de comunicação dos projetos. |
| RF32 | Gerenciar envio de notificações | CP5 | **2** | Could have | É uma funcionalidade interessante, mas pode ser implementada posteriormente. |
| RF33 | Preencher solicitação de parceria | CP6 | **4** | Must have | O IBRADA não trabalha apenas com clientes, mas também com parceiros. É importante possuir um contato inicial organizado com potenciais parceiros. |
| RF34 | Visualizar propostas de parceria | CP6 | **4** | Must have | É essencial para que a equipe do IBRADA possa visualizar e analisar as possíveis parcerias. |
| RF35 | Enviar resposta de solicitação de parceria | CP6 | **2** | Could have | É uma funcionalidade interessante, mas não é necessária em todos os casos. |


A avaliação do cliente demonstrou uma concentração dos requisitos na categoria **Must have**, refletindo a percepção de que grande parte das funcionalidades contribui diretamente para os principais fluxos da solução.

Nenhum requisito recebeu valor de negócio **1 — Won't have now** nesta avaliação.


## 2. Avaliação do Esforço Técnico

A avaliação técnica dos requisitos funcionais foi realizada pela equipe do projeto considerando três critérios: **esforço necessário para implementação**, **complexidade técnica** e **lacuna de capacidade da equipe**.

Cada critério foi avaliado em uma escala de **1 a 4**, orientada de modo que valores maiores representem maior dificuldade para implementação.

### 2.1 Critérios e escalas de avaliação

=== "Esforço de implementação"

    | Pontuação | Interpretação | Descrição |
    | --- | --- | --- |
    | **1** | Esforço baixo | Até 2 horas |
    | **2** | Esforço moderado | Entre 2 e 6 horas |
    | **3** | Esforço alto | Entre 6 e 12 horas |
    | **4** | Esforço muito alto | Mais de 12 horas |

=== "Complexidade técnica"

    | Pontuação | Interpretação |
    | --- | --- |
    | **1** | Utiliza solução conhecida, com poucas dependências |
    | **2** | Exige alguma investigação ou integração |
    | **3** | Possui várias dependências ou incertezas técnicas |
    | **4** | Apresenta elevada incerteza, integração crítica ou tecnologia não dominada |

=== "Capacidade da equipe"

    | Pontuação | Interpretação |
    | --- | --- |
    | **1** | A equipe domina plenamente os conhecimentos necessários |
    | **2** | A equipe possui conhecimento suficiente, com pouca aprendizagem adicional |
    | **3** | A equipe precisa desenvolver conhecimentos relevantes |
    | **4** | A equipe ainda não possui os conhecimentos ou recursos necessários |

- Consolidação do esforço técnico

Para consolidar os três critérios em uma única medida, foi utilizada a média aritmética:

**Esforço técnico = (Esforço + Complexidade + Lacuna de capacidade) / 3**

O resultado é apresentado em escala de **1 a 4**, mantendo uma casa decimal quando necessário.

## 3. Consolidação das Avaliações

Após a avaliação do **valor de negócio**, realizada com a participação do cliente, e da avaliação do **esforço técnico**, realizada pela equipe do projeto, os resultados foram reunidos em uma única tabela.


| Código | Requisito | Relação | Esforço | Complexidade | Lacuna de capacidade | Esforço técnico consolidado |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| RF01 | Cadastrar projetos | CP1 | 1 | 1 | 2 | **1,3** |
| RF02 | Editar projetos | CP1 | 1 | 1 | 2 | **1,3** |
| RF03 | Remover projetos | CP1 | 1 | 1 | 2 | **1,3** |
| RF04 | Exibir dashboard de impacto | CP1 | 4 | 3 | 4 | **3,6** |
| RF05 | Apresentar formulário de triagem | CP2 | 2 | 2 | 2 | **2,0** |
| RF06 | Visualizar catálogo de ecoturismo | CP3 | 2 | 1 | 1 | **1,3** |
| RF07 | Detalhar experiências | CP3 | 2 | 1 | 1 | **1,3** |
| RF08 | Cadastrar clientes | CP3 | 3 | 3 | 2 | **2,6** |
| RF09 | Editar perfil de clientes | CP3 | 2 | 2 | 2 | **2,0** |
| RF10 | Realizar login de cliente | CP3 | 3 | 3 | 2 | **2,6** |
| RF11 | Encerrar sessão de cliente | CP3 | 1 | 1 | 1 | **1,0** |
| RF12 | Selecionar pacote de ecoturismo | CP3 | 2 | 1 | 1 | **1,3** |
| RF13 | Confirmar reserva | CP3 | 1 | 1 | 1 | **1,0** |
| RF14 | Pagar reserva | CP3 | 4 | 4 | 4 | **4,0** |
| RF15 | Cadastrar experiências de ecoturismo | CP3 | 2 | 2 | 2 | **2,0** |
| RF16 | Editar experiências de ecoturismo | CP3 | 2 | 2 | 2 | **2,0** |
| RF17 | Alterar disponibilidade de experiência de ecoturismo | CP3 | 1 | 2 | 2 | **1,6** |
| RF18 | Cadastrar oportunidades de voluntariado | CP4 | 2 | 2 | 2 | **2,0** |
| RF19 | Editar oportunidades de voluntariado | CP4 | 2 | 2 | 2 | **2,0** |
| RF20 | Gerenciar papel de gestor | CP4 | 3 | 3 | 2 | **2,6** |
| RF21 | Listar oportunidades de voluntariado | CP4 | 1 | 2 | 2 | **1,6** |
| RF22 | Visualizar detalhes de oportunidade de voluntariado | CP4 | 2 | 2 | 1 | **1,7** |
| RF23 | Cadastrar perfil do voluntário | CP4 | 3 | 3 | 2 | **2,6** |
| RF24 | Editar perfil do voluntário | CP4 | 2 | 2 | 2 | **2,0** |
| RF25 | Candidatar-se a oportunidade | CP4 | 2 | 2 | 2 | **2,0** |
| RF26 | Realizar login de voluntário | CP4 | 3 | 3 | 2 | **2,6** |
| RF27 | Encerrar sessão de voluntários | CP4 | 1 | 1 | 1 | **1,0** |
| RF28 | Visualizar candidatos | CP4 | 2 | 1 | 1 | **1,3** |
| RF29 | Registrar consentimento de uso de dados | CP4 | 1 | 1 | 1 | **1,0** |
| RF30 | Configurar preferências de notificação | CP5 | 1 | 1 | 1 | **1,0** |
| RF31 | Exibir estatísticas de alcance das notificações | CP5 | 2 | 2 | 3 | **2,3** |
| RF32 | Gerenciar envio de notificações | CP5 | 1 | 2 | 2 | **1,6** |
| RF33 | Preencher solicitação de parceria | CP6 | 1 | 1 | 1 | **1,0** |
| RF34 | Visualizar propostas de parceria | CP6 | 2 | 2 | 1 | **1,6** |
| RF35 | Enviar resposta de solicitação de parceria | CP6 | 3 | 3 | 3 | **3,0** |

## 4. Construção da matriz 4 × 4



## 5. Definição dos RFs do MVP

## 6. Tratamento dos RNFs

## 7. Validação do MVP