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
|Estrutura de fases|Quatro fases: Planejamento de requisitos, design do usuário, construção e cutover (implementação final)|Dividido em 4 macro-fases preditivas: Concepção, Elaboração, Construção e Transição. |
|Gestão de riscos|Reativa. Os riscos são tratados por meio do feedback contínuo do cliente sobre o produto em evolução.|Proativa. Riscos técnicos e de negócio são mapeados e atacados antecipadamente.|
|Elicitação de requisitos|Feita em oficinas dinâmicas e validada diretamente através da interação com o software.|Baseada em Casos de Uso estruturados, cenários e mapeamento de requisitos não-funcionais. |
|Papel da prototipagem|Central. O protótipo frequentemente evolui até se tornar o próprio sistema final, servindo como especificação e validação dos requisitos |Focado em mitigação técnica. Usa-se a "arquitetura executável" para validar integrações, não apenas a interface. |
|Participação do usuário/cliente|Contínua, ativa e indispensável, especialmente na fase de design do usuário. Sem o cliente testando ativamente, o modelo falha. Ciclos curtos de prototipagem-revisão-refinamento.|Importante no início, fim e revisões de iteração, mas o time técnico tem mais autonomia durante a Construção. |
|Documentação|Tende a ser semelhante ao OpenUP, porém, menos formal. mantém a documentação de requisitos, protótipos e validações como medida de rastreabilidade|Enxuta, pragmática, mas presente. Mantém artefatos essenciais para garantir o entendimento e a rastreabilidade. |
|Organização dos requisitos|Listas de funcionalidades (features) flexíveis focadas no fluxo da interface do usuário. |Modelos de Casos de Uso, priorizados pelo valor de negócio e pelo risco técnico associado. |
|Flexibilidade para mudanças|Altíssima do início ao fim. Escopo é constantemente  alterado com base em feedbacks imediatos dos stakeholders.|Alta durante as iterações, porém mudanças arquiteturais profundas são desencorajadas após a fase de Elaboração. |
|Escala e complexidade adequadas|Projetos pequenos, de curta duração, baixa complexidade de backend e alto foco em UI/UX. |Projetos de pequeno a médio porte que exigem conexões de banco de dados, integrações e regras de negócio complexas.|
|Limitações principais|Menor adequação para sistemas complexos ou de missão crítica; risco de foco excessivo em interfaces; dependência de comprometimento intenso dos usuários finais; dificuldades com sistemas de grande escala ou alta interoperabilidade com sistemas legados |Pode parecer excessivamente burocrático para projetos simples ou rápidos demais. Curva de aprendizado inicial maior. |
|Complexidade de gerenciamento|Baixa. O controle é focado em entregas rápidas e colaboração direta com usuários|Moderada. Requer acompanhamento de metas de fases, evolução de artefatos e controle de iterações. |
|Tendencias atuais|Integração com DevOps para entrega contínua; incorporação de ferramentas low-code/no-code|Seus princípios sobrevivem em frameworks de agilidade escalada (como SAFe e DAD) que exigem governança sobre o desenvolvimento ágil. |
|Adequação ao projeto IBRADA-NET|Adequado para o projeto: prazos curtos, sistema de informação com forte componente de interface, requisitos difíceis de articular por usuários com baixo letramento digital mas facilmente visualizáveis via protótipos, equipe pequena e necessidade de validação frequente com o cliente |Menos adequado: estrutura focada na estabilidade da arquitetura e na mitigação de riscos por meio de fases bem delimitadas. Não corresponde ao perfil do projeto. Além de estruturar o projeto em fases e focar em criar uma “arquitetura executável”, exigiria uma análise de riscos otimizada a cada ciclo que a equipe não necessariamente possui.|

*Tabela 4: Quadro Comparativo entre RAD e OpenUP*

## 4.3 Justificativa

Com base no nosso produto e suas características, após analisar os problemas enfrentados pelo instituto, o **RAD** será o mais ideal principalmente por ser direcionado a projetos de **menor duração**, com forte participação da interface e necessidade de obtenção de feedback durante a construção do produto. 

Embora o projeto adote uma abordagem híbrida no qual não se pretende realizar um processo baseado em reuniões diárias ou em alterações constantes de escopo. Parte significativa das decisões será antecipada durante o planejamento, permitindo que os ciclos de desenvolvimento sejam executados com maior autonomia pela equipe. As alterações do ágil se encontram primordialmente referente aos **feedbacks mais constantes** nesse processo. 

Outro fator determinante é a natureza do produto. O sistema possui forte componente de **interação com diferentes públicos**, tornando a **prototipação** especialmente relevante para a validação dos requisitos. Algumas necessidades podem ser difíceis de serem compreendidas ou especificadas apenas por meio de descrições textuais, mas tornam-se mais claras quando representadas por meio de protótipos e fluxos de interação. A escolha também considera o **prazo reduzido** disponível para o desenvolvimento. O RAD prioriza ciclos curtos e a rápida evolução das soluções, permitindo concentrar o esforço nas funcionalidades de maior relevância para o produto e reduzir o tempo entre a definição de uma solução e sua avaliação. 
Além disso, a equipe optou por não realizar uma entrega em produção ao final de cada ciclo. Os ciclos serão utilizados para desenvolver, avaliar e refinar partes do produto em **ambiente de desenvolvimento ou homologação**, enquanto a disponibilização final ocorrerá após a integração e validação do produto. Dessa forma, o RAD apresenta essa série de características que se assemelha mais com como queremos trabalhar com o cliente:

1. Prototipação
2. Feedback e Validação
3. Ciclos Curtos
4. Planejamento Inicial
5. Foco na interface do usuário
6. Equipe pequena

Em comparação com processos como o **OpenUP, o RAD** apresenta maior aderência ao contexto do projeto por colocar maior ênfase na velocidade de desenvolvimento, na prototipação e na validação da interface. O OpenUP, embora também permita desenvolvimento iterativo e adaptativo, possui maior ênfase na estruturação de casos de uso, arquitetura e mitigação de riscos técnicos. Portanto, diante desses motivos, nós escolhemos seguir com o RAD.
