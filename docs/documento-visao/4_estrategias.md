# 4 Estratégias de Engenharia de Software

## 4.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software:** Híbrida

**Ciclo de Vida:** Iterativo / Incremental

**Processo:** RAD (Rapid Application Development)


## 4.2 Quadro Comparativo

O quadro a seguir apresenta uma comparação entre o RAD e o OpenUP, ambos são processos híbridos/adaptativos, a análise a seguir demonstra a comparação direta entre os modelos detalhando suas diferenças em estrutura, estratégia e gerenciamento e permite a compreensão e justificativa da escolha que melhor se adequa ao projeto IBRADA-NET.

|Características|Rad|OpenUP|
|-|-|-|
|Abordagem geral|Altamente adaptativa e informal, com foco extremo em velocidade de entrega e interface. |Híbrida e estruturada, equilibrando agilidade com governança e validação arquitetural. |
|Eixo central do processo|Velocidade de entrega,prazos fixos inegociáveis e iteração rápida de interfaces visuais e usuários. |Orientado a Casos de Uso e centrado em uma arquitetura robusta. |
|Estrutura de fases|Quatro fases: Planejamento de requisitos, design do usuário, construção e cutover (implementação final)|Estruturado em 4 fases: Concepção, Elaboração, Construção e Transição, mantendo o desenvolvimento iterativo e incremental dentro delas. |
|Gestão de riscos|Feita majoritariamente pelo feedback contínuo, mas a equipe ainda precisa analisar e mapear os riscos antecipadamente para evitar gargalos.|Proativa. Riscos técnicos e de negócio são mapeados e atacados antecipadamente.|
|Elicitação de requisitos|Feita em oficinas dinâmicas e validada diretamente através da interação com o software.|Baseada em Casos de Uso estruturados, cenários e mapeamento de requisitos não-funcionais. |
|Papel da prototipagem|Central. O protótipo frequentemente evolui até se tornar o próprio sistema final. Estimula a validação contínua dos requisitos, reduz o tempo total de entrega nas timeboxes e promove a mitigação de riscos através do feedback dos protótipos. |Focado em mitigação técnica. Usa-se a "arquitetura executável" para validar integrações, não apenas a interface. |
|Participação do usuário/cliente|Contínua, ativa e indispensável, especialmente na fase de design do usuário. Sem o cliente testando ativamente, o modelo falha. Ciclos curtos de prototipagem-revisão-refinamento.|Importante no início, fim e revisões de iteração, mas o time técnico tem mais autonomia durante a Construção. |
|Documentação|Tende a ser semelhante ao OpenUP, porém, menos formal. mantém a documentação de requisitos, protótipos e validações como medida de rastreabilidade|Enxuta, pragmática, mas presente. Mantém artefatos essenciais para garantir o entendimento e a rastreabilidade. |
|Organização dos requisitos|Listas de funcionalidades (features) flexíveis focadas no fluxo da interface do usuário. |Modelos de Casos de Uso, priorizados pelo valor de negócio e pelo risco técnico associado. |
|Flexibilidade para mudanças|Alta do início ao fim. Mudanças ocorrem baseadas nos feedbacks, mas precisam ser devidamente analisadas, negociadas e priorizadas para preservar o prazo das timeboxes e a viabilidade do projeto. |Alta durante as iterações, porém mudanças arquiteturais profundas são desencorajadas após a fase de Elaboração. |
|Escala e complexidade adequadas|Projetos de curta duração com alto foco em UI/UX e necessidade de validação contínua, mesmo lidando com arquiteturas que exijam integrações. |Projetos de pequeno a médio porte que exigem conexões de banco de dados, integrações e regras de negócio complexas.|
|Limitações principais|Menor adequação para sistemas complexos ou de missão crítica; risco de foco excessivo em interfaces; dependência de comprometimento intenso dos usuários finais; dificuldades com sistemas de grande escala ou alta interoperabilidade com sistemas legados |Pode parecer excessivamente burocrático para projetos simples ou rápidos demais. Curva de aprendizado inicial maior. |
|Complexidade de gerenciamento|Baixa. O controle é focado em entregas rápidas e colaboração direta com usuários|Moderada. Requer acompanhamento de metas de fases, evolução de artefatos e controle de iterações. |
|Tendencias atuais|Integração com DevOps para entrega contínua; incorporação de ferramentas low-code/no-code|Seus princípios sobrevivem em frameworks de agilidade escalada (como SAFe e DAD) que exigem governança sobre o desenvolvimento ágil. |
|Adequação ao projeto IBRADA-NET|Adequado para o projeto: prazos curtos, sistema de informação com forte componente de interface, requisitos difíceis de articular por usuários com baixo letramento digital mas facilmente visualizáveis via protótipos, equipe pequena e necessidade de validação frequente com o cliente |Menos adequado: estrutura focada na estabilidade da arquitetura e na mitigação de riscos por meio de fases bem delimitadas. Não corresponde ao perfil do projeto. Além de estruturar o projeto em fases e focar em criar uma “arquitetura executável”, exigiria uma análise de riscos otimizada a cada ciclo que a equipe não necessariamente possui.|

*Tabela 4: Quadro Comparativo entre RAD e OpenUP*

## 4.3 Justificativa

Com base no nosso produto e suas características, após analisar os problemas enfrentados pelo instituto, o **RAD** será o mais ideal principalmente por ser direcionado a projetos de **menor duração**, com forte participação da interface e necessidade de obtenção de feedback durante a construção do produto. 

Embora o projeto adote uma abordagem híbrida no qual não se pretende realizar um processo baseado em reuniões diárias, parte significativa das decisões será antecipada durante o planejamento. Contudo, a autonomia da equipe precisará ser cuidadosamente equilibrada com a **participação intensa dos usuários**, que é um requisito primário do próprio RAD. O projeto atuará com timeboxes, o que significa que eventuais mudanças solicitadas através dos feedbacks contínuos deverão ser criteriosamente analisadas, negociadas e priorizadas para não comprometerem a viabilidade e os prazos estabelecidos. Permitindo que os ciclos de desenvolvimento sejam executados com maior autonomia pela equipe. As alterações do ágil se encontram primordialmente referente aos **feedbacks mais constantes** nesse processo. 

Outro fator determinante é a natureza do produto. O sistema possui forte componente de **interação com diferentes públicos**, tornando a **prototipação** relevante para apoiar as atividades de especificação e validação da usabilidade. Algumas necessidades tornam-se mais claras quando representadas visualmente em fluxos de interação. No entanto, a equipe tem ciência de que esses protótipos não contemplam sozinhos as regras de negócio, integrações, segurança e requisitos não funcionais. Esses aspectos serão mapeados e tratados estruturalmente, já que a arquitetura do IBRADA-NET envolve frontend, backend, banco de dados, APIs e controle de autenticação. A escolha da estratégia também considera o **prazo reduzido** disponível. O RAD prioriza ciclos curtos e a rápida evolução das soluções, permitindo concentrar o esforço nas funcionalidades de maior relevância para o produto e reduzir o tempo entre a definição de uma solução e sua avaliação.
 
Além disso, a equipe optou por não realizar uma entrega em produção ao final de cada ciclo. Contudo, para garantir o progresso tangível e a avaliação do cliente, **cada ciclo produzirá ao menos um incremento integrado e demonstrável em ambiente de homologação**, onde a validação prática poderá ocorrer. A disponibilização final em produção ocorrerá apenas após a consolidação total do produto. Dessa forma, o RAD apresenta essa série de características que se assemelha mais com como queremos trabalhar com o cliente:

1. Prototipação
2. Feedback e Validação
3. Ciclos Curtos
4. Planejamento Inicial
5. Foco na interface do usuário
6. Equipe pequena

Em comparação com processos como o **OpenUP**, o RAD apresenta maior aderência ao contexto do projeto por colocar maior ênfase na velocidade de desenvolvimento, na prototipação e na validação da interface. O OpenUP, embora também permita desenvolvimento iterativo e adaptativo, possui maior ênfase na estruturação de casos de uso, arquitetura e mitigação de riscos técnicos. Portanto, diante desses motivos, nós escolhemos seguir com o RAD.
