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

 O Definition of Done (DoD) é um conjunto de critérios estabelecidos pela equipe para determinar quando uma entrega (história, requisito ou incremento) pode ser considerada concluída, e se o item não atende à DoD, não é considerado concluído nem pode ser entregue ou apresentado como parte do Incremento. O conceito de “Done” indica que a funcionalidade foi desenvolvida, testada, validada e documentada, garantindo qualidade consistente em todas as entregas, rastreabilidade e transparência aos stakeholders sobre o que foi realmente entregue. 
 Os itens que devem ser verificados para determinar se um requisito está “Done” consistem em critérios de aceitação claros, verificáveis e alinhados com o comportamento esperado da entrega. 

* O código foi devidamente revisado?

 O código produzido da entrega em questão deve ser revisado e aprovado por pelo menos uma outra pessoa da equipe de desenvolvimento (Pull Request aprovado).

* A funcionalidade implementada está completa e atende aos requisitos?

 A funcionalidade deve atender a todos os critérios de aceitação definidos na User Story e implementar todas as regras de negócio associadas, utilizando o checklist de critérios presente na Issue.

* A documentação foi atualizada?

 A documentação do projeto deve ser atualizada, evidenciando o cumprimento da entrega com provas do que foi feito (README, Git Pages etc). 

* Os testes automatizados foram executados e passaram?

 Cada User Story trabalhada deve contar com testes unitários (no mínimo testes de caixa preta cobrindo os fluxos de funcionamento válidos e inválidos) e testes de interface cobrindo o fluxo esperado de funcionamento. Tanto os testes recém-criados quanto os legados devem passar com sucesso. A execução deve ser documentada na Issue da User Story ou, caso não tenha sido realizada, o motivo deve ser detalhado.
