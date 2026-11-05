/* Gerado a partir da documentação (catálogos 8.x, 2.x e páginas de User Stories). */
window.MAPA_DATA = {
 "oe": {
  "OE1": {
   "curto": "Comunicação e relacionamento",
   "texto": "Otimizar e centralizar o fluxo de comunicação, atendimento e relacionamento com os diferentes públicos."
  },
  "OE2": {
   "curto": "Captação e conversão",
   "texto": "Estruturar processos de captação e conversão de interessados em clientes, apoiadores e parceiros."
  },
  "OE3": {
   "curto": "Recrutamento de voluntários",
   "texto": "Estruturar o processo de recrutamento, seleção e engajamento de voluntários."
  }
 },
 "oeOrder": [
  "OE1",
  "OE2",
  "OE3"
 ],
 "temas": {
  "T01": {
   "nome": "Atendimento e Triagem",
   "oe": "OE1"
  },
  "T04": {
   "nome": "Parcerias Institucionais",
   "oe": "OE1"
  },
  "T02": {
   "nome": "Ecoturismo e Reservas",
   "oe": "OE2"
  },
  "T03": {
   "nome": "Voluntariado",
   "oe": "OE3"
  }
 },
 "temaOrder": [
  "T01",
  "T04",
  "T02",
  "T03"
 ],
 "cp": {
  "CP2": {
   "nome": "Canal Unificado de Atendimento e Triagem",
   "oe": "OE1"
  },
  "CP3": {
   "nome": "Módulo Transacional de Ecoturismo",
   "oe": "OE2"
  },
  "CP4": {
   "nome": "Gestão do Ciclo de Voluntariado",
   "oe": "OE3"
  },
  "CP6": {
   "nome": "Gestão de Solicitações de Parcerias",
   "oe": "OE1"
  }
 },
 "epicos": {
  "EP01": {
   "nome": "Triagem e direcionamento",
   "tema": "T01",
   "cp": "CP2",
   "rn": [
    "RN01",
    "RN02"
   ],
   "rnf": [
    "RNF01",
    "RNF07",
    "RNF09"
   ]
  },
  "EP09": {
   "nome": "Solicitação e análise de parcerias",
   "tema": "T04",
   "cp": "CP6",
   "rn": [],
   "rnf": [
    "RNF01",
    "RNF04",
    "RNF07",
    "RNF08"
   ]
  },
  "EP02": {
   "nome": "Descoberta de experiências e pacotes",
   "tema": "T02",
   "cp": "CP3",
   "rn": [],
   "rnf": [
    "RNF01",
    "RNF03",
    "RNF07"
   ]
  },
  "EP04": {
   "nome": "Reserva e pagamento",
   "tema": "T02",
   "cp": "CP3",
   "rn": [
    "RN04"
   ],
   "rnf": [
    "RNF01",
    "RNF02",
    "RNF04",
    "RNF05",
    "RNF08"
   ]
  },
  "EP05": {
   "nome": "Gestão de experiências e pacotes",
   "tema": "T02",
   "cp": "CP3",
   "rn": [],
   "rnf": [
    "RNF01",
    "RNF04"
   ]
  },
  "EP03": {
   "nome": "Conta do cliente",
   "tema": "T02",
   "cp": "CP3",
   "rn": [
    "RN03"
   ],
   "rnf": [
    "RNF01",
    "RNF04",
    "RNF08"
   ]
  },
  "EP06": {
   "nome": "Conta e perfil do voluntário",
   "tema": "T03",
   "cp": "CP4",
   "rn": [],
   "rnf": [
    "RNF01",
    "RNF04",
    "RNF08"
   ]
  },
  "EP07": {
   "nome": "Descoberta e candidatura",
   "tema": "T03",
   "cp": "CP4",
   "rn": [],
   "rnf": [
    "RNF01",
    "RNF04",
    "RNF07",
    "RNF08"
   ]
  },
  "EP08": {
   "nome": "Gestão de oportunidades e candidatos",
   "tema": "T03",
   "cp": "CP4",
   "rn": [
    "RN05"
   ],
   "rnf": [
    "RNF01",
    "RNF04",
    "RNF08"
   ]
  }
 },
 "epicoOrder": [
  "EP01",
  "EP09",
  "EP02",
  "EP04",
  "EP05",
  "EP03",
  "EP06",
  "EP07",
  "EP08"
 ],
 "rn": {
  "RN01": {
   "nome": "Redirecionar para atendimento via WhatsApp",
   "desc": "Usuários devem ser redirecionados para o WhatsApp do IBRADA após responder uma triagem, carregando uma mensagem pré-configurada correspondente às respostas fornecidas na triagem.",
   "rel": "CP2",
   "cps": [
    "CP2"
   ]
  },
  "RN02": {
   "nome": "Encaminhamento para Departamentos",
   "desc": "Se a triagem identificar outro serviço, encaminhar solicitação para um departamento específico, realizando o roteamento interno.",
   "rel": "CP2",
   "cps": [
    "CP2"
   ]
  },
  "RN03": {
   "nome": "Cadastro de email de usuário",
   "desc": "Cada email registrado pode ter apenas um usuário vinculado a ele.",
   "rel": "CP3",
   "cps": [
    "CP3"
   ]
  },
  "RN04": {
   "nome": "Pagamento via gateway externo",
   "desc": "Os pagamentos realizados no produto deverão utilizar um gateway externo via API, exibindo o status do pagamento.",
   "rel": "CP3",
   "cps": [
    "CP3"
   ]
  },
  "RN05": {
   "nome": "Filtro de candidatos",
   "desc": "O sistema de processo seletivo deve filtrar candidatos aptos a uma oportunidade de voluntariado através de um funil baseado em critérios informados durante o cadastro selecionados pelo gestor durante o cadastro da oportunidade (exemplos: aptidão física, conhecimento técnico, experiências poteriores, etc.).",
   "rel": "CP4",
   "cps": [
    "CP4"
   ]
  }
 },
 "rnf": {
  "RNF01": {
   "nome": "Responsividade da interface",
   "desc": "A interface do sistema deve preservar a usabilidade e adaptar os componentes visuais para resoluções de desktops, laptops, tablets e dispositivos móveis (smartphones).",
   "classe": "Usabilidade",
   "rel": "Transversal (Todas as CPs)",
   "cps": [
    "CP1",
    "CP2",
    "CP3",
    "CP4",
    "CP5",
    "CP6"
   ]
  },
  "RNF02": {
   "nome": "Integridade transacional",
   "desc": "O sistema deve garantir transações ACID e impedir reservas concorrentes para a mesma vaga, evitando overbooking.",
   "classe": "Confiabilidade",
   "rel": "CP3",
   "cps": [
    "CP3"
   ]
  },
  "RNF03": {
   "nome": "Desempenho do catálogo",
   "desc": "As listagens de projetos e do catálogo de experiências devem carregar em até 3 segundos, em pelo menos 95% das medições, com conexão de 15 Mbps ou mais e com até 50 usuários simultâneos.",
   "classe": "Performance",
   "rel": "CP1, CP3",
   "cps": [
    "CP1",
    "CP3"
   ]
  },
  "RNF04": {
   "nome": "Autenticação e autorização",
   "desc": "O sistema deve negar acesso por padrão a usuários não autenticados ou sem papel de Gestor e registrar em log do sistema as tentativas de acesso não autorizado às rotas de gerenciamento, com data/hora e rota acessada.",
   "classe": "Segurança",
   "rel": "Transversal (CP1, CP3, CP4, CP6)",
   "cps": [
    "CP1",
    "CP3",
    "CP4",
    "CP6"
   ]
  },
  "RNF05": {
   "nome": "Integração Externa",
   "desc": "O sistema deve receber as notificações de pagamento do provedor externo e atualizar o status da reserva correspondente, sem processá-las em duplicidade.",
   "classe": "(+Interfaces/Confiabilidade)",
   "rel": "CP3",
   "cps": [
    "CP3"
   ]
  },
  "RNF07": {
   "nome": "Disponibilidade do sistema",
   "desc": "A plataforma deve ter disponibilidade mínima de 98% nas áreas de acesso público, aferida por monitoramento externo com verificação a cada 5 minutos",
   "classe": "Confiabilidade",
   "rel": "Transversal (Todas as CPs)",
   "cps": [
    "CP1",
    "CP2",
    "CP3",
    "CP4",
    "CP5",
    "CP6"
   ]
  },
  "RNF08": {
   "nome": "Proteção de dados pessoais e credenciais (LGPD)",
   "desc": "O sistema deve proteger os dados pessoais de voluntários e clientes (como CPF e informações de contato), transmitindo-os exclusivamente por conexão criptografada (HTTPS/TLS), e armazenar senhas utilizando o hash, por meio de algoritmo adequado para senhas (bcrypt ou Argon2).",
   "classe": "Segurança",
   "rel": "CP3, CP4, CP6",
   "cps": [
    "CP3",
    "CP4",
    "CP6"
   ]
  },
  "RNF09": {
   "nome": "Usabilidade do formulário de triagem",
   "desc": "O formulário de triagem inicial deve poder ser concluído, sem criação de conta, por pelo menos 90% dos usuários com baixa familiaridade digital em teste de usabilidade com o protótipo, considerando concluído quando o usuário chega ao encaminhamento adequado sem ajuda externa.",
   "classe": "Usabilidade",
   "rel": "CP2",
   "cps": [
    "CP2"
   ]
  }
 },
 "us": [
  {
   "id": "US01",
   "nome": "Realizar triagem",
   "epicos": [
    "EP01"
   ],
   "historia": "Como visitante da plataforma, quero responder a um formulário de triagem guiado e simplificado, para ser encaminhado ao setor ou fluxo de comunicação adequado à minha necessidade.",
   "criterios": [
    "O sistema deve apresentar um formulário de triagem guiado, com campos simplificados, que possa ser concluído sem cadastro.",
    "O sistema deve identificar o tipo de solicitação e o perfil do visitante a partir das respostas e armazenar os dados informados.",
    "Após o envio, o sistema deve encaminhar o visitante ao canal ou departamento correspondente às respostas fornecidas.",
    "O sistema deve retornar uma mensagem de erro caso a triagem não possa ser concluída ou algum campo obrigatório não seja preenchido."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US19",
   "nome": "Enviar solicitação de parceria",
   "epicos": [
    "EP09"
   ],
   "historia": "Como representante de uma organização interessada, quero enviar uma solicitação contendo meus dados de contato e as informações da proposta, para iniciar uma possível parceria com o IBRADA.",
   "criterios": [
    "O sistema deve permitir o preenchimento dos dados de identificação e contato da organização e do representante interessado.",
    "O sistema deve disponibilizar uma seção de texto livre para que o usuário possa descrever o tipo de parceria que queira sugerir ou trabalhar.",
    "Deve haver um botão para enviar a proposta. O botão deve ser bloqueado caso algum campo de identificação não seja preenchido."
   ],
   "issue": 44,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/44",
   "adaptado": false
  },
  {
   "id": "US20",
   "nome": "Visualizar solicitações de parceria",
   "epicos": [
    "EP09"
   ],
   "historia": "Como gestor do IBRADA, quero visualizar as solicitações de parceria recebidas e suas informações, para organizar sua análise e entrar em contato com os potenciais parceiros.",
   "criterios": [
    "O sistema deve disponibilizar um ambiente com uma lista com as propostas enviadas para os gestores. Deve ser possível selecionar um item da lista para sua própria seção.",
    "Após selecionar um item da lista, o sistema deve direcionar o gestor para a seção da proposta com todas as informações registradas (identificação, contato e proposta)."
   ],
   "issue": 45,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/45",
   "adaptado": false
  },
  {
   "id": "US02",
   "nome": "Visualizar catálogo de ecoturismo",
   "epicos": [
    "EP02"
   ],
   "historia": "Como visitante, quero visualizar o catálogo de pacotes de ecoturismo, para conhecer as opções disponíveis e escolher a mais adequada ao meu interesse e planejamento.",
   "criterios": [
    "O sistema deve exibir uma lista das experiências de ecoturismo com nome, descrição, data, vagas disponíveis e valor.",
    "Experiências sem vagas ou indisponíveis devem ser sinalizadas na listagem.",
    "O sistema deve permitir que o usuário selecione uma experiência e direcione para sua própria página de detalhes."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US03",
   "nome": "Visualizar detalhes de pacote de ecoturismo",
   "epicos": [
    "EP02"
   ],
   "historia": "Como visitante, quero visualizar as informações detalhadas de um pacote de ecoturismo selecionado, para planejar minha participação com precisão.",
   "criterios": [
    "A página de cada experiência deve conter todas as informações sobre o pacote de ecoturismo (descrição, roteiro, data, vagas disponíveis e valor).",
    "O sistema deve exibir uma opção para reservar, e bloqueá-la caso a experiência esteja indisponível ou sem vagas."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US24",
   "nome": "Compartilhar experiência de ecoturismo",
   "epicos": [
    "EP02"
   ],
   "historia": "Como visitante, quero compartilhar uma experiência de ecoturismo, para apresentá-la a outras pessoas interessadas.",
   "criterios": [
    "O sistema deve disponibilizar, na página de cada experiência, uma opção para compartilhar seu conteúdo.",
    "O conteúdo compartilhado deve identificar a experiência (nome e descrição resumida).",
    "O link compartilhado deve direcionar para a página de detalhes da experiência identificada."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US08",
   "nome": "Reservar pacote de ecoturismo",
   "epicos": [
    "EP04"
   ],
   "historia": "Como cliente, quero realizar a reserva de um pacote de ecoturismo selecionado, para garantir minha vaga na experiência desejada.",
   "criterios": [
    "O sistema deve permitir que o cliente autenticado selecione uma experiência com vaga disponível e informe os dados da reserva.",
    "Caso o usuário não esteja autenticado, o sistema deve direcioná-lo à página de login antes de prosseguir com a reserva.",
    "O sistema deve impedir a reserva quando não houver vagas suficientes e retornar uma mensagem de erro.",
    "O sistema deve impedir reservas concorrentes para a mesma vaga (overbooking)."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US09",
   "nome": "Revisar e confirmar reserva",
   "epicos": [
    "EP04"
   ],
   "historia": "Como cliente, quero visualizar um resumo completo da minha reserva e confirmar os dados antes do pagamento, para validar as informações do passeio e os valores, evitando erros ou cobranças indevidas.",
   "criterios": [
    "Antes do pagamento, o sistema deve exibir um resumo da reserva com experiência, data, quantidade, valores e condições.",
    "O sistema deve permitir que o cliente volte e altere os dados da reserva antes de confirmá-la.",
    "O sistema só deve prosseguir para o pagamento após a confirmação explícita dos dados pelo cliente."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US10",
   "nome": "Pagar reserva",
   "epicos": [
    "EP04"
   ],
   "historia": "Como cliente, quero realizar o pagamento dos pacotes de ecoturismo que reservei, para confirmar minha vaga e receber o comprovante da transação.",
   "criterios": [
    "O sistema deve encaminhar o cliente ao gateway de pagamento externo para realizar o pagamento da reserva.",
    "O sistema deve exibir o status do pagamento retornado pelo gateway (aprovado, pendente ou recusado).",
    "Caso o pagamento seja aprovado, o sistema deve confirmar a reserva e disponibilizar o comprovante da transação.",
    "Caso o pagamento falhe ou seja recusado, o sistema não deve confirmar a vaga e deve retornar uma mensagem de erro."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US11",
   "nome": "Cadastrar experiência de ecoturismo",
   "epicos": [
    "EP05"
   ],
   "historia": "Como gestor do IBRADA, quero cadastrar novas experiências de ecoturismo, informando seus roteiros, datas, valores e disponibilidade, para oferecê-las aos clientes interessados.",
   "criterios": [
    "O sistema deve verificar o preenchimento dos campos obrigatórios da experiência (roteiro, datas, valores e disponibilidade).",
    "O cadastro de experiências deve ser permitido apenas ao gestor autenticado.",
    "O sistema deve retornar uma mensagem de erro caso o cadastro não seja concluído e uma mensagem de sucesso caso a experiência seja salva.",
    "A experiência cadastrada deve aparecer no catálogo conforme sua disponibilidade."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US12",
   "nome": "Controlar disponibilidade de pacotes",
   "epicos": [
    "EP05"
   ],
   "historia": "Como gestor, quero habilitar ou desabilitar a disponibilidade de pacotes de ecoturismo, para controlar a oferta dos pacotes.",
   "criterios": [
    "O sistema deve permitir que o gestor autenticado marque uma experiência como disponível ou indisponível.",
    "Experiências indisponíveis devem ser sinalizadas no catálogo e não devem aceitar novas reservas.",
    "O sistema deve retornar uma mensagem de sucesso caso a alteração seja salva e uma mensagem de erro caso contrário."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US04",
   "nome": "Cadastrar-se como cliente",
   "epicos": [
    "EP03"
   ],
   "historia": "Como visitante da plataforma, quero me cadastrar como cliente de ecoturismo, para criar uma conta pessoal e acessar as funcionalidades de compra de pacotes de ecoturismo.",
   "criterios": [
    "O sistema deve verificar o preenchimento dos campos obrigatórios.",
    "A senha do cadastro deve ter no mínimo 8 caracteres, contendo um caractere maiúsculo, um número e um caractere especial.",
    "O sistema deve verificar se o email já foi registrado.",
    "O sistema deve retornar uma mensagem de erro caso o cadastro não seja realizado com sucesso.",
    "O sistema deve direcionar o usuário para a página de login após o cadastro."
   ],
   "issue": 37,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/37",
   "adaptado": false
  },
  {
   "id": "US05",
   "nome": "Visualizar e editar dados pessoais",
   "epicos": [
    "EP03"
   ],
   "historia": "Como cliente, quero visualizar e editar meus dados pessoais registrados, para manter minhas informações corretas e atualizadas durante o uso dos serviços da plataforma.",
   "criterios": [
    "O sistema deve verificar se os dados preenchidos obedecem às regras de seu campo antes do salvamento.",
    "O sistema deve retornar uma mensagem de erro caso a edição não seja concluída e uma mensagem de sucesso caso os dados sejam salvos."
   ],
   "issue": 38,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/38",
   "adaptado": false
  },
  {
   "id": "US06",
   "nome": "Autenticar-se como cliente",
   "epicos": [
    "EP03"
   ],
   "historia": "Como cliente, quero autenticar-me no sistema informando minhas credenciais, para acessar minha conta de forma segura e utilizar as funcionalidades de compra de pacotes de ecoturismo.",
   "criterios": [
    "O sistema deve verificar se as credenciais correspondem aos dados registrados da conta.",
    "Caso a autenticação falhe, o sistema deve bloquear o acesso e retornar uma mensagem de erro.",
    "Caso as credenciais sejam válidas, o sistema deve autenticar o usuário e direcioná-lo à página inicial."
   ],
   "issue": 39,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/39",
   "adaptado": false
  },
  {
   "id": "US07",
   "nome": "Encerrar sessão de cliente",
   "epicos": [
    "EP03"
   ],
   "historia": "Como cliente, quero encerrar minha sessão ativa no sistema, para proteger minha conta e impedir acessos não autorizados no dispositivo utilizado.",
   "criterios": [
    "O sistema deve solicitar confirmação antes de encerrar a sessão do usuário.",
    "Após a confirmação, o sistema deve invalidar a sessão ativa e retornar para a página inicial ou página de login.",
    "Após o encerramento, o sistema deve impedir acesso a regiões protegidas sem uma nova autenticação."
   ],
   "issue": 40,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/40",
   "adaptado": false
  },
  {
   "id": "US23",
   "nome": "Registrar consentimento de uso de dados",
   "epicos": [
    "EP03",
    "EP06"
   ],
   "historia": "Como usuário em processo de cadastro, quero consultar e aceitar explicitamente o termo de uso de dados pessoais, para decidir de forma consciente sobre o tratamento das minhas informações.",
   "criterios": [
    "Durante o cadastro, o sistema deve exibir uma opção para ver os termos de uso de dados pessoais.",
    "O sistema deve permitir que o usuário aceite os termos de uso de dados pessoais durante o cadastro.",
    "O sistema deve bloquear o cadastro de uma nova conta caso os termos de uso de dados pessoais não sejam aceitos."
   ],
   "issue": 48,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/48",
   "adaptado": false
  },
  {
   "id": "US15",
   "nome": "Criar perfil de voluntário",
   "epicos": [
    "EP06"
   ],
   "historia": "Como interessado em atuar como voluntário, quero criar um perfil informando minhas habilidades, experiências, áreas de interesse e disponibilidade, para apresentar ao IBRADA como posso contribuir com seus projetos.",
   "criterios": [
    "O sistema deve verificar o preenchimento dos campos obrigatórios.",
    "A senha do cadastro deve ter no mínimo 8 caracteres, contendo um caractere maiúsculo, um número e um caractere especial.",
    "O sistema deve verificar se o email já foi registrado.",
    "O sistema deve retornar uma mensagem de erro caso o cadastro não seja realizado com sucesso.",
    "Durante o cadastro, o sistema deve permitir se cadastrar como voluntário e registrar habilidades e interesses do usuário.",
    "Caso o usuário já possua um login salvo de um acesso anterior, o sistema deve autenticá-lo automaticamente ao concluir o perfil de voluntário e direcioná-lo à página principal; caso contrário, deve direcioná-lo à página de login, como no cadastro de cliente (US04)."
   ],
   "issue": 42,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/42",
   "adaptado": true
  },
  {
   "id": "US17",
   "nome": "Autenticar-se como voluntário",
   "epicos": [
    "EP06"
   ],
   "historia": "Como voluntário cadastrado, quero autenticar-me com minhas credenciais, para acessar com segurança meu perfil e as funcionalidades destinadas aos voluntários.",
   "criterios": [
    "O sistema deve verificar se as credenciais correspondem aos dados registrados da conta.",
    "Caso a autenticação falhe, o sistema deve bloquear o acesso e retornar uma mensagem de erro.",
    "Caso as credenciais sejam válidas, o sistema deve autenticar o usuário e direcioná-lo à página inicial."
   ],
   "issue": 43,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/43",
   "adaptado": false
  },
  {
   "id": "US22",
   "nome": "Encerrar sessão de voluntário",
   "epicos": [
    "EP06"
   ],
   "historia": "Como voluntário autenticado, quero encerrar minha sessão, para proteger minha conta contra acessos não autorizados no dispositivo utilizado.",
   "criterios": [
    "O sistema deve solicitar confirmação antes de encerrar a sessão do usuário.",
    "Após a confirmação, o sistema deve invalidar a sessão ativa e retornar para a página inicial ou página de login.",
    "Após o encerramento, o sistema deve impedir acesso a regiões protegidas sem uma nova autenticação."
   ],
   "issue": 47,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/47",
   "adaptado": false
  },
  {
   "id": "US14",
   "nome": "Visualizar detalhes da oportunidade",
   "epicos": [
    "EP07"
   ],
   "historia": "Como visitante da plataforma, quero visualizar as informações detalhadas de uma oportunidade de voluntariado selecionada, para conhecer o projeto associado, a duração, a disponibilidade e as habilidades requeridas.",
   "criterios": [
    "A página de cada oportunidade deve conter todas as informações sobre a atividade de voluntariado (projeto associado, atividades planejadas, duração, disponibilidade e habilidades requeridas).",
    "O sistema deve exibir uma opção para se candidatar, e bloqueá-la caso a oportunidade não esteja disponível ou não esteja aceitando candidatos."
   ],
   "issue": 41,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/41",
   "adaptado": false
  },
  {
   "id": "US16",
   "nome": "Candidatar-se a uma oportunidade",
   "epicos": [
    "EP07"
   ],
   "historia": "Como voluntário, quero me candidatar a oportunidades de voluntariado que se encaixem no meu perfil, para que o gestor visualize meu interesse em participar do projeto.",
   "criterios": [
    "O sistema deve permitir a candidatura apenas a voluntários autenticados, direcionando os demais à página de login.",
    "O sistema deve permitir que o voluntário se candidate a uma oportunidade aberta e registrar a candidatura.",
    "O sistema deve impedir candidatura duplicada ou para oportunidade encerrada, retornando uma mensagem de erro.",
    "O sistema deve exibir uma mensagem de sucesso após o envio da candidatura."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US21",
   "nome": "Consultar oportunidades abertas",
   "epicos": [
    "EP07"
   ],
   "historia": "Como interessado em voluntariado, quero consultar as oportunidades abertas, para encontrar formas de contribuir compatíveis com meus interesses e disponibilidade.",
   "criterios": [
    "O sistema deve exibir uma lista de todas as oportunidades de voluntariado abertas.",
    "Cada item da lista deve exibir informações resumidas como nome, duração e disponibilidade.",
    "O sistema deve permitir que o usuário selecione a oportunidade e direcione para sua própria seção."
   ],
   "issue": 46,
   "issueUrl": "https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues/46",
   "adaptado": false
  },
  {
   "id": "US13",
   "nome": "Cadastrar oportunidade de voluntariado",
   "epicos": [
    "EP08"
   ],
   "historia": "Como gestor, quero cadastrar oportunidades de voluntariado, definindo habilidades requeridas, duração, disponibilidade e projeto associado, para divulgar as vagas disponíveis e atrair voluntários com o perfil adequado às necessidades de cada ação.",
   "criterios": [
    "O sistema deve verificar o preenchimento dos campos obrigatórios da oportunidade (habilidades requeridas, duração, disponibilidade e projeto associado).",
    "O sistema deve permitir que o gestor selecione, no cadastro, os critérios usados para filtrar os candidatos no funil.",
    "O cadastro de oportunidades deve ser permitido apenas ao gestor autenticado.",
    "O sistema deve retornar uma mensagem de erro caso o cadastro não seja concluído e uma mensagem de sucesso caso a oportunidade seja salva."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  },
  {
   "id": "US18",
   "nome": "Visualizar candidatos em funil",
   "epicos": [
    "EP08"
   ],
   "historia": "Como gestor membro da equipe do IBRADA, quero visualizar os candidatos voluntários de uma oportunidade em formato de funil, para acompanhar com clareza o processo de triagem e seleção.",
   "criterios": [
    "O sistema deve exibir ao gestor os candidatos de uma oportunidade agrupados por etapa do funil.",
    "O sistema deve filtrar os candidatos aptos de acordo com os critérios definidos no cadastro da oportunidade.",
    "Cada candidato deve exibir as informações de seu perfil (habilidades, experiências e disponibilidade) para a análise do gestor.",
    "O acesso ao funil de candidatos deve ser permitido apenas ao gestor autenticado."
   ],
   "issue": null,
   "issueUrl": null,
   "adaptado": false
  }
 ]
};
