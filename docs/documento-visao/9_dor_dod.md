# 9 DOR E DOD 
## 9.1 Definition of Ready (DoR)

A Definition of Ready (DoR) é o acordo entre a equipe de desenvolvimento e o cliente que estabelece os critérios e condições mínimas que um requisito deve atender para avançar no fluxo de trabalho. Seu objetivo é garantir clareza, alinhamento e rastreabilidade, reduzindo retrabalho, bloqueios e interrupções durante as sprints e fornecendo uma meta clara ao refinamento do backlog.

A DoR adota a preparação progressiva dos itens: o checklist é aplicado especificamente aos itens selecionados para o próximo ciclo, sem a necessidade de exigir que todo o backlog esteja previamente pronto. Para respeitar os diferentes níveis de maturidade dos requisitos, o acordo separa os critérios em duas etapas sucessivas:

### 1. Pronto para Design de Usuário (Prototipação)

Uma User Story ou requisito é considerado pronto para entrar na etapa de Design de Usuário e elaboração de protótipo quando:

* **Compreensão Geral e Delimitação:** O problema e o objetivo da funcionalidade estão suficientemente compreendidos, identificando-se o fluxo principal esperado. Questões de negócio (por exemplo, quem pode contratar um pacote, quais dados são obrigatórios no cadastro, quando uma inscrição de voluntário é aceita) devem ser avaliadas; se impedirem a compreensão mínima necessária para desenhar o protótipo, precisam ser esclarecidas antes do início do design.

* **Maturidade Inicial:** A história pode permanecer menos detalhada neste momento, focando no entendimento funcional necessário para que o design crie a interface, e depois refinar para a implementação.

* **Estimativa Preliminar:** Avaliação inicial pela equipe quanto à viabilidade e complexidade em relação ao ciclo/sprint.

* **Documentação básica e rastreabilidade:** O requisito está associado a um Tema, Épico e User Story no backlog e vinculado a uma Issue no GitHub Projects.

### 2. Pronto para Construção (Implementação)
Uma User Story é considerada pronta para entrar no ciclo de Construção / Desenvolvimento quando atende integralmente ao checklist abaixo:

* **A User Story apresenta critérios de aceitação verificáveis?:**
 Por estar próxima do desenvolvimento, a User Story deve obrigatoriamente apresentar critérios de aceitação claros, bem delimitados e testáveis. (Histórias mais distantes no backlog podem permanecer menos detalhadas até se aproximarem da execução).

* **O fluxo e as regras de negócio estão claros e sem bloqueios?:**
 Deve-se definir o fluxo principal, as entradas exigidas, as saídas geradas, as restrições do sistema e as Regras de Negócio (RNs) associadas. Dúvidas operacionais e de escopo que impeçam a compreensão ou a estimativa precisa devem ser resolvidas antes da seleção do item para a sprint.

* **O requisito é viável em termos de tempo e complexidade?:**
 A equipe de desenvolvimento deve avaliar e estimar a história (tempo e complexidade via formulário padrão/Google Forms), garantindo que ela é viável para ser concluída dentro de um único ciclo.

* **A User Story possui protótipo validado?:**
 Para itens que envolvem interface visual, deve haver um protótipo associado devidamente validado.

* **A validação e o status de aprovação estão rastreáveis?:** 
 A validação do item deve ficar registrada em ata, vídeo ou comentário na Issue. As decisões devem ser explicitamente identificadas quanto ao seu nível de aprovação:
    * **Decisões Provisórias:** Acordos e ajustes validados com o proxy (Arthur) são registrados como provisórios.
    * **Aprovação Institucional:** Validações feitas pelo proxy e decisões reservadas à presidência (escopo, prioridades, valores de pacotes e uso de imagens ou conhecimentos das comunidades) devem ter sua confirmação formal registrada na reunião/ata de ciclo seguinte.

### Aplicação e Registro do Checklist

* **Rastreabilidade por Ciclo:** A verificação dos critérios da DoR deve ser documentada diretamente no GitHub Projects da equipe para cada um dos itens selecionados para a sprint atual, evidenciando o momento em que a história transicionou de "Pronto para Prototipar" para "Pronto para Implementar".


## 9.2 Definition of Done (DoD)

O Definition of Done (DoD) é o acordo coletivo entre a equipe de desenvolvimento e o cliente que estabelece os critérios e condições necessárias para considerar uma entrega (User Story, requisito ou incremento) como concluída. Caso um item não atenda integralmente a este conjunto de critérios, ele não é considerado concluído nem pode ser entregue ou apresentado como parte do incremento. O conceito de "Done" garante qualidade consistente, rastreabilidade e transparência aos stakeholders sobre o que foi realmente entregue.

Para que um requisito seja considerado concluído ("Done"), a equipe e o cliente devem verificar o cumprimento dos seguintes critérios:

* **O código foi devidamente revisado e integrado?:** O código produzido para a entrega deve ser revisado e aprovado por pelo menos outro membro da equipe de desenvolvimento via Pull Request (PR) aprovado. A funcionalidade deve estar integrada à ramificação principal e disponível e demonstrável em ambiente de homologação, conforme o compromisso da estratégia de desenvolvimento.

* **A funcionalidade atende aos requisitos funcionais e critérios de aceitação?:** A funcionalidade deve implementar todas as Regras de Negócio (RNs) associadas e atender integralmente aos critérios de aceitação testáveis e verificáveis definidos na User Story.

* **Os Requisitos Não Funcionais (RNFs) aplicáveis foram atendidos?:** A entrega deve demonstrar conformidade com os RNFs relevantes para o seu escopo. Conforme a natureza do requisito, devem ser verificados critérios como controle de autorização/acesso, integridade das transações e reservas, responsividade da interface, métricas aceitáveis de desempenho, compatibilidade e proteção de dados sensíveis dos usuários.

* **Os testes foram executados com sucesso (ou com exceção devidamente registrada)?:** A funcionalidade deve contar com a suíte de testes apropriada (ex.: testes unitários de caixa preta cobrindo fluxos válidos/inválidos e testes de interface cobrindo o fluxo esperado).

    * **Regra geral:** Tanto os testes novos quanto os testes legados devem passar com sucesso.

    * **Exceção autorizada:** Caso a execução de algum teste não ocorra por impedimento específico, isso constituirá uma exceção autorizada e não impedirá a conclusão, desde que a justificativa técnica, a análise de risco e o encaminhamento registrado (ex.: débito técnico para o ciclo seguinte) estejam documentados na Issue.

* **A entrega passou pelas etapas de verificação, demonstração e aceite?:** A conclusão da entrega deve distinguir com clareza o papel técnico e a participação do cliente:

    * **1-Verificação Técnica:** Validação do código, cobertura de testes e ausência de regressões efetuada pela equipe de desenvolvimento.

    * **2-Demonstração:** Apresentação da funcionalidade rodando em ambiente de homologação.

    * **3-Aceite Institucional:** Validação formal pelo cliente ou proxy, confirmando o alinhamento com os objetivos de negócio e as decisões operacionais/institucionais.

* **A documentação foi atualizada?:** A documentação do projeto deve ser atualizada, fornecendo evidências e provas da entrega realizada ( atualização de README, GitHub Pages e GitHub Projects).

### Aplicação e Registro do Checklist de DoD

* **Acompanhamento das Entregas:** O registro do checklist do DoD preenchido deve acompanhar obrigatoriamente os itens declarados como concluídos (Done).

* **Maturidade e Progresso:** A ausência do checklist preenchido em itens que ainda estão em desenvolvimento não configura falha do processo enquanto o projeto não os apresentar como concluídos.

