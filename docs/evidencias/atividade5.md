# Atividade para 08/10

## 1. Tipos de declaração 

No projeto IBRADA-NET, a equipe utiliza atualmente uma combinação de quatro tipos de declaração de requisitos.

### 1.1 Narrativas descritivas

As narrativas descritivas utilizam linguagem natural livre para contextualizar problemas, necessidades e experiências dos stakeholders.

No IBRADA-NET, elas aparecem principalmente na apresentação:

- do contexto institucional do IBRADA;
- do cenário atual;
- do problema de comunicação e dispersão de informações;
- dos stakeholders e públicos atendidos;
- das consequências enfrentadas pela instituição;
- da solução proposta.

Por exemplo, a descrição da dificuldade do IBRADA em centralizar informações, atrair voluntários e converter interessados em clientes é uma narrativa descritiva. Sua função é permitir que integrantes da equipe e stakeholders compreendam o contexto antes do detalhamento dos requisitos.

### 1.2 Declarações estruturadas

Segundo o livro, declarações estruturadas utilizam linguagem controlada e formato padronizado, buscando reduzir ambiguidades e permitir que diferentes pessoas interpretem o requisito de maneira consistente.

No projeto, essa família aparece nas listas de:

- requisitos funcionais;
- requisitos não funcionais;
- regras de negócio.

A principal técnica utilizada é a **lista de requisitos**, apresentada no livro como uma modalidade de declaração estruturada. Os requisitos possuem identificador, nome e uma descrição direta.

Os nomes dos RFs seguem predominantemente a construção **“verbo no infinitivo + objeto”**, como:

- Cadastrar projetos;
- Editar experiências de ecoturismo;
- Visualizar candidatos;
- Preencher solicitação de parceria.

As descrições também seguem estruturas recorrentes, como:

> Permitir que o gestor...

> O sistema deve...

> A plataforma deve...

Nos RNFs, as declarações são complementadas por critérios mensuráveis, como tempo de resposta, quantidade de usuários simultâneos, taxa de erro e percentual de disponibilidade.

### 1.3 Declarações orientadas a valor e experiência

As declarações orientadas a valor e experiência enfatizam o propósito da funcionalidade, quem se beneficia e qual resultado é esperado, em vez de se concentrar apenas no comportamento técnico.

No projeto, essa família aparece principalmente:

- nos objetivos específicos do produto;
- nos valores de negócio;
- nos benefícios esperados;
- nas contribuições das características de produto;
- nas justificativas utilizadas durante a priorização.

Por exemplo, a característica **“Gestão do Ciclo de Voluntariado”** não é apresentada somente como um conjunto de funcionalidades. Ela é associada ao valor de ampliar a captação de voluntários, reduzir o esforço manual de seleção e melhorar a alocação de pessoas aos projetos.

### 1.4 Catálogos e artefatos técnicos

Os catálogos e artefatos técnicos consolidam requisitos em estruturas organizadas, rastreáveis e atualizáveis. Segundo o livro, esses artefatos podem conter identificador, origem, tipo, prioridade, dependências, critérios de aceitação e situação de verificação.

No IBRADA-NET, são utilizados os seguintes catálogos e artefatos:

- catálogo de requisitos funcionais;
- catálogo de requisitos não funcionais;
- catálogo de regras de negócio;
- matriz de rastreabilidade;
- matriz de priorização;
- tabelas de valor de negócio e esforço técnico.

As tabelas não constituem uma família diferente de declaração. Elas são o formato utilizado para organizar tanto as declarações estruturadas quanto os catálogos técnicos.

A matriz de rastreabilidade, por exemplo, conecta:

**Objetivos específicos => Características de produto => Valores de negócio => RFs, RNs e RNFs**

Isso permite verificar a origem e a contribuição de cada requisito para os objetivos do produto.



## 2. Níveis de Abstração dos Requisitos

Os requisitos podem ser classificados em três níveis de abstração:

- **Negócio:** O Porquê. Problemas, metas estratégicas e restrições externas.
- **Usuário:** O Quê. Necessidades, expectativas e serviços esperados na interação.
- **Produto:** O Como. Comportamentos detalhados, dados e restrições operacionais verificáveis.

### 2.1 Requisitos Funcionais

| ID | Nome | Descrição | Nível de Abstração |
| --- | --- | --- | --- |
| RF01 | Cadastrar projetos | Permitir que os gestores do IBRADA possam cadastrar projetos de regularização fundiária e ambiental de propriedades rurais, inclusão sócio-produtiva e assistência técnica e extensão de áreas rurais em um dashboard. | Usuário |
| RF02 | Editar projetos | Permitir que os gestores possam editar informações sobre os projetos do dashboard. | Usuário |
| RF03 | Remover projetos | Permitir que os gestores possam remover os projetos do dashboard. | Usuário |
| RF04 | Exibir dashboard de impacto | Permitir que visitantes visualizem, em um painel de acesso público, os indicadores de impacto dos projetos. | Usuário |
| RF05 | Apresentar formulário de triagem | Permitir que o visitante (possível turista, apoiador ou usuário buscando regulamentação ambiental) preencha um formulário de triagem guiado com campos simplificados para identificar o tipo de solicitação e seu perfil, armazenando os dados no sistema e o encaminhando corretamente. | Usuário |
| RF06 | Visualizar catálogo de ecoturismo | Permitir aos usuários visualizar o catálogo de experiências de ecoturismo, incluindo descrições, datas, disponibilidade de vagas e valores. | Usuário |
| RF07 | Detalhar experiências | Permitir que o usuário visualize informações completas de uma experiência de ecoturismo selecionada e com possibilidade de compartilhamento de seu conteúdo. | Usuário |
| RF08 | Cadastrar clientes | Permitir que os visitantes interessados em reservas se cadastrem em novas contas como clientes. | Usuário |
| RF09 | Editar perfil de clientes | Permitir que clientes possam editar seus dados pessoais registrados em suas próprias contas. | Usuário |
| RF10 | Realizar login de cliente | Permitir que clientes cadastrados acessem o sistema mediante validação de credenciais. | Usuário |
| RF11 | Encerrar sessão de cliente | Permitir que clientes encerrem sua sessão ativa no sistema. | Usuário |
| RF12 | Selecionar pacote de ecoturismo | Permitir que o cliente realize a reserva dos pacotes de ecoturismo selecionados. | Usuário |
| RF13 | Confirmar reserva | Permitir que o cliente confirme a reserva antes do checkout. | Usuário |
| RF14 | Pagar reserva | Permitir que o cliente realize pagamento de suas reservas de pacotes de ecoturismo. | Usuário |
| RF15 | Cadastrar experiências de ecoturismo | Permitir a equipe do IBRADA cadastrar experiências de ecoturismo no sistema. | Usuário |
| RF16 | Editar experiências de ecoturismo | Permitir a equipe do IBRADA editar experiências de ecoturismo no sistema. | Usuário |
| RF17 | Alterar disponibilidade de experiência de ecoturismo | Permitir que o gestor marque uma experiência de ecoturismo como disponível ou indisponível para novas reservas. | Usuário |
| RF18 | Cadastrar oportunidades de voluntariado | Permitir ao gestor cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado. | Usuário |
| RF19 | Editar oportunidades de voluntariado | Permitir ao gestor editar as informações das oportunidades de voluntariado registradas no sistema. | Usuário |
| RF20 | Gerenciar papel de gestor | Permitir que um gestor cadastre outros membros da equipe do IBRADA como gestores, concedendo a eles acesso aos painéis do sistema. | Usuário |
| RF21 | Listar oportunidades de voluntariado | Permitir que o voluntário consulte a lista de oportunidades de voluntariado abertas. | Usuário |
| RF22 | Visualizar detalhes de oportunidade de voluntariado | Permitir que o voluntário visualize as informações detalhadas de uma oportunidade selecionada, incluindo habilidades requeridas, duração, disponibilidade e projeto associado. | Usuário |
| RF23 | Cadastrar perfil do voluntário | Permitir que usuários se cadastrem como voluntários, informando suas habilidades, experiências, áreas de interesse e disponibilidade. | Usuário |
| RF24 | Editar perfil do voluntário | Permitir que usuários cadastrados como voluntários possam editar suas informações do perfil. | Usuário |
| RF25 | Candidatar-se a oportunidade | Permitir que o voluntário autenticado se candidate a uma oportunidade de voluntariado aberta. | Usuário |
| RF26 | Realizar login de voluntário | Permitir que voluntários cadastrados acessem o sistema mediante validação de credenciais. | Usuário |
| RF27 | Encerrar sessão de voluntários | Permitir que voluntários encerrem sua sessão ativa no sistema. | Usuário |
| RF28 | Visualizar candidatos | Permitir que gestores visualizem todos os candidatos a uma oportunidade em funil. | Usuário |
| RF29 | Registrar consentimento de uso de dados | Permitir que o usuário visualize o termo de consentimento (LGPD) no momento do cadastro e o aceite explicitamente, registrando data, hora e versão do termo aceito. | Produto |
| RF30 | Configurar preferências de notificação | Permitir que o usuário selecione, edite ou desative os alertas de projetos de seu interesse. | Usuário |
| RF31 | Exibir estatísticas de alcance das notificações | Permitir que o gestor visualize estatísticas de alcance das notificações enviadas. | Usuário |
| RF32 | Gerenciar envio de notificações | Permitir que o gestor gerencie notificações enviadas. | Usuário |
| RF33 | Preencher solicitação de parceria | Permitir que um candidato a parceiro preencha um formulário simplificado para solicitação de parceria, coletando informações (data, tipo e área). | Usuário |
| RF34 | Visualizar propostas de parceria | Apresentar um painel centralizado para a equipe do IBRADA visualizar as solicitações de parceria recebidas. | Usuário |
| RF35 | Enviar resposta de solicitação | Permitir que o gestor escreva uma resposta à solicitação de parceria pelo sistema, que será enviada de forma automática por email para a empresa candidata. | Produto |

### 2.2 Requisitos Não Funcionais

| ID | Nome | Descrição | Nível de Abstração |
| --- | --- | --- | --- |
| RNF01 | Responsividade da interface | A interface do sistema deve se adaptar a smartphones (320px-480px), tablets (481px-1024px) e desktops (acima de 1024px), sem quebra de layout ou sobreposição nos três breakpoints definidos. | Produto |
| RNF02 | Integridade transacional | O sistema deve garantir a conformidade ACID nas transações de ecoturismo e impedir reservas concorrentes para a mesma vaga por meio de controle de concorrência (lock otimista/pessimista e constraints de unicidade/capacidade na tabela de reservas). Em caso de requisições simultâneas para a última vaga disponível, apenas a primeira transação confirmada deve ser efetivada, rejeitando as demais sem gerar overbooking. | Produto |
| RNF03 | Desempenho do catálogo | O tempo de carregamento das listagens de projetos e do catálogo de experiências de ecoturismo não deve ultrapassar 3 segundos em conexão de 15 Mbps. | Produto |
| RNF04 | Autenticação e autorização | O sistema deve negar acesso por padrão a usuários não autenticados ou sem papel de Gestor, e registrar tentativas de acesso não autorizadas às rotas de gerenciamento. | Produto |
| RNF05 | Integração Externa | A interface de integração externa via webhook deve processar notificações recebidas de forma assíncrona em até 3 segundos, realizando até 5 tentativas automáticas de reprocessamento em caso de falha na comunicação. | Produto |
| RNF06 | Escalabilidade sob demanda | O sistema deve suportar 200 usuários simultâneos ativos (navegando, reservando ou preenchendo formulários), com tempo de resposta ≤ 2s para 95% das requisições e taxa de erro ≤ 1% (respostas 5xx ou timeout), medidos em teste de carga de 10 minutos em ambiente de homologação. | Produto |
| RNF07 | Disponibilidade do sistema | A plataforma deve garantir disponibilidade mínima de 98% ao mês para acesso público (dashboard de projetos, catálogo de ecoturismo, formulários de triagem e parceria), com manutenções programadas com 2 dias de antecedência realizadas fora do horário de pico (entre as 02h00 e as 05h00 - BRT). | Produto |
| RNF08 | Proteção de dados pessoais (LGPD) | O sistema deve proteger os dados pessoais e sensíveis (como CPF e informações de contato) de voluntários e clientes utilizando criptografia padrão AES-256 para dados em repouso no banco de dados e protocolo TLS 1.2 ou superior (HTTPS) para dados em trânsito. | Negócio |
| RNF09 | Usabilidade do formulário de triagem | O formulário de triagem inicial deve ser simples o suficiente para ser concluído por usuários com baixa familiaridade digital, sem a necessidade de criação de conta, com taxa de conclusão ≥ 90%. | Produto |
| RNF10 | Compatibilidade entre navegadores | O sistema deve apresentar paridade funcional e visual, sem quebras de layout, nas duas últimas versões estáveis do Chrome, Firefox, Safari e Edge. | Produto |


## 3. Momentos do processo

No IBRADA-NET, as declarações não são produzidas integralmente apenas na concepção. Uma primeira versão é criada durante o Planejamento de Requisitos, mas elas são refinadas, utilizadas e validadas continuamente ao longo das iterações do RAD.

| **Momento do processo** | **O que acontece com as declarações** |
| --- | --- |
| **Planejamento de Requisitos** | As declarações são inicialmente criadas a partir das entrevistas, brainstormings e análise do negócio. |
| **Início de cada ciclo ou iteração** | Os requisitos priorizados para o incremento são refinados em histórias de usuário e critérios de aceitação. |
| **Design do Usuário** | As declarações são confrontadas com protótipos e atualizadas conforme o feedback dos stakeholders. |
| **Construção Rápida** | Histórias, critérios e RNFs orientam a implementação. O backlog, o catálogo e a rastreabilidade são mantidos atualizados. |
| **Verificação e validação de cada incremento** | Critérios de aceitação e RNFs são usados como referência para testes, revisões e validações com o cliente. |
| **Transição** | O conjunto consolidado de declarações é utilizado na homologação final e na aceitação do produto. |

### Planejamento de Requisitos

Durante a elicitação e a descoberta, as entrevistas e os brainstormings dão origem às **narrativas descritivas**, utilizadas para registrar o contexto do IBRADA, os problemas existentes e as necessidades dos stakeholders.

Durante a análise e o consenso, esse entendimento é complementado pelas **declarações orientadas a valor e experiência**, que relacionam as necessidades identificadas aos objetivos, benefícios esperados e características do produto.

Após o entendimento inicial, as necessidades são transformadas em **declarações estruturadas**, como as listas de RFs e RNFs. Essas declarações são então reunidas em **catálogos e artefatos técnicos**, como o catálogo de requisitos, o backlog, a matriz de priorização e a matriz de rastreabilidade.

Essa primeira versão não é definitiva e poderá ser refinada nas iterações seguintes.

### Início de cada ciclo

No início de cada iteração, a equipe consulta os **catálogos e artefatos técnicos** para selecionar os requisitos priorizados para o incremento.

Nesse refinamento, histórias podem ser criadas, divididas ou alteradas, enquanto os critérios de aceitação tornam o comportamento esperado mais preciso e verificável. As mudanças realizadas são registradas no backlog, no catálogo e na matriz de rastreabilidade.

### Design do Usuário

Durante o Design do Usuário, os requisitos estruturados são confrontados com wireframes, mockups e fluxos navegáveis. Os protótipos não constituem uma das quatro famílias de declaração utilizadas no exercício. Eles funcionam como representações visuais que ajudam os stakeholders a compreender e avaliar o que foi declarado.

Assim, o Design do Usuário permite verificar se as declarações textuais representam corretamente a experiência e as necessidades dos stakeholders.

### Construção Rápida

Durante a Construção Rápida, as **declarações orientadas a valor e experiência** mantêm visível o propósito de cada funcionalidade, enquanto as **declarações estruturadas** orientam o comportamento que deve ser implementado.

Os **catálogos e artefatos técnicos** são usados para controlar:

- requisitos incluídos no incremento;
- histórias relacionadas;
- critérios de aceitação;
- dependências;
- prioridades;
- rastreabilidade.

Quando a implementação ou a avaliação do incremento produz um novo entendimento, as declarações são revisadas e o catálogo é atualizado.

### Verificação e Validação

Durante a verificação, as **declarações estruturadas**, especialmente os critérios de aceitação e RNFs mensuráveis, são utilizadas como referência para conferir se o incremento foi construído corretamente.

As **declarações orientadas a valor e experiência** são utilizadas na validação com os stakeholders para avaliar se o incremento atende à necessidade e ao benefício que motivaram sua criação.

Os resultados das verificações e validações são registrados nos **catálogos e artefatos técnicos**, mantendo a relação entre requisito, implementação e evidência de atendimento.

Caso a solução esteja tecnicamente correta, mas não atenda à necessidade do stakeholder, as declarações devem ser refinadas para representar o novo entendimento.

### Transição

Na Transição, os **catálogos e artefatos técnicos** são consolidados para representar o estado final dos requisitos entregues.

As **declarações estruturadas** são utilizadas como base para a homologação e os testes finais de aceitação.

Já as **declarações orientadas a valor e experiência** permitem verificar se o produto entregue contribui para os objetivos e benefícios esperados pelo IBRADA.
