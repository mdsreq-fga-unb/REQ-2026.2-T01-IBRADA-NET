# 9 DOR E DOD 
## 9.1 Definition of Ready (DoR)

A DoR é um acordo sobre as condições mínimas e critérios que um requisito precisa atender para entrar no desenvolvimento do Design de Usuário e na construção rápida. Também é o acordo entre a equipe de desenvolvimento e o cliente que garante clareza e alinhamento, reduz retrabalho, bloqueios e interrupções no meio da sprint e dá ao refinamento do Backlog um objetivo claro. Os critérios do DoR estão estruturados como uma lista de perguntas a serem respondidas antes de um requisito ser considerado pronto, dispostas abaixo: 

* O requisito está devidamente documentado?

 O requisito deve estar associado a um Tema, um Épico e a uma User Story e deve estar atualizado nas páginas de Requisitos e Backlog.

* O requisito é viável em termos de tempo e complexidade?

 O requisito deve ter sido avaliado pela equipe de desenvolvimento quanto ao tempo necessário para finalizar a implementação, estimado pelo grupo para caber em um ciclo, e quanto à complexidade, utilizar o google forms para realizar essas estimativas.

* A User Story está definida, é testável e rastreável?

 As User Stories devem ter critérios de aceite bem definidos, testáveis e estar associadas a uma Issue no GitHub Projects

* O requisito está claro e delimitado?

 O requisito deve definir o fluxo principal da funcionalidade, detalhando quais são as entradas necessárias, as saídas geradas pelo sistema e as restrições (o que o sistema não deve fazer). As regras de negócio (RNs) associadas devem estar listadas e vinculadas ao requisito (por exemplo, quem pode contratar um pacote, quais dados são obrigatórios no cadastro, quando uma inscrição de voluntário é aceita).

* A User Story foi prototipada?

 Para as User Stories que necessitam de desenvolvimento de uma interface visual no sistema, deve haver um protótipo de baixa fidelidade associado a ela, assim como este protótipo precisa ter sido previamente validado pelos clientes ou pelo proxy (Arthur)..

* A User Story foi validada pelo cliente?

 A User Story deve ter sido validada pelos clientes ou pelo proxy (Arthur), e a aprovação deve estar registrada em ata, vídeo ou comentário na Issue. A validação feita pelo proxy deve ser confirmada pela presidência na reunião de ciclo seguinte. Decisões de escopo, prioridade, valores de pacotes e uso de imagens ou conhecimentos das comunidades continuam sendo da presidência.

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

 Cada User Story trabalhada deve contar com testes unitários (no mínimo testes de caixa preta cobrindo os fluxos de funcionamento válidos e inválidos) e testes de interface cobrindo o fluxo esperado de funcionamento. Tanto os testes recém-criados quanto os legados devem passar com sucesso (decidir em grupo se entram aqui também os testes de integração/automatizados de pipeline CI). A execução deve ser documentada na Issue da User Story ou, caso não tenha sido realizada, o motivo deve ser detalhado. 
