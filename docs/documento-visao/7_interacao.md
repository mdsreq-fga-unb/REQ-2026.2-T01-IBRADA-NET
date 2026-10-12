# 7 Interação entre Equipe e Cliente

## 7.1 Composição da Equipe

A equipe contará com um proxy interno do cliente, exercido por Arthur Scartezini, que atuará como facilitador da comunicação entre a equipe de desenvolvimento e os representantes institucionais. Sua proximidade com a perspectiva do cliente permitirá contribuir com opiniões e esclarecimentos durante o levantamento e refinamento dos requisitos, além de favorecer uma comunicação mais informal e ágil. Entretanto, sua atuação terá caráter consultivo, permanecendo a validação formal dos requisitos e a aprovação das entregas sob responsabilidade dos representantes autorizados da instituição.

|**Papel**|**Descrição**|**Responsável**|**Participantes**|
|-|-|-|-|
|Gerente de Projeto |Coordena o projeto, garante a comunicação entre cliente e equipe, controla prazos e entregas.|Filipe|-|
|Analista de Requisitos |Define os requisitos funcionais e não funcionais do sistema e garante que eles sejam atendidos. |Gabriel Guedes|Arthur Scartezini, Cauã Mendes, Gabriel Guedes, Filipe Brito, Igor Lima, Vinícius dos Santos, Zayra Moraes|
|Desenvolvedores|Responsável pela interface do usuário, design e implementação das funcionalidades no lado do cliente ou implementação lógica de negócios, integração com banco de dados e APIs.|Zayra moraes|Arthur Scartezini, Filipe Brito, Igor Lima, Cauã Mendes, Vinicius dos Santos, Gabriel Guedes|
|StakeHolder/representantes Institucionais|Cliente principal |Guilherme Sampaio | Nelson Vicente|
|Cliente Institucional|Define as necessidades institucionais e é a destinatária da solução.|Instituição beneficiária do projeto|Ibrada|Instituição beneficiária do projeto|
|Analista de QA|Garante a qualidade do produto, executando testes de funcionalidade, performance e usabilidade. |Vinicius dos Santos|Gabriel Guedes|

*Tabela 7: Composição da equipe*

Os **stakeholders do projeto** são os representantes institucionais **Guilherme Sampaio e Nelson Vicente**, responsáveis por representar os interesses do cliente, contribuir para a validação dos requisitos e acompanhar as entregas. A **IBRADA**, na condição de **instituição beneficiária e cliente institucional**, define as necessidades institucionais que orientam o desenvolvimento e é a destinatária da solução produzida.

## 7.2 Comunicação

### **Ferramentas de Comunicação**

- **WhatsApp:** meio de comunicação utilizado para o envio de mensagens rápidas e alinhamentos diários entre a equipe. Também será empregado na comunicação com o cliente para demandas simples, como o esclarecimento de dúvidas e o agendamento de reuniões adicionais quando necessário.
- **Goggle Meet/Teams:** as reuniões da equipe serão realizadas de forma remota e gravadas via Google Meet ou Microsoft Teams. As reuniões semanais com o cliente também ocorrerão de maneira remota.
- **Github Projects e Figma:** o fluxo de trabalho será controlado via GitHub Projects, onde serão feitas a distribuição, o controle, o monitoramento e a atualização das atividades de cada ciclo. Para processos mais dinâmicos, como a visualização clara de soluções por meio de protótipos e brainstorming, será utilizada a plataforma Figma. 

### **Métodos e Frequências de Reuniões**

A equipe realiza dois tipos de reuniões durante cada ciclo do processo para garantir que todos estejam alinhados:

- **Planejamento: **reuniões mais longas no início de cada ciclo para definir o planejamento e a distribuição de tarefas. Serão realizadas de forma remota via Teams.
- **Revisão:** reuniões curtas ao final do ciclo para alinhar o progresso de cada membro da equipe sobre o que foi realizado, as dificuldades encontradas e as atividades pendentes. Serão feitas presencialmente quando possível; caso contrário, via Teams ou WhatsApp.

Durante cada ciclo, a comunicação diária entre os membros da equipe será feita pelo WhatsApp para garantir a execução correta do trabalho, esclarecimento de dúvidas e outras atividades diversas.


### **Interações com o cliente:**

- Reuniões de Ciclo: reuniões realizadas remotamente (via Google Meet/Teams) toda semana aos domingos, onde o cliente poderá validar o trabalho da equipe e fornecer feedback.

- Interações e Validações Adicionais: interações focadas em garantir o alinhamento do trabalho da equipe com as demandas do cliente, realizadas via WhatsApp. Podem ocorrer conforme a necessidade para tirar dúvidas, refinar requisitos, fazer ajustes imediatos, entre outros.


## 7.3 Processo de Validação

O processo de validação será estruturado de forma sistemática em três etapas principais:

- Antes do desenvolvimento, os requisitos serão refinados e seus critérios de aceitação definidos com base nas necessidades identificadas junto aos stakeholders. Posteriormente, passarão pelo Definition of Ready (DoR), responsável por verificar se apresentam clareza, completude, viabilidade e critérios de aceitação previamente estabelecidos, garantindo condições adequadas para iniciar a implementação.

- Durante o desenvolvimento, a equipe realizará verificações internas por meio de testes unitários, de integração e funcionais, além da revisão da implementação em relação aos requisitos estabelecidos. O Definition of Done (DoD) estabelecerá as condições necessárias para considerar uma funcionalidade concluída, incluindo aprovação nos testes previstos, atendimento aos critérios técnicos e ausência de defeitos críticos conhecidos.

- Durante o desenvolvimento, após as verificações internas de cada incremento, as funcionalidades poderão ser apresentadas aos representantes institucionais para validação preliminar de sua aderência às necessidades identificadas. Sempre que possível, também serão realizadas avaliações de usabilidade com usuários representativos dos públicos atendidos, considerando a facilidade de uso, a compreensão das interfaces e os aspectos de acessibilidade. Os feedbacks coletados serão documentados e utilizados para orientar ajustes nos ciclos seguintes. Essas avaliações terão caráter intermediário e não substituirão os testes formais de aceitação.

- Após a conclusão das funcionalidades previstas e a aprovação nas verificações internas, uma versão estável do sistema será submetida aos testes de aceitação do usuário (UAT), com a participação dos representantes autorizados do cliente. Os testes serão conduzidos com base nos requisitos e critérios de aceitação previamente acordados, com o objetivo de verificar se a solução atende às necessidades institucionais e está apta para aceitação. Os resultados serão registrados, indicando a aprovação, a necessidade de correções ou a existência de pendências. A homologação ocorrerá após a aprovação no UAT e a resolução de eventuais inconformidades consideradas impeditivas.
