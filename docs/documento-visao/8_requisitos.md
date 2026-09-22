# 8 REQUISITOS DE SOFTWARE

> Esta seção descreve os requisitos necessários para o desenvolvimento do software. Ela está dividida em requisitos funcionais e não funcionais, que apresentam as funcionalidades do sistema e as qualidades que ele deve possuir para atender às expectativas dos usuários.

## 8.1 Lista de Requisitos Funcionais

>Os requisitos funcionais descrevem as funcionalidades específicas que o sistema deve implementar para atender às necessidades do negócio. Eles incluem integrações, processos e interações do usuário com o sistema. 

| ID   | Nome                                           | Descrição                                                                                                                                         | Relação |
|------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| RF01 | Cadastrar projetos                             | Permitir que os administradores do IBRADA possam cadastrar projetos ecossociais nas diferentes frentes de atuação.                                | CP1     |
| RF02 | Editar projetos                                | Permitir que os administradores possam editar informações sobre os projetos ecossociais.                                                          | CP1     |
| RF03 | Remover projetos                               | Permitir que os administradores possam remover informações sobre os projetos ecossociais.                                                         | CP1     |
| RF04 | Indicadores de impacto                         | Permitir que gestores atualizem indicadores de impacto para cada projeto.                                                                          | CP1     |
| RF05 | Exibir dashboard de impacto                    | Disponibilizar um painel público que permite interação com o gestor e exibe indicadores de impacto dos projetos.                                  | CP1     |
| RF07 | Apresentar formulário de triagem               | Apresentar um formulário guiado com campos simplificados para identificar o tipo de solicitação e o perfil do usuário.                            | CP2     |
| RF08 | Visualizar catálogo de ecoturismo              | Permitir aos usuários visualizar o catálogo de experiências de ecoturismo, incluindo descrições, datas, disponibilidade de vagas e valores.      | CP3     |
| RF09 | Detalhar experiências                          | Página detalhada de uma experiência com informações completas e com mecanismos simplificados de compartilhamento.                                | CP3     |
| RF10 | Cadastro de contas de clientes                 | Permitir a criação de contas de usuário com autenticação segura para clientes interessados em reservas.                                           | CP3     |
| RF11 | Realizar reserva de pacotes de ecoturismo      | Permitir que o usuário autenticado selecione uma experiência e realize a reserva, visualizando resumo antes do checkout.                          | CP3     |
| RF12 | Realizar pagamento                             | Permitir que o usuário realize pagamento de pacotes de ecoturismo.                                                                                | CP3     |
| RF13 | Criar experiências de ecoturismo               | Oferecer um painel administrativo para a equipe do IBRADA criar experiências.                                                                      | CP3     |
| RF14 | Editar experiências de ecoturismo              | Oferecer um painel administrativo para a equipe do IBRADA editar experiências.                                                                     | CP3     |
| RF15 | Habilitar a disponibilidade dos produtos       | O gestor pode habilitar a inscrição nas experiências de ecoturismo e oportunidades de voluntariado.                                                | CP3     |
| RF16 | Desabilitar a disponibilidade dos produtos     | O gestor pode desabilitar a inscrição nas experiências de ecoturismo e oportunidades de voluntariado.                                               | CP3     |
| RF17 | Gerenciar oportunidades de voluntariado        | Permitir ao administrador cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado. | CP4     |
| RF18 | Listar oportunidades de voluntariado           | Voluntários podem visualizar oportunidades abertas.                                                                                                | CP4     |
| RF19 | Cadastrar perfil do voluntário                 | Permitir que voluntários se cadastrem, informando suas habilidades, experiências, áreas de interesse e disponibilidade.                           | CP4     |
| RF20 | Candidatar voluntários                         | Permitir que voluntários se candidatem a oportunidades de voluntariado abertas.                                                                     | CP4     |
| RF21 | Visualizar candidatos                          | Permitir que gestores visualizem todos os candidatos em funil.                                                                                     | CP4     |
| RF22 | Criar perfil de interesse de notificações      | Permitir que os usuários selecionem preferências para receber notificações de novos projetos de interesse.                                         | CP5     |
| RF23 | Editar preferências de notificações            | Permitir que o usuário edite quais notificações deseja receber ou desativá-las.                                                                    | CP5     |
| RF24 | Exibir painel de gestão de notificações       | Permitir que o gestor visualize estatísticas e gerencie notificações enviadas.                                                                      | CP5     |
| RF25 | Realizar formulário de solicitação de parceria | Fornecer um formulário simplificado para empresas externas enviarem solicitações de parceria, coletando informações.                              | CP6     |
| RF26 | Gerenciar propostas de parceria                | Apresentar um painel centralizado para a equipe do IBRADA visualizar as solicitações recebidas.                                                    | CP6     |
| RF27 | Resposta de solicitação                        | O gestor deve conseguir enviar uma resposta formal à empresa via email.                                                                            | CP6     |
| RN01 | Filtrar dashboard de impacto                   | Permitir filtragem do dashboard de impacto por área de atuação, status e período.                                                                 | RF05    |
| RN02 | Redirecionar para atendimento via WhatsApp     | Redirecionar o usuário para o WhatsApp do IBRADA, carregando uma mensagem pré-configurada correspondente às respostas fornecidas na triagem.      | RF07    |
| RN03 | Encaminhamento para Departamentos              | Se a triagem identificar outro serviço, encaminhar a solicitação para um departamento específico (roteamento interno).                           | RF07    |
| RN04 | Filtros e busca de experiências                | Permitir que o usuário possa filtrar experiências por critérios.                                                                                  | RF08    |
| RN05 | Pagamento via gateway externo                  | Os pagamentos realizados no produto deverão utilizar um gateway externo via API e exibir o status do pagamento.                                    | RF12    |
| RN06 | Detalhes de oportunidade                       | Página com informações completas de uma oportunidade.                                                                                             | RF18    |
| RN07 | Filtros de candidato                           | Permitir que gestores filtrem candidatos por múltiplos critérios.                                                                                 | RF21    |
| RN08 | Detalhes de Candidato                          | Ao selecionar um candidato, o sistema permite visualizar seu perfil completo.                                                                     | RF21    |
| RN09 | Notificações a candidato de voluntariado       | Enviar notificações por email automaticamente aos usuários cadastrados que correspondam aos interesses declarados em seus perfis.                | RF22    |
| RN10 | Notificação novo projeto                       | Notificar apoiadores quando um novo projeto na sua área de interesse for lançado.                                                                  | RF22    |
| RN11 | Detalhe de Solicitação                         | Meio de visualizar informações completas da solicitação.                                                                                          | RF26    |

## 8.2 Lista de Requisitos Não Funcionais 

> Os requisitos não funcionais especificam as qualidades e restrições do sistema, como desempenho, segurança e usabilidade, que não estão diretamente relacionadas às funcionalidades oferecidas, mas são essenciais para garantir a qualidade do software. Utilize o modelo URPS+ para classificar os requisitos não funcionais. 

| ID    | Nome                                 | Descrição                                                                                                                                                                                                                                            | Classificação URPS+            | CPs relacionada/transversais |
|-------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|------------------------------|
| RNF01 | Responsividade da interface          | A interface do sistema deve se adaptar a smartphones (320px–480px), tablets (481px–1024px) e desktops (acima de 1024px), garantindo legibilidade, usabilidade e ausência de quebra de layout em todos os tamanhos de tela. | Usabilidade                    | Transversal (todas as CPs)    |
| RNF02 | Integridade transacional             | O banco de dados deve garantir a conformidade ACID (Atomicidade, Consistência, Isolamento, Durabilidade) nas transações de ecoturismo para impedir reservas duplicadas (overbooking) e inconsistências de vagas. | Confiabilidade                 | CP3                          |
| RNF03 | Desempenho do catálogo               | O tempo de carregamento das listagens de projetos e do catálogo de experiências de ecoturismo não deve ultrapassar 3 segundos em conexões de banda larga padrão. | Performance                    | CP1, CP3                     |
| RNF04 | Autenticação e autorização           | O sistema deve implementar controle de acesso baseado em papéis (RBAC - Role-Based Access Control), restringindo o acesso aos painéis de gerenciamento exclusivamente à equipe autorizada do IBRADA. | + (Segurança)                  | Transversal (CP1, CP3, CP4, CP6) |
| RNF05 | Integração Externa                   | O módulo de pagamento deve se comunicar com a API do gateway de pagamento externo de forma assíncrona, tratando as respostas de webhook para atualizar o status das reservas. | + (Interfaces)                 | CP3                          |
| RNF06 | Escalabilidade sob demanda           | O sistema deve suportar até 200 usuários simultâneos ativos (navegando, reservando ou preenchendo formulários) sem degradação perceptível de desempenho. | Performance / Suportabilidade | CP1, CP3, CP5                |
| RNF07 | Disponibilidade do sistema           | A plataforma deve estar disponível para acesso público (dashboard de projetos, catálogo de ecoturismo, formulários de triagem e parceria) de forma contínua, minimizando janelas de indisponibilidade. | Confiabilidade                 | Transversal (todas as CPs)   |
| RNF08 | Proteção de dados pessoais (LGPD)    | O sistema deve armazenar e tratar dados sensíveis (como CPF e informações de contato) de voluntários e clientes de forma criptografada no banco de dados, além de exibir e registrar o consentimento explícito do usuário no momento do cadastro. | + (Legal/Segurança)             | CP3, CP4, CP6                |
| RNF09 | Usabilidade do formulário de triagem | O formulário de triagem inicial deve ser simples o suficiente para ser concluído por usuários com baixa familiaridade digital. | Usabilidade                    | CP2                          |
| RNF10 | Compatibilidade entre navegadores    | O sistema deve funcionar corretamente nos principais navegadores web utilizados pelo público-alvo (Chrome, Firefox, Safari e Edge), suportando a versão estável mais recente e imediatamente a versão anterior de cada navegador. | Suportabilidade                | Transversal (todas as CPs)   |

> 8.3 Arvore/matriz de Rastreabilidade

| Contribuição Principal | CP  | VN | RFs/RNs | RNFs |
|------------------------|-----|----|---------|------|
| Gestão e transparência de projetos e seus impactos | CP1 | — | RF01, RF02, RF03, RF04, RF05, RN01 | RNF01, RNF03, RNF04, RNF06, RNF07, RNF10 |
| Triagem e direcionamento de solicitações | CP2 | — | RF07, RN02, RN03 | RNF01, RNF04, RNF07, RNF09, RNF10 |
| Gestão e comercialização de experiências de ecoturismo | CP3 | — | RF08, RF09, RF10, RF11, RF12, RF13, RF14, RF15, RF16, RN04, RN05 | RNF01, RNF02, RNF03, RNF04, RNF05, RNF06, RNF07, RNF08, RNF10 |
| Gestão de oportunidades e voluntários | CP4 | — | RF17, RF18, RF19, RF20, RF21, RN06, RN07, RN08 | RNF01, RNF04, RNF07, RNF08, RNF10 |
| Gestão de interesses e notificações | CP5 | — | RF22, RF23, RF24, RN09, RN10 | RNF01, RNF04, RNF06, RNF07, RNF08, RNF10 |
| Gestão de parcerias institucionais | CP6 | — | RF25, RF26, RF27, RN11 | RNF01, RNF04, RNF07, RNF08, RNF10 |