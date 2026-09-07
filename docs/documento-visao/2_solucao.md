
# 2. SOLUÇÃO PROPOSTA

## 2.1 Objetivo Geral do Produto

Aprimorar a comunicação e o relacionamento do IBRADA com seus diferentes públicos por meio do desenvolvimento de uma plataforma digital centralizada, que organize e disponibilize suas informações, facilite a divulgação e a contratação de serviços e amplie a participação de clientes, voluntários, apoiadores e parceiros em suas iniciativas sociais e ambientais.

## 2.2 Objetivos Específicos (OE) do Produto

* **OE1:** Otimizar a comunicação entre apoiadores, equipe interna e beneficiários.
* **OE2:** Facilitar a jornada de contratação dos serviços oferecidos pelo IBRADA, reduzindo as dificuldades encontradas pelos interessados desde a descoberta do serviço até sua contratação.
* **OE3:** Ampliar a capacidade do IBRADA de captar clientes, voluntários, apoiadores e parceiros, tornando o relacionamento com esses públicos mais organizado.
* **OE4:** Incentivar o engajamento e aumentar a retenção em projetos ambientais.

## 2.3 Características de Produto (mapeadas com os Objetivos Específicos do Produto)

|ID|Característica|Descrição Resumida|ID|Valor de negócio principal|Contribuição Principal| Contribuição Secundária|
|-|-|-|-|-|-|-|
|CP1|Apresentação e divulgação da história e atuação institucional|A solução deverá disponibilizar informações sobre a história, missão, trajetória, áreas de atuação e iniciativas, de modo a apresentar sua identidade e atuação institucional de forma clara, ampliar sua visibilidade e aproximar a instituição de seus públicos.|VN01|Aumento da visibilidade institucional, fortalecimento da identidade e aproximação com os públicos. |[OE1](#22-objetivos-específicos-oe-do-produto)|[OE4](#22-objetivos-específicos-oe-do-produto)|
|CP2|Divulgação e acompanhamento de projetos socioambientais|A solução deverá disponibilizar informações sobre os projetos e iniciativas socioambientais desenvolvidos ou contratados pelo instituto, de modo a ampliar a visibilidade das iniciativas, incentivar o acompanhamento e promover o engajamento dos públicos.|VN02|Aumento da visibilidade dos projetos, fortalecimento do engajamento e melhoria da retenção dos participantes.|[OE4](#22-objetivos-específicos-oe-do-produto)|[OE1](#22-objetivos-específicos-oe-do-produto)|
|CP3|Comunicação institucional e interação com os públicos |A solução deverá facilitar os recursos de comunicação e interação entre o IBRADA, seus apoiadores, equipe interna, beneficiários e demais públicos, permitindo o envio de dúvidas, sugestões e manifestações, de modo a tornar a comunicação e o relacionamento mais organizados e eficientes e claros.|VN03|Melhoria da comunicação, maior organização do relacionamento e fortalecimento da interação com os públicos.|[OE1](#22-objetivos-específicos-oe-do-produto)|[OE3](#22-objetivos-específicos-oe-do-produto)|
|CP4|Acesso e participação dos públicos|A solução deverá disponibilizar mecanismos que permitam aos diferentes públicos do IBRADA acessar informações, serviços, projetos e oportunidades de participação de acordo com suas necessidades, de modo a apoiar a comunidades com baixo letramento digital.|VN04|Ampliação da capacidade de relacionamento, melhoria da organização dos públicos e aumento da participação. |[OE3](#22-objetivos-específicos-oe-do-produto)|[OE4](#22-objetivos-específicos-oe-do-produto)|
|CP5|Catálogo e contratação de serviços de ecoturismo|A solução deverá disponibilizar um catálogo digital dos serviços de ecoturismo oferecidos pelo IBRADA, com informações de atividades, condições de participação, valores e demais dados relevantes. |VN05|Facilitação da contratação, redução de dificuldades na jornada e ampliação das oportunidades de negócio.|[OE2](#22-objetivos-específicos-oe-do-produto)|[OE3](#22-objetivos-específicos-oe-do-produto)|


## 2.4 Tecnologias a Serem Utilizadas

Para a construção da solução proposta para o IBRADA-NET, serão utilizadas tecnologias compatíveis com a necessidade de escalabilidade da operação digital, segurança no gerenciamento de perfis e desenvolvimento iterativo do produto. A base do projeto será desenvolvida utilizando a **linguagem TypeScript**. No frontend, será utilizado o framework **Next.js**, garantindo a construção de interfaces responsivas, otimizadas e acessíveis para os diferentes públicos da plataforma (turistas, agricultores, voluntários e parceiros). No backend, será utilizado o **NestJS**, favorecendo a implementação de serviços web estruturados, modulares e integrações seguras. Para a persistência de dados, será adotado o banco de dados relacional **MySQL**, considerando que não há necessidade de grandes bancos de dados.

A integração entre os módulos da plataforma e possíveis sistemas externos será realizada por meio de **APIs REST**, permitindo a comunicação eficiente e a sincronização de dados. Para o apoio ao desenvolvimento colaborativo e versionamento de código, serão utilizados **Git e GitHub**, além de práticas de testes e integração contínua compatíveis com a estratégia de desenvolvimento adotada. Por fim, a plataforma tratará a segurança e a privacidade como aspectos críticos que serão integrados ao ciclo de vida do software desde as suas fases iniciais de desenvolvimento. A solução incorpora rigorosos requisitos de **Segurança da Informação** (Security) voltados à proteção dos dados e recursos contra acessos não autorizados, perdas, vazamentos ou modificações maliciosas. Dessa forma, todos os dados pessoais serão armazenados de maneira estritamente segura e auditável, protegendo as operações digitais da plataforma e fortalecendo a relação de confiança com os diferentes públicos do projeto. 


## 2.5 Pesquisa de Mercado e Análise Competitiva

O mercado de ecoturismo é vasto, contando com milhares de agências que  já atendem parcialmente às necessidades do IBRADA. Dessa forma, foram analisadas tanto soluções diretamente relacionadas ao ecoturismo quanto plataformas voltadas ao engajamento social e ao voluntariado. 

Um dos produtos identificados é o **Atados**, uma plataforma de engajamento social que conecta pessoas interessadas em realizar trabalho voluntário a organizações, movimentos e coletivos sociais. A plataforma permite que organizações divulguem vagas de voluntariado e que os usuários encontrem oportunidades de acordo com causas, habilidades e disponibilidade. Dessa forma, o Atados apresenta uma solução consolidada para um dos problemas enfrentados pelo IBRADA: a atração e mobilização de voluntários.

Outro produto relevante é o **Sistema de Agendamento de Visitas e Venda de Ingressos do ICMBio**, utilizado para o agendamento de atividades de ecoturismo e visitação em unidades de conservação federais. O sistema permite que visitantes solicitem o agendamento, acompanhem a solicitação e, quando necessário, realizem o pagamento relacionado à atividade. Essa solução representa uma referência para as funcionalidades de comercialização e agendamento de experiências de ecoturismo previstas no IBRADA-NET.

Essas empresas operam com sites atuais que aliam a venda de pacotes turísticos com um forte impacto social gerado nas comunidades visitadas, mas estas não possuem uma autoridade de uma Organização Sem Fins Lucrativos que atua em frentes estruturais mais profundas. Então apesar de algumas plataformas já existentes apresentarem soluções para alguns problemas existentes do nosso instituto, não atendem integralmente ao escopo. Assim, os produtos analisados não são apenas concorrentes, mas também referências de mercado para funcionalidades específicas. O diferencial do IBRADA-NET está na integração dessas funcionalidades em uma única plataforma, adaptada à realidade e aos objetivos de uma OSCIP ambiental.


## 2.6 Viabilidade da Proposta

A avaliação de viabilidade do projeto IBRADA-NET demonstra que a proposta é exequível dentro dos limites acadêmicos da disciplina, sustentada pelos seguintes pilares:

- **Equipe:** O projeto conta com uma equipe de sete integrantes com papéis bem definidos, abrangendo gerência de projeto, análise de requisitos, desenvolvimento e garantia de qualidade (QA). Essa distribuição permite a paralelização de tarefas e um controle eficiente de qualidade em cada ciclo.
- **Prazo e Metodologia:** O desenvolvimento ocorrerá durante o período do semestre acadêmico, estruturado em nove ciclos de trabalho até o início de dezembro. A adoção da metodologia híbrida com o processo RAD (Rapid Application Development) viabiliza o cumprimento desse prazo, pois prioriza iterações rápidas, foco na interface do usuário e validações constantes por meio de protótipos em vez de documentações exaustivas.
- **Acesso ao Cliente:** A comunicação e a validação com a organização apresentam viabilidade máxima e risco mitigado. A equipe possui contato direto, contínuo e interno com a instituição, contando inclusive com um membro do grupo atuando na função de representante/proxy dos stakeholders no dia a dia. Isso elimina gargalos de agendamento e permite o feedback rápido exigido pelo processo RAD.
- **Conhecimento Técnico Disponível:** O stack tecnológico selecionado é altamente compatível com o domínio técnico já existente na equipe. A familiaridade prévia com o desenvolvimento web focado em interfaces responsivas e criação de serviços modulares com essas ferramentas reduz drasticamente a curva de aprendizado, permitindo que o tempo do semestre seja investido diretamente na implementação das funcionalidades.
- **Possibilidade de Entrega do MVP:** Considerando a delimitação de escopo proporcionada pela matriz de priorização (Valor de Negócio vs. Esforço Técnico) e as entregas incrementais planejadas no cronograma, a construção de um Produto Mínimo Viável é perfeitamente possível.



## 2.7 Benefícios Esperados

- Para o **cliente**: centralizar a comunicação e organizar as informações dispersas, unificando as funcionalidades para operar como um portal institucional engajador. Isso permitirá aumentar a eficiência na divulgação, e impulsionar a venda de pacotes de ecoturismo, além de alavancar a captação de recursos financeiros, atrair novos patrocinadores e articular melhor o recrutamento de voluntários, garantindo a sustentabilidade da organização. 
- Para os **usuários**: proporcionar uma experiência do usuário (UX) mais intuitiva, com informações centralizadas e acessíveis para os múltiplos perfis de acesso. Os turistas terão um processo de compra de ecoturismo claro e direto. Voluntários e patrocinadores encontrarão com facilidade as informações sobre oportunidades de ajuda e engajamento. Já as comunidades tradicionais e agricultores familiares terão acesso menos burocrático e mais claro aos serviços de inclusão socioprodutiva.
