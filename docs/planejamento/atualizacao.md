## Estratégia de Atualização

O processo de atualização é aplicado de diferentes formas no decorrer do projeto, podendo ser separado em três etapas:

**Verificação de novas funcionalidades:** Durante a construção de novas funcionalidades, é essencial aplicar uma verificação de walkthrough para garantir que todas as funcionalidades estejam atendendo ao DoD (Definition of Done) das histórias de usuário relacionadas ao trabalho realizado. Esses registros devem ser feitos nas pull requests das funcionalidades, contendo os registros de adições e feedback. Após a aprovação, deve-se marcar as checklists do DoD das issues relacionadas e registrar as evidências na página do ciclo.

**Atualização pós-validação:** Após as validações com o cliente, devem ser registradas todas as alterações ou adições de regras de negócio e funcionalidades (no formato de US e RF) apresentadas durante a reunião. Essas alterações devem ser documentadas nesta página, e a sua rastreabilidade deve ser implementada nas demais seções do documento.

**Auditoria de encerramento:** Além disso, será feita uma verificação geral das evidências e da documentação no final de cada ciclo para garantir que tudo esteja em ordem.

## Alterações dos Requisitos

| User Story | RF Relacionada | Tipo de Alteração | Motivo | Status no MVP |
| ---------- | -------------- | ----------------- | ------ | ------------- |
| US24 | RF36 | Nova Adição | Separação da funcionalidade da RF07 entre detalhar dados do pacote (US03) e compartilhar o pacote (US24). | Dentro do MVP |
| US38 | RF37 | Nova Adição | Especificar funcionalidade de envio automatico de emails, anteriormente apenas declarado na regra de negócio RN05. Não entrou no MVP devido à CP5 não estar no escopo do produto atual. | *Fora do MVP* |
| US36 | RF32 | Atualização | Especificação do termo "gerenciar" usado na descrição do requisito: uso de críterios para manipular o alcance das notificações. | *Fora do MVP* |
| US02, US03, US11, US12, US24 | RF06, RF07, RF15, RF17, RF36 | Atualização | Substituição do termo "experiência" por "pacote" em todos os artefatos de ecoturismo, a pedido do cliente ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)), reforçada nas validações de [08/11](../atas-reuniao/unidade-3/08-11.md) e [15/11](../atas-reuniao/unidade-3/15-11.md). | Dentro do MVP |
| US30 | RF16 | Remoção do escopo | A edição de pacotes ficou fora do MVP; as alterações serão feitas por substituição do cadastro ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)). Na validação de [08/11](../atas-reuniao/unidade-3/08-11.md) foi esclarecido que o cliente exclui e recria o pacote, ou a equipe altera direto no banco. Na Unidade 3, o procedimento foi detalhado: a exclusão só vale para pacotes sem reservas ([procedimentos provisórios](../documento-visao/2_solucao.md#231-procedimentos-provisorios-do-mvp)). | *Fora do MVP* |
| US31, US33 | RF19, RF24 | Remoção do escopo | A edição de oportunidades de voluntariado e do perfil do voluntário não fará parte do MVP ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)). | *Fora do MVP* |
| US34, US35, US36 | RF30, RF31, RF32 | Remoção do escopo | O módulo de notificações foi retirado do MVP, corrigindo um erro da matriz que o havia incluído ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)). | *Fora do MVP* |
| US32 | RF20 | Esclarecimento | No MVP, as contas de gestor são criadas diretamente no banco de dados ([ata de 08/11](../atas-reuniao/unidade-3/08-11.md)). Na matriz, o RF20 aparece também em outras CPs como dependência de gestão de acesso, mas sua origem continua na CP4. | *Fora do MVP* |
| US23 | RF29 | Atualização | O vínculo passa a incluir CP3 e CP4, porque o consentimento é registrado no cadastro único, usado por clientes e voluntários ([ata de 08/11](../atas-reuniao/unidade-3/08-11.md)). | Dentro do MVP |
| US09, US10, US25, US26, US27, US29 | RF13, RF14, RF01, RF02, RF03, RF04 | Refinamento de redação | Detalhamento do comportamento esperado: revisão dos dados antes do checkout (RF13), confirmação da participação após pagamento aprovado (RF14), controle de visibilidade dos projetos (RF01) e distinção entre resultados alcançados e impactos pretendidos (RF04). | US09 e US10: dentro do MVP; demais: *fora do MVP* |

## Alterações das Regras de Negócio e dos Requisitos Não Funcionais

| Item | Tipo de Alteração | O que mudou | Motivo | Status no MVP |
| ---- | ----------------- | ----------- | ------ | ------------- |
| RN01 a RN05 (antes RN01 a RN06) | Reorganização | A regra de encaminhamento da triagem foi consolidada na RN01 (encaminhamento via WhatsApp para o departamento específico) e as demais regras foram renumeradas. | O envio automático de notificações por correspondência de interesses saiu da regra de negócio e virou o RF37 ([ata de 08/11](../atas-reuniao/unidade-3/08-11.md)). A RN05 passou a tratar apenas do envio por e-mail. | Conforme a CP de origem (RN05 é da CP5, *fora do MVP*) |
| RNF06 | Remoção do escopo | Retirado do MVP e reformulado (tempo de resposta de até 3 s e taxa de erro de até 2%, em teste de carga). | O volume de tráfego atual do IBRADA não exige alta escalabilidade ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)). | *Fora do MVP* |
| RNF10 | Remoção do escopo | Compatibilidade entre navegadores retirada do MVP. | A paridade em navegadores legados não é necessária para o contexto atual ([ata de 11/10](../atas-reuniao/unidade-2/11-10.md)). | *Fora do MVP* |
| RNF01 a RNF05, RNF07 a RNF09 | Reformulação | Redação revisada com critério de aferição: RNF03 (95% das medições, com até 50 usuários simultâneos), RNF04 (log com data, hora e rota), RNF05 (notificações de pagamento sem processamento em duplicidade), RNF07 (monitoramento externo a cada 5 minutos), RNF08 (HTTPS/TLS e senhas armazenadas com hash); RNF01 passou de Portabilidade para Usabilidade. | Tornar os requisitos verificáveis, para que possam ser validados nas etapas de verificação e validação. | Dentro do MVP |
