# Atividade 3 - Ajuste e validação

Aqui é como ficou a lista finalizada após os apontamentos do grupo **Cascata ágil**. O documento com as críticas enviada pelo grupo também foi em PDF, o documento pode ser visualizado [aqui](https://drive.google.com/file/d/1vvE9TA4tvYRuvLK9ac-VAhXjeb-X0otm/view?usp=drive_link).

## Requisitos Funcionais

| ID | Nome | Descrição | Relação | Decisão + justificativa |
| -- | ---- | --------- | ------- | ----------------------- |
| RF01 | Cadastrar projetos | Permitir que os gestores do IBRADA possam cadastrar projetos de regularização fundiária e ambiental de propriedades rurais, inclusão sócio-produtiva e assistência técnica e extensão de áreas rurais em um dashboard. | CP1 | Nada consta |
| RF02 | Editar projetos | Permitir que os gestores possam editar informações sobre os projetos do dashboard. | CP1 | Nada consta |
| RF03 | Remover projetos | Permitir que os gestores possam remover os projetos do dashboard. | CP1 | Nada consta |
| RF04 | Exibir dashboard de impacto | Permitir que visitantes visualizem, em um painel de acesso público, os indicadores de impacto dos projetos. | CP1 | Aceito |
| RF05 | Apresentar formulário de triagem | Permitir que o visitante (possível turista, apoiador ou usuário buscando regulamentação ambiental) preencha um formulário de triagem guiado com campos simplificados para identificar o tipo de solicitação e seu perfil, armazenando os dados no sistema e o encaminhando corretamente. | CP2 | Aceito |
| RF06 | Visualizar catálogo de ecoturismo | Permitir aos usuários visualizar o catálogo de experiências de ecoturismo, incluindo descrições, datas, disponibilidade de vagas e valores. | CP3 | Nada consta |
| RF07 | Detalhar experiências | Permitir que o usuário visualize informações completas de uma experiência de ecoturismo selecionada e com possibilidade de compartilhamento de seu conteúdo. | CP3 | Aceito |
| RF08 | Cadastrar clientes | Permitir que os visitantes interessados em reservas se cadastrem em novas contas como clientes. | CP3 | Aceito |
| RF09 | Editar perfil de clientes | Permitir que clientes possam editar seus dados pessoais registrados em suas próprias contas. | CP3 | Nada consta |
| RF10 | Realizar login de cliente | Permitir que clientes cadastrados acessem o sistema mediante validação de credenciais. | CP3 | Aceito |
| RF11 | Encerrar sessão de cliente | Permitir que clientes encerrem sua sessão ativa no sistema. | CP3 | Aceito |
| RF12 | Selecionar pacote de ecoturismo | Permitir que o cliente realize a reserva dos pacotes de ecoturismo selecionados. | CP3 | Adicionado posteriormente |
| RF13 | Confirmar reserva | Permitir que o cliente confirme a reserva antes do checkout. | CP3 | Adicionado posteriormente |
| RF14 | Pagar reserva | Permitir que o cliente realize pagamento de suas reservas de pacotes de ecoturismo. | CP3 | Aceito |
| RF15 | Cadastrar experiências de ecoturismo | Permitir a equipe do IBRADA cadastrar experiências de ecoturismo no sistema. | CP3 | Parcialmente aceito, mencionar um “painel administrativo” não torna o requisito automaticamente errado, trocamos algumas palavras para cadastro para melhor compreendimento. |
| RF16 | Editar experiências de ecoturismo | Permitir a equipe do IBRADA editar experiências de ecoturismo no sistema. | CP3 | Não aceito, o RF14 é um requisito de cadastro, ou seja, essa sugestão não é válida. |
| RF17 | Alterar disponibilidade de experiência de ecoturismo | Permitir que o gestor marque uma experiência de ecoturismo como disponível ou indisponível para novas reservas. | CP3 | Aceito |
| RF18 | Cadastrar oportunidades de voluntariado | Permitir ao gestor cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado. | CP4 | Não aplicável, não existe obrigação de todo domínio possuir CRUD completo, a experiência continuará visível, só não aplicável após o período estabelecido. |
| RF19 | Editar oportunidades de voluntariado | Permitir ao gestor editar as informações das oportunidades de voluntariado registradas no sistema. | CP4 | Não aplicável, não existe obrigação de todo domínio possuir CRUD completo, a experiência continuará visível, só não aplicável após o período estabelecido. |
| RF20 | Gerenciar papel de gestor | Permitir que um gestor cadastre outros membros da equipe do IBRADA como gestores, concedendo a eles acesso aos painéis do sistema. | CP4 | Aceito |
| RF21 | Listar oportunidades de voluntariado | Permitir que o voluntário consulte a lista de oportunidades de voluntariado abertas. | CP4 | Aceito |
| RF22 | Visualizar detalhes de oportunidade de voluntariado | Permitir que o voluntário visualize as informações detalhadas de uma oportunidade selecionada, incluindo habilidades requeridas, duração, disponibilidade e projeto associado. | CP4 | Não é uma sugestão mas o que era RN07 na verdade é um requisito. |
| RF23 | Cadastrar perfil do voluntário | Permitir que usuários se cadastrem como voluntários, informando suas habilidades, experiências, áreas de interesse e disponibilidade. | CP4 | Nada consta |
| RF24 | Editar perfil do voluntário | Permitir que usuários cadastrados como voluntários possam editar suas informações do perfil. | CP4 | Nada consta |
| RF25 | Candidatar-se a oportunidade | Permitir que o voluntário autenticado se candidate a uma oportunidade de voluntariado aberta. | CP4 | Parcialmente aceito, existem erros na solução proposta, porém a identificação do problema foi aceita. |
| RF26 | Realizar login de voluntário | Permitir que voluntários cadastrados acessem o sistema mediante validação de credenciais. | CP4 | Aceito |
| RF27 | Encerrar sessão de voluntários | Permitir que voluntários encerrem sua sessão ativa no sistema. | CP4 | Nada consta |
| RF28 | Visualizar candidatos | Permitir que gestores visualizem todos os candidatos a uma oportunidade em funil. | CP4 | Nada consta |
| RF29 | Registrar consentimento de uso de dados | Permitir que o usuário visualize o termo de consentimento (LGPD) no momento do cadastro e o aceite explicitamente, registrando data, hora e versão do termo aceito. | CP4 | Aceito |
| RF30 | Configurar preferências de notificação | Permitir que o usuário selecione, edite ou desative os alertas de projetos de seu interesse. | CP5 | Aceito |
| RF31 | Exibir estatísticas de alcance das notificações | Permitir que o gestor visualize estatísticas de alcance das notificações enviadas. | CP5 | Nada Consta |
| RF32 | Gerenciar envio de notificações | Permitir que o gestor gerencie notificações enviadas. | CP5 | Nada Consta |
| RF33 | Preencher solicitação de parceria | Permitir que um candidato a parceiro preencha um formulário simplificado para solicitação de parceria, coletando informações (data, tipo e área). | CP6 | Aceito |
| RF34 | Visualizar propostas de parceria | Apresentar um painel centralizado para a equipe do IBRADA visualizar as solicitações de parceria recebidas. | CP6 | Aceito |
| RF35 | Enviar resposta de solicitação de parceria | Permitir que o gestor escreva uma resposta à solicitação de parceria pelo sistema, que será enviada de forma automática por email para a empresa candidata. | CP6 | Nada Consta |

## Requisitos Não funcionais

| ID | Nome | Descrição | Classificação URPS+ | CPs relacionadas/transversais | Ajustado + justificativa |
| -- | ---- | --------- | ------------------- | ------------------------------ | ------------------------ |
| RNF01 | Responsividade da interface | A interface do sistema deve se adaptar a smartphones (320px-480px), tablets (481px-1024px) e desktops (acima de 1024px), sem quebra de layout ou sobreposição nos três breakpoints definidos. | Portabilidade | Transversal (Todas as CPs) | Aceito |
| RNF02 | Integridade transacional | O sistema deve garantir a conformidade ACID nas transações de ecoturismo e impedir reservas concorrentes para a mesma vaga por meio de controle de concorrência (lock otimista/pessimista e constraints de unicidade/capacidade na tabela de reservas). Em caso de requisições simultâneas para a última vaga disponível, apenas a primeira transação confirmada deve ser efetivada, rejeitando as demais sem gerar overbooking. | Confiabilidade | CP3 | Aceito |
| RNF03 | Desempenho do catálogo | O tempo de carregamento das listagens de projetos e do catálogo de experiências de ecoturismo não deve ultrapassar 3 segundos em conexão de 15 Mbps. | Performance | CP1, CP3 | Aceito |
| RNF04 | Autenticação e autorização | O sistema deve negar acesso por padrão a usuários não autenticados ou sem papel de Gestor, e registrar tentativas de acesso não autorizadas às rotas de gerenciamento. | + (Segurança) | Transversal (CP1, CP3, CP4, CP6) | Aceito |
| RNF05 | Integração Externa | A interface de integração externa via webhook deve processar notificações recebidas de forma assíncrona em até 3 segundos, realizando até 5 tentativas automáticas de reprocessamento em caso de falha na comunicação. | + (Interfaces) | CP3 | Aceito |
| RNF06 | Escalabilidade sob demanda | O sistema deve suportar 200 usuários simultâneos ativos (navegando, reservando ou preenchendo formulários), com tempo de resposta ≤ 2s para 95% das requisições e taxa de erro ≤ 1% (respostas 5xx ou timeout), medidos em teste de carga de 10 minutos em ambiente de homologação. | Performance / Suportabilidade | CP1, CP3, CP5 | Aceito |
| RNF07 | Disponibilidade do sistema | A plataforma deve garantir disponibilidade mínima de 98% ao mês para acesso público (dashboard de projetos, catálogo de ecoturismo, formulários de triagem e parceria) com manutenções programadas com 2 dias de antecedência realizadas fora do horário de pico (entre as 02h00 e as 05h00 - BRT). | Confiabilidade | Transversal (Todas as CPs) | Aceito |
| RNF08 | Proteção de dados pessoais (LGPD) | O sistema deve proteger os dados pessoais e sensíveis (como CPF e informações de contato) de voluntários e clientes utilizando criptografia padrão AES-256 para dados em repouso no banco de dados e protocolo TLS 1.2 ou superior (HTTPS) para dados em trânsito. | + (Legal/Segurança) | CP3, CP4, CP6 | Aceito |
| RNF09 | Usabilidade do formulário de triagem | O formulário de triagem inicial deve ser simples o suficiente para ser concluído por usuários com baixa familiaridade digital, sem a necessidade de criação de conta, com taxa de conclusão ≥ 90%. | Usabilidade | CP2 | Aceito |
| RNF10 | Compatibilidade entre navegadores | O sistema deve apresentar paridade funcional e visual, sem quebras de layout, nas duas últimas versões estáveis do Chrome, Firefox, Safari e Edge. | Suportabilidade | Transversal (Todas as CPs) | Aceito |


## PDF - CASCATA ÁGIL

<iframe src="../assets/documents/documento_avaliacao_cascata.pdf" width="100%" height="600px">
    <p>Seu navegador não suporta a visualização de PDFs. 
    <a href="../assets/documents/documento_avaliacao_cascata.pdf">Clique aqui para baixar o PDF.</a></p>
</iframe>