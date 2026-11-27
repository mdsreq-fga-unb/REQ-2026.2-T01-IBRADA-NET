
# 2. SOLUÇÃO PROPOSTA

## 2.1 Objetivo Geral do Produto

Aprimorar a comunicação e o relacionamento do IBRADA com seus diferentes públicos por meio do desenvolvimento de uma plataforma digital centralizada, que organize e disponibilize suas informações, facilite a divulgação e a contratação de serviços e amplie a participação de clientes, voluntários, apoiadores e parceiros em suas iniciativas sociais e ambientais.

## 2.2 Objetivos Específicos (OE) do Produto

* <span id="oe1"></span>**OE1:** Otimizar e centralizar o fluxo de comunicação, atendimento e relacionamento com os diferentes públicos.
* <span id="oe2"></span>**OE2:** Estruturar processos de captação e conversão de interessados em clientes, apoiadores e parceiros.
* <span id="oe3"></span>**OE3:** Estruturar o processo de recrutamento, seleção e engajamento de voluntários. 

## 2.3 Características de Produto (mapeadas com os Objetivos Específicos do Produto)

|ID|Característica|Descrição Resumida|ID|Valor de negócio principal|Contribuição Principal| Contribuição Secundária|
|-|-|-|-|-|-|-|
|<span id="cp1"></span>CP1|Gestão e Transparência de Projetos|A solução deverá permitir ao IBRADA cadastrar, organizar e disponibilizar informações sobre seus projetos nas suas frentes principais, incluindo iniciativas realizadas, em andamento ou propostas não executadas. O cadastro e a edição deverão considerar o controle de visibilidade necessário à discussão interna antes da divulgação pública. O dashboard deverá distinguir os impactos alcançados dos pretendidos e permitir filtragem por área de atuação, status e período, de modo a demonstrar capacidade de execução e oferecer transparência aos apoiadores e patrocinadores. |VN01|Aumento da visibilidade institucional dos projetos, demonstração de impacto real e fortalecimento da credibilidade junto a apoiadores e patrocinadores. |[OE1](#22-objetivos-especificos-oe-do-produto)|[OE2](#22-objetivos-especificos-oe-do-produto)|
|<span id="cp2"></span>CP2|Canal Unificado de Atendimento e Triagem|A solução deverá centralizar o recebimento de dúvidas sobre projetos, solicitações de serviços, interesse em voluntariado e manifestações de apoiadores. A plataforma deverá identificar o tipo de solicitação e o perfil do usuário mediante formulário guiado. A triagem levará o usuário à ferramenta Whatsapp com orientações específicas de acordo com a triagem. |VN02|Melhoria da organização do atendimento, redução de perda de contatos e resposta mais ágil às solicitações dos públicos. |[OE1](#22-objetivos-especificos-oe-do-produto)|[OE2](#22-objetivos-especificos-oe-do-produto)|
|<span id="cp3"></span>CP3|Módulo Transacional de Ecoturismo |A solução deverá permitir aos usuários consultar o catálogo de pacotes de ecoturismo, visualizar descrições, datas, disponibilidade de vagas, valores e condições de participação, selecionar um pacote, realizar e confirmar a reserva e efetuar seu pagamento por integração com gateway externo.|VN03|Facilitação da contratação de pacotes de ecoturismo, redução de fricção na jornada do cliente e ampliação das oportunidades de receita.|[OE2](#22-objetivos-especificos-oe-do-produto)|[OE1](#22-objetivos-especificos-oe-do-produto)|
|<span id="cp4"></span>CP4|Gestão do Ciclo de Voluntariado |A solução deverá permitir ao IBRADA cadastrar oportunidades e demandas de voluntariado, especificando habilidades requeridas, disponibilidade, duração e projeto associado.  A plataforma oferecerá um funil visual onde a equipe poderá: visualizar candidaturas, filtrar e comparar candidatos por habilidades/perfil.|VN04|Ampliação da capacidade de captar e articular voluntários, redução do esforço manual de seleção e melhoria na alocação de talentos aos projetos. |[OE3](#22-objetivos-especificos-oe-do-produto)|[OE2](#22-objetivos-especificos-oe-do-produto)|
|<span id="cp5"></span>CP5|Sistema de Notificações e Engajamento |A solução deverá permitir envio de notificações direcionadas aos diferentes públicos do IBRADA com base em seus perfis e interesses declarados. O sistema deverá notificar sobre: novas oportunidades de voluntariado alinhadas ao perfil, novos projetos lançados na área de interesse, chamados para financiamento de iniciativas específicas, atividades de ecoturismo próximas ao período de interesse.|VN05|Ampliação da captação de clientes, voluntários e apoiadores, melhoria da retenção e personalização da experiência de cada público.|[OE2](#22-objetivos-especificos-oe-do-produto)|[OE3](#22-objetivos-especificos-oe-do-produto)|
|<span id="cp6"></span>CP6|Gestão de Solicitações de Parcerias |A solução deverá permitir que empresas e organizações externas façam solicitações de parcerias com o IBRADA através de um formulário simplificado. Para a equipe do IBRADA, a plataforma deverá oferecer um painel centralizado visualizando todas as solicitações de parceria recebidas, com as informações coletadas. A equipe poderá adicionar notas internas e enviar resposta para a empresa solicitante via email. |VN6|Centralização e organização das solicitações de parceria, redução de perda de contatos de parceiros em potencial, melhoria da transparência no processo de análise e facilitação da gestão interna dessas demandas. |[OE1](#22-objetivos-especificos-oe-do-produto)|[OE2](#22-objetivos-especificos-oe-do-produto)|

*Tabela 3: Tabela com características de produto*

O controle de visibilidade da CP1 decorre da [ata de 28/09/2026](../atas-reuniao/unidade-2/28-09.md). O estado de rascunho é uma proposta de implementação ainda pendente de avaliação e validação; seus detalhes não estão definidos. Conforme a [ata de 11/10/2026](../atas-reuniao/unidade-2/11-10.md), RF01–RF04 permanecem fora do MVP, que apresentará projetos de forma estática, com resumo e link para o PDF. O módulo de notificações (CP5) também permanece fora do MVP. Essas delimitações não retiram as características do escopo geral do produto.

### 2.3.1 Procedimentos provisórios do MVP

Algumas capacidades retiradas do MVP são substituídas por procedimentos manuais acordados com o cliente. A tabela abaixo registra como cada procedimento será executado, por quem e com quais limitações, para que a primeira entrega possa ser utilizada pelo IBRADA sem comprometer informações já produzidas. Itens marcados como *pendente de validação* ainda precisam ser confirmados com o cliente e registrados em ata.

|Limitação no MVP|Procedimento provisório|Quem executa|Condições e limitações|Origem|
|-|-|-|-|-|
|Edição de pacotes pela interface ([RF16](8_requisitos.md#rf16) / US30)|Guilherme, representante do IBRADA, solicita a alteração à equipe técnica via WhatsApp, e a equipe a realiza diretamente no banco de dados. A exclusão e a recriação do pacote só se aplicam a pacotes **sem reservas associadas**.|Equipe técnica, a pedido do gestor do IBRADA|Pacotes **com reservas** não são excluídos, pois as reservas e os pagamentos dependem deles. Nesses casos, apenas campos descritivos (descrição, roteiro, mídias) podem ser alterados; mudanças de preço, datas ou vagas exigem desativar o pacote (indisponível) e cadastrar um novo, preservando as reservas existentes. *Regra pendente de validação com o cliente.*|[Ata de 11/10](../atas-reuniao/unidade-2/11-10.md), [ata de 08/11](../atas-reuniao/unidade-3/08-11.md)|
|Gestão dinâmica de projetos (RF01–RF04)|A página de projetos é estática, com resumo e link para o PDF. Pedidos de correção ou de nova publicação são enviados por Guilherme, representante do IBRADA, à equipe técnica via WhatsApp; a equipe atualiza o conteúdo.|Equipe técnica durante a disciplina|O prazo de atendimento das solicitações ainda não foi definido.|[Ata de 11/10](../atas-reuniao/unidade-2/11-10.md)|
|Cadastro de contas de gestor pela interface|As contas de gestor são criadas diretamente no banco de dados pela equipe técnica.|Equipe técnica|Toda nova conta depende de solicitação do IBRADA à equipe técnica.|[Ata de 08/11](../atas-reuniao/unidade-3/08-11.md)|

*Tabela 4: Procedimentos provisórios do MVP*

Após o encerramento da disciplina, a execução desses procedimentos depende da definição do responsável pela manutenção, registrada como decisão pendente na [seção 2.6](#26-viabilidade-da-proposta).

## 2.4 Tecnologias a Serem Utilizadas

Para a construção da solução proposta para o IBRADA-NET, serão utilizadas tecnologias adequadas ao desenvolvimento de uma plataforma digital com forte presença de elementos visuais, gerenciamento seguro de perfis e evolução iterativa. A base do projeto será desenvolvida em TypeScript. No frontend, será utilizado o framework Next.js, que possibilita a criação de interfaces responsivas, otimizadas e acessíveis aos diferentes públicos da plataforma, como turistas, agricultores, voluntários e parceiros. No backend, será utilizado o NestJS, que favorece a implementação de serviços web estruturados e modulares, bem como a realização de integrações seguras.

Para a persistência dos dados, será utilizado o MySQL Community Edition, sistema gerenciador de banco de dados relacional gratuito e de código aberto, disponibilizado sob a licença GPL. Sua adoção é adequada ao projeto porque os dados de usuários, experiências, reservas, pagamentos, projetos e candidaturas possuem relações entre si, e determinadas operações precisam preservar a integridade e a consistência das informações. A escolha também considera sua ampla documentação, o suporte de uma comunidade ativa e a disponibilidade de ferramentas que facilitam sua administração. A IBRADA já mantém um site hospedado e, portanto, já possui despesas relacionadas à hospedagem. O aproveitamento dessa infraestrutura depende de verificar o suporte à execução do backend NestJS, ao modo de implantação adotado para o Next.js, ao MySQL e às conexões e recursos necessários à aplicação. O uso do MySQL Community Edition não implicará custos de licenciamento; entretanto, poderão surgir despesas adicionais caso seja necessário ampliar o plano atual, contratar um serviço específico de banco de dados ou aumentar a capacidade de armazenamento, processamento, segurança e realização de backups. Essa necessidade será avaliada conforme os requisitos técnicos e o volume de utilização da plataforma. A administração do banco seguirá práticas de segurança, controle de acesso, monitoramento e manutenção de cópias de segurança.    

Para apoiar a concepção das interfaces, será utilizado o Figma na elaboração de protótipos, na definição dos fluxos de navegação e na validação visual antes da implementação. Nos testes automatizados, será empregado o Jest, ferramenta do ecossistema TypeScript com função de realizar testes consistentes. No frontend, o Jest será utilizado com a React Testing Library para verificar componentes e interações; no backend, será associado ao Supertest para testar os serviços e endpoints das APIs. Esses testes poderão ser integrados ao processo de integração contínua por meio do GitHub Actions.

## 2.5 Pesquisa de Mercado e Análise Competitiva

O IBRADA-NET se insere em um mercado em crescimento de soluções digitais para ONGs ambientais e institutos de desenvolvimento socioeconômico sustentável. A pesquisa abaixo analisa plataformas e institutos que oferecem funcionalidades similares, identificando diferencias, lacunas e oportunidades. 

- **[Instituto Semeia](https://semeia.org.br)**

O instituto Semeia é um portal institucional com biblioteca de conhecimento (publicações, podcasts, artigos), divulgação de iniciativas e projetos relacionados a parques com uma agenda de eventos (seminários, lives, conferências). Semeia é um modelo de como divulgar iniciativas ambientais com qualidade e construir reputação. O IBRADA-NET propõe integrar transações de ecoturismo e processos de voluntariado com inclusão social (regularização, comunidades tradicionais).

- **[Transforma Brasil](https://transformabrasil.com.br)**

É uma Plataforma social digital para voluntariado comunitário de forma gratuita e acessível, com um funil de candidatos e escalabilidade. A Transforma Brasil é modelo excelente para gestão de voluntariado e o IBRADA-NET importará muitos conceitos daqui (funil de seleção, notificações, perfis), mas expandirá para ecoturismo com beneficiários diretos e parcerias. 


## 2.6 Viabilidade da Proposta

A proposta apresenta condições favoráveis ao desenvolvimento acadêmico, mas sua viabilidade operacional depende de verificações técnicas e acordos institucionais ainda pendentes. A definição da stack e a validação do fluxo de reserva e pagamento não comprovam que a infraestrutura e as integrações estejam prontas para uso real.

|Decisão|Situação|Responsável|Impacto no MVP|
|-|-|-|-|
|Gateway de pagamento|**Definido:** PagSeguro, comunicado ao professor. A integração ainda está em andamento.|Equipe de desenvolvimento|Sem a integração concluída, a reserva pode ser registrada, mas o pagamento on-line ([RN03](8_requisitos.md#rn03)) não fica disponível.|
|Conta do IBRADA no gateway|**Pendente:** abertura e titularidade da conta do instituto no PagSeguro.|IBRADA|Necessária para receber pagamentos reais fora do ambiente de testes.|
|Hospedagem|**Pendente:** o site antigo do IBRADA continua publicado e a migração para o novo site ainda não ocorreu. Falta verificar se o plano de hospedagem atual suporta NestJS, Next.js e MySQL; caso contrário, avaliar a contratação de outro serviço e seu custo.|Equipe técnica e IBRADA|Até a migração, o MVP permanece em ambiente de homologação e o site antigo segue como canal público.|
|Manutenção após a disciplina|**Pendente de formalização:** um integrante da equipe, com vínculo familiar com o cliente, se dispôs a realizar a manutenção, mas o compromisso ainda não foi formalizado.|IBRADA e integrante indicado|Define quem executará os procedimentos provisórios (seção 2.3.1) e as correções após dezembro.|
|Responsabilidades institucionais|**Definido:** Guilherme é o representante do IBRADA que solicita alterações e aprova publicações, com comunicação via WhatsApp.|IBRADA|Os procedimentos manuais da seção 2.3.1 têm um solicitante identificado.|

*Tabela 5: Decisões pendentes que afetam a viabilidade operacional*

- **Equipe:** O projeto conta com uma equipe de sete integrantes com papéis bem definidos, abrangendo gerência de projeto, análise de requisitos, desenvolvimento e garantia de qualidade (QA). Essa distribuição permite a paralelização de tarefas e um controle eficiente de qualidade em cada ciclo.
- **Prazo e Metodologia:** O desenvolvimento ocorrerá durante o período do semestre acadêmico, estruturado em oito ciclos de trabalho até o início de dezembro. A adoção da metodologia híbrida com o processo RAD (Rapid Application Development) viabiliza o cumprimento desse prazo, pois prioriza iterações rápidas, foco na interface do usuário e validações constantes por meio de protótipos em vez de documentações exaustivas.
- **Acesso ao Cliente:** A equipe possui contato direto, contínuo e interno com a instituição, contando inclusive com um membro do grupo atuando na função de representante/proxy dos stakeholders no dia a dia. Isso viabiliza validações quinzenais de requisitos por meio de protótipos de baixa/média fidelidade e permite o feedback rápido exigido pelo processo RAD.
- **Conhecimento Técnico Disponível:** O stack tecnológico selecionado é compatível com o domínio técnico já existente na equipe. A familiaridade prévia com o desenvolvimento web focado em interfaces responsivas e criação de serviços modulares com essas ferramentas reduz a curva de aprendizado, permitindo que o tempo do semestre seja investido diretamente na implementação das funcionalidades.
- **Possibilidade de Entrega do MVP:** A construção de um MVP (Produto Mínimo Viável) funcional é viável no contexto da disciplina, em ambiente de homologação. O uso real pelo IBRADA depende das decisões pendentes listadas na Tabela 5. A delimitação do escopo e a priorização de requisitos proporcionadas pela matriz de priorização (Valor de Negócio vs. Esforço Técnico) e pela técnica MoSCoW, guiará as entregas incrementais planejadas no cronograma.


## 2.7 Benefícios Esperados

- Para o **cliente**: centralizar a comunicação e organizar as informações dispersas, unificando as funcionalidades para operar como um portal institucional engajador. Espera-se melhorar a divulgação, apoiar a estruturação da comercialização de pacotes e do recrutamento de voluntários e favorecer a captação de recursos e patrocinadores. A contribuição para a sustentabilidade dependerá da capacidade institucional e deverá ser avaliada após a implementação.
- Para os **usuários**: proporcionar uma experiência do usuário (UX) mais intuitiva, com informações centralizadas e acessíveis para os múltiplos perfis de acesso. Os turistas terão um processo de compra de ecoturismo claro e direto, que depende da conclusão da integração com o PagSeguro. Voluntários e patrocinadores encontrarão com facilidade as informações sobre oportunidades de ajuda e engajamento. Já as comunidades tradicionais e agricultores familiares terão acesso menos burocrático e mais claro aos serviços de inclusão socioprodutiva.

A tabela abaixo distingue os benefícios entregues pelo MVP daqueles que dependem de serviços externos, de operação manual ou do produto completo.

|Benefício|Situação no MVP|Dependência|
|-|-|-|
|Divulgação dos projetos do IBRADA|Parcial: página estática com resumo e PDF|Atualização manual pela equipe técnica (seção 2.3.1)|
|Atendimento organizado por triagem|Entregue: formulário guiado com encaminhamento ao WhatsApp|Atendimento humano do IBRADA no WhatsApp|
|Contratação de pacotes de ecoturismo|Parcial: catálogo e reserva|Integração com o PagSeguro e conta do IBRADA no gateway|
|Recrutamento de voluntários|Entregue: oportunidades, candidaturas e funil|—|
|Centralização das solicitações de parceria|Entregue: formulário e painel|—|
|Notificações, dashboard de impacto e edição de pacotes e projetos|Fora do MVP|Produto completo|

*Tabela 6: Benefícios do MVP e suas dependências*
