# User Stories fora do MVP

Estas histórias permanecem no backlog geral do produto, mas não fazem parte do escopo definido para o MVP. Elas serão refinadas e priorizadas para entregas posteriores, quando receberão critérios de aceitação. O identificador US28 permanece sem atribuição.

| US | Nome | RF | Épico | Tema |
| --- | --- | --- | --- | --- |
| [US25](us25.md) | Cadastrar projetos | [RF01](../documento-visao/8_requisitos.md#rf01) | EP10 — Gestão de projetos | T05 — Gestão e Transparência de Projetos |
| [US26](us26.md) | Editar projetos | [RF02](../documento-visao/8_requisitos.md#rf02) | EP10 — Gestão de projetos | T05 — Gestão e Transparência de Projetos |
| [US27](us27.md) | Remover projetos | [RF03](../documento-visao/8_requisitos.md#rf03) | EP10 — Gestão de projetos | T05 — Gestão e Transparência de Projetos |
| [US29](us29.md) | Visualizar painel público de projetos | [RF04](../documento-visao/8_requisitos.md#rf04) | EP11 — Transparência e impacto dos projetos | T05 — Gestão e Transparência de Projetos |
| [US30](us30.md) | Editar pacotes de ecoturismo | [RF16](../documento-visao/8_requisitos.md#rf16) | EP05 — Gestão de experiências e pacotes | T02 — Ecoturismo e Reservas |
| [US31](us31.md) | Editar oportunidade de voluntariado | [RF19](../documento-visao/8_requisitos.md#rf19) | EP08 — Gestão de oportunidades e candidatos | T03 — Voluntariado |
| [US32](us32.md) | Gerenciar acesso de gestores | [RF20](../documento-visao/8_requisitos.md#rf20) | EP12 — Gestão de acesso administrativo | T03 — Voluntariado |
| [US33](us33.md) | Editar perfil de voluntário | [RF24](../documento-visao/8_requisitos.md#rf24) | EP06 — Conta e perfil do voluntário | T03 — Voluntariado |
| [US34](us34.md) | Configurar preferências de notificações | [RF30](../documento-visao/8_requisitos.md#rf30) | EP13 — Preferências de notificações | T06 — Notificações e Engajamento |
| [US35](us35.md) | Visualizar alcance das notificações | [RF31](../documento-visao/8_requisitos.md#rf31) | EP14 — Gestão e monitoramento de notificações | T06 — Notificações e Engajamento |
| [US36](us36.md) | Gerenciar notificações | [RF32](../documento-visao/8_requisitos.md#rf32) | EP14 — Gestão e monitoramento de notificações | T06 — Notificações e Engajamento |
| [US37](us37.md) | Responder à solicitação de parceria | [RF35](../documento-visao/8_requisitos.md#rf35) | EP09 — Solicitação e análise de parcerias | T04 — Parcerias Institucionais |
| [US38](us38.md) | Receber notificações de interesse | [RF37](../documento-visao/8_requisitos.md#rf37) | EP13 — Preferências de notificações | T06 — Notificações e Engajamento |


## US32 — Gerenciar acesso de gestores

| Campo | Relação |
| :--- | :--- |
| Requisito de origem | [RF20](../documento-visao/8_requisitos.md#rf20) — Gerenciar papel de gestor |
| Tema | [T03](../planejamento/rastreabilidade.md#t03) — Voluntariado |
| Épico | EP12 — Gestão de acesso administrativo |
| Escopo | **Fora do MVP (Backlog Futuro / Pós-MVP)** |

**História de usuário**

> Como gestor administrador, quero cadastrar e conceder permissão de gestor a outros membros da equipe através de um painel visual, para delegar a administração das operações do sistema.

---

### Registro de Decisão Técnica e Provisionamento Inicial do Acesso de Gestor (MVP)

> **Decisão de Arquitetura e Escopo — Adiamento de RF20 / US32:**
> 
> Durante as reuniões de refinamento da Unidade 2, a equipe e os representantes do IBRADA deliberaram que a construção de uma interface gráfica complexa para cadastrar, editar e revogar acessos de gestores (RF20 / US32) **não é essencial para a viabilização da primeira versão (MVP)**, visto que o corpo diretor e administrativo da instituição é enxuto, conhecido e altamente estável.
> 
> Para viabilizar a operação e segurança dos módulos administrativos do MVP (US11, US12, US13, US18 e US20), o acesso inicial de gestores será disponibilizado da seguinte forma:
> 
> 1. **Mecanismo de disponibilização do acesso:**
>    * O provisionamento dos usuários gestores será realizado por meio de **scripts de carga inicial e migração (Database Seeding / Migrations)** executados no momento da implantação do banco de dados em ambiente de produção/homologação.
>    * As senhas de primeiro acesso serão geradas com entropia segura, criptografadas via hash **bcrypt** (RNF08) e disponibilizadas em canal privado individual aos coordenadores autorizados, com obrigatoriedade de troca de senha no primeiro login.
> 
> 2. **Quem poderá utilizar o acesso inicial de gestor:**
>    * **Guilherme Sampaio:** Representante Institucional e Coordenador Geral do IBRADA.
>    * **Outro gestor do IBRADA:** Representante Institucional escolhido por Guilherme Sampaio.
>    * **Administrador Técnico da Equipe:** Usuário de manutenção técnica com fins exclusivos de auditoria e suporte.
> 
> Com essa deliberação, todos os requisitos que dependem de gestores autenticados operam normalmente desde o primeiro incremento, mantendo a integridade de segurança (RNF04) e postergando a tela de gestão de usuários administrativos para ciclos futuros.

As histórias dentro do MVP e seus vínculos estão em [Rastreabilidade](../planejamento/rastreabilidade.md).
