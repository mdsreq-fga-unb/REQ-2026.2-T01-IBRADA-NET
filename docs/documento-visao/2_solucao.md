
# 2. SOLUÇÃO PROPOSTA

## 2.1 Objetivo Geral do Produto

Aprimorar a comunicação e o relacionamento do IBRADA com seus diferentes públicos por meio do desenvolvimento de uma plataforma digital centralizada, que organize e disponibilize suas informações, facilite a divulgação e a contratação de serviços e amplie a participação de clientes, voluntários, apoiadores e parceiros em suas iniciativas sociais e ambientais.

## 2.2 Objetivos Específicos (OE) do Produto

* **OE1:** Otimizar e centralizar o fluxo de comunicação, atendimento e relacionamento com os diferentes públicos.
* **OE2:** Estruturar processos de captação e conversão de interessados em clientes, apoiadores e parceiros.
* **OE3:** Estruturar o processo de recrutamento, seleção e engajamento de voluntários. 

## 2.3 Características de Produto (mapeadas com os Objetivos Específicos do Produto)

|ID|Característica|Descrição Resumida|ID|Valor de negócio principal|Contribuição Principal| Contribuição Secundária|
|-|-|-|-|-|-|-|
|CP1|Gestão e Transparência de Projetos|A solução deverá permitir ao IBRADA cadastrar, organizar e disponibilizar informações sobre seus projetos nas suas frentes principais, incluindo iniciativas realizadas, em andamento ou propostas não executadas. O dashboard deverá exibir indicadores de impacto e permitir filtragem por área de atuação, status e período, de modo a demonstrar capacidade de execução e oferecer transparência aos apoiadores e patrocinadores. |VN01|Aumento da visibilidade institucional dos projetos, demonstração de impacto real e fortalecimento da credibilidade junto a apoiadores e patrocinadores. |[OE1](#22-objetivos-específicos-oe-do-produto)|[OE2](#22-objetivos-específicos-oe-do-produto)|
|CP2|Canal Unificado de Atendimento e Triagem|A solução deverá centralizar o recebimento de dúvidas sobre projetos, solicitações de serviços, interesse em voluntariado e manifestações de apoiadores. A plataforma deverá identificar o tipo de solicitação e o perfil do usuário mediante formulário guiado. A triagem levará o usuário à ferramenta Whatsapp com orientações específicas de acordo com a triagem. |VN02|Melhoria da organização do atendimento, redução de perda de contatos e resposta mais ágil às solicitações dos públicos. |[OE1](#22-objetivos-específicos-oe-do-produto)|[OE2](#22-objetivos-específicos-oe-do-produto)|
|CP3|Módulo Transacional de Ecoturismo |A solução deverá permitir aos usuários consultar o catálogo de pacotes de ecoturismo, visualizar descrições, datas, disponibilidade de vagas, valores e condições de participação. |VN03|Facilitação da contratação de pacotes de ecoturismo, redução de fricção na jornada do cliente e ampliação das oportunidades de receita.|[OE2](#22-objetivos-específicos-oe-do-produto)|[OE1](#22-objetivos-específicos-oe-do-produto)|
|CP4|Gestão do Ciclo de Voluntariado |A solução deverá permitir ao IBRADA cadastrar oportunidades e demandas de voluntariado, especificando habilidades requeridas, disponibilidade, duração e projeto associado.  A plataforma oferecerá um funil visual onde a equipe poderá: visualizar candidaturas, filtrar e comparar candidatos por habilidades/perfil.|VN04|Ampliação da capacidade de captar e articular voluntários, redução do esforço manual de seleção e melhoria na alocação de talentos aos projetos. |[OE3](#22-objetivos-específicos-oe-do-produto)|[OE2](#22-objetivos-específicos-oe-do-produto)|
|CP5|Sistema de Notificações e Engajamento |A solução deverá permitir envio de notificações direcionadas aos diferentes públicos do IBRADA com base em seus perfis e interesses declarados. O sistema deverá notificar sobre: novas oportunidades de voluntariado alinhadas ao perfil, novos projetos lançados na área de interesse, chamados para financiamento de iniciativas específicas, atividades de ecoturismo próximas ao período de interesse.|VN05|Ampliação da captação de clientes, voluntários e apoiadores, melhoria da retenção e personalização da experiência de cada público.|[OE2](#22-objetivos-específicos-oe-do-produto)|[OE3](#22-objetivos-específicos-oe-do-produto)|
|CP6|Gestão de Solicitações de Parcerias |A solução deverá permitir que empresas e organizações externas façam solicitações de parcerias com o IBRADA através de um formulário simplificado. Para a equipe do IBRADA, a plataforma deverá oferecer um painel centralizado visualizando todas as solicitações de parceria recebidas, com as informações coletadas. A equipe poderá adicionar notas internas e enviar resposta para a empresa solicitante via email. |VN6|Centralização e organização das solicitações de parceria, redução de perda de contatos de parceiros em potencial, melhoria da transparência no processo de análise e facilitação da gestão interna dessas demandas. |[OE1](#22-objetivos-específicos-oe-do-produto)|[OE2](#22-objetivos-específicos-oe-do-produto)|

*Tabela 3: Tabela com características de produto*

## 2.4 Tecnologias a Serem Utilizadas

Para a construção da solução proposta para o IBRADA-NET, serão utilizadas tecnologias adequadas ao desenvolvimento de uma plataforma digital com forte presença de elementos visuais, gerenciamento seguro de perfis e evolução iterativa. A base do projeto será desenvolvida em TypeScript. No frontend, será utilizado o framework Next.js, que possibilita a criação de interfaces responsivas, otimizadas e acessíveis aos diferentes públicos da plataforma, como turistas, agricultores, voluntários e parceiros. No backend, será utilizado o NestJS, que favorece a implementação de serviços web estruturados e modulares, bem como a realização de integrações seguras.

Para a persistência dos dados, será utilizado o MySQL Community Edition, sistema gerenciador de banco de dados relacional gratuito e de código aberto, disponibilizado sob a licença GPL. Sua adoção é adequada ao projeto porque os dados de usuários, experiências, reservas, pagamentos, projetos e candidaturas possuem relações entre si, e determinadas operações precisam preservar a integridade e a consistência das informações. A escolha também considera sua ampla documentação, o suporte de uma comunidade ativa e a disponibilidade de ferramentas que facilitam sua administração. A IBRADA já mantém um site hospedado e, portanto, já possui despesas relacionadas à hospedagem. Caso o plano contratado seja compatível com o MySQL e disponha dos recursos necessários, essa infraestrutura poderá ser aproveitada para o novo sistema. O uso do MySQL Community Edition não implicará custos de licenciamento; entretanto, poderão surgir despesas adicionais caso seja necessário ampliar o plano atual, contratar um serviço específico de banco de dados ou aumentar a capacidade de armazenamento, processamento, segurança e realização de backups. Essa necessidade será avaliada conforme os requisitos técnicos e o volume de utilização da plataforma. A administração do banco seguirá práticas de segurança, controle de acesso, monitoramento e manutenção de cópias de segurança.

Para apoiar a concepção das interfaces, será utilizado o Figma na elaboração de protótipos, na definição dos fluxos de navegação e na validação visual antes da implementação. Nos testes automatizados, será empregado o Jest, ferramenta do ecossistema TypeScript com função de realizar testes consistentes. No frontend, o Jest será utilizado com a React Testing Library para verificar componentes e interações; no backend, será associado ao Supertest para testar os serviços e endpoints das APIs. Esses testes poderão ser integrados ao processo de integração contínua por meio do GitHub Actions.

## 2.5 Pesquisa de Mercado e Análise Competitiva

O IBRADA-NET se insere em um mercado em crescimento de soluções digitais para ONGs ambientais e institutos de desenvolvimento socioeconômico sustentável. A pesquisa abaixo analisa plataformas e institutos que oferecem funcionalidades similares, identificando diferencias, lacunas e oportunidades. 

- **[Instituto Semeia](semeia.org.br)** 

O instituto Semeia é um portal institucional com biblioteca de conhecimento (publicações, podcasts, artigos), divulgação de iniciativas e projetos relacionados a parques com uma agenda de eventos (seminários, lives, conferências). Semeia é um modelo de como divulgar iniciativas ambientais com qualidade e construir reputação. Porém, IBRADA-NET vai além ao integrar transações reais (ecoturismo, voluntariado) com inclusão social (regularização, comunidades tradicionais). 

- **[Transforma Brasil](transformabrasil.com.br)**

É uma Plataforma social digital para voluntariado comunitário de forma gratuita e acessível, com um funil de candidatos e escalabilidade. A Transforma Brasil é modelo excelente para gestão de voluntariado e o IBRADA-NET importará muitos conceitos daqui (funil de seleção, notificações, perfis), mas expandirá para ecoturismo com beneficiários diretos e parcerias. 


## 2.6 Viabilidade da Proposta

A avaliação de viabilidade do projeto IBRADA-NET demonstra que a proposta é exequível dentro dos limites acadêmicos da disciplina, sustentada pelos seguintes pilares:

- **Equipe:** O projeto conta com uma equipe de sete integrantes com papéis bem definidos, abrangendo gerência de projeto, análise de requisitos, desenvolvimento e garantia de qualidade (QA). Essa distribuição permite a paralelização de tarefas e um controle eficiente de qualidade em cada ciclo.
- **Prazo e Metodologia:** O desenvolvimento ocorrerá durante o período do semestre acadêmico, estruturado em sete ciclos de trabalho até o início de dezembro. A adoção da metodologia híbrida com o processo RAD (Rapid Application Development) viabiliza o cumprimento desse prazo, pois prioriza iterações rápidas, foco na interface do usuário e validações constantes por meio de protótipos em vez de documentações exaustivas.
- **Acesso ao Cliente:** A equipe possui contato direto, contínuo e interno com a instituição, contando inclusive com um membro do grupo atuando na função de representante/proxy dos stakeholders no dia a dia. Isso viabiliza validações quinzenais de requisitos por meio de protótipos de baixa/média fidelidade e permite o feedback rápido exigido pelo processo RAD.
- **Conhecimento Técnico Disponível:** O stack tecnológico selecionado é altamente compatível com o domínio técnico já existente na equipe. A familiaridade prévia com o desenvolvimento web focado em interfaces responsivas e criação de serviços modulares com essas ferramentas reduz drasticamente a curva de aprendizado, permitindo que o tempo do semestre seja investido diretamente na implementação das funcionalidades.
- **Possibilidade de Entrega do MVP:** A construção de um MVP (Produto Mínimo Viável) funcional é viável no contexto da disciplina. A delimitação do escopo e a priorização de requisitos proporcionadas pela matriz de priorização (Valor de Negócio vs. Esforço Técnico) e pela técnica MoSCoW, guiará as entregas incrementais planejadas no cronograma.



## 2.7 Benefícios Esperados

- Para o **cliente**: centralizar a comunicação e organizar as informações dispersas, unificando as funcionalidades para operar como um portal institucional engajador. Isso permitirá aumentar a eficiência na divulgação, e impulsionar a venda de pacotes de ecoturismo, além de alavancar a captação de recursos financeiros, atrair novos patrocinadores e articular melhor o recrutamento de voluntários, garantindo a sustentabilidade da organização. 
- Para os **usuários**: proporcionar uma experiência do usuário (UX) mais intuitiva, com informações centralizadas e acessíveis para os múltiplos perfis de acesso. Os turistas terão um processo de compra de ecoturismo claro e direto. Voluntários e patrocinadores encontrarão com facilidade as informações sobre oportunidades de ajuda e engajamento. Já as comunidades tradicionais e agricultores familiares terão acesso menos burocrático e mais claro aos serviços de inclusão socioprodutiva.
