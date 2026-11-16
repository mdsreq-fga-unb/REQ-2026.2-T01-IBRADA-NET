# Rastreabilidade do produto

Esta página reúne, em um só lugar, como os itens do planejamento se relacionam para as histórias do **MVP**. Cada nível do backlog se liga a um nível dos objetivos e requisitos do produto, e as páginas das [User Stories](../user-stories/us01.md) apontam para os itens já existentes na documentação, sem repetir suas descrições.

Os níveis e suas relações (Tema → OE, Épico → CP, User Story → RF) estão descritos na seção [10.1.1 do Backlog](../documento-visao/10_backlog.md#1011-composicao-e-rastreabilidade-do-backlog).

!!! info "Escopo desta página"
    O mapa interativo e a visão consolidada apresentam apenas as 24 histórias dentro do MVP. As 12 histórias restantes estão listadas em [User Stories fora do MVP](../user-stories/fora-do-mvp.md), sem critérios de aceitação por enquanto. RF20 → US32 → EP12 → CP4 permanece fora do mapa interativo porque não integra o MVP; RF36 → US24 → EP02 → CP3 integra o MVP e aparece no mapa e na tabela.

## Mapa interativo

Navegue pelo caminho **Objetivo → Tema → Épico → User Story**. Clique em qualquer item para abrir os detalhes, inclusive características de produto, regras de negócio e requisitos não funcionais.

!!! note "Sobre os critérios de aceitação"
    Os critérios são acompanhados em tempo real nas issues do GitHub de cada história. Nesta documentação, os critérios são refinados antes da implementação e atualizados quando houver mudanças aceitas, conforme a DoR e a DoD; sua presença não comprova conclusão ou validação institucional da US. As marcações feitas no mapa ficam salvas apenas no navegador de quem as fez.

<div id="mapa-rastreabilidade" data-base="../../"></div>

<link rel="stylesheet" href="../mapa/mapa.css">

<script src="../mapa/dados.js"></script>

<script src="../mapa/mapa.js"></script>

## Visão consolidada

| OE | Tema | CP | Épico | User Stories → RF |
| --- | --- | --- | --- | --- |
| [OE1](../documento-visao/2_solucao.md#oe1) | <span id="t01"></span>**T01** — Atendimento e Triagem | [CP2](../documento-visao/2_solucao.md#cp2) | <span id="ep01"></span>**EP01** — Triagem e direcionamento | [US01](../user-stories/us01.md) → [RF05](../documento-visao/8_requisitos.md#rf05) |
| [OE2](../documento-visao/2_solucao.md#oe2) | <span id="t02"></span>**T02** — Ecoturismo e Reservas | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep02"></span>**EP02** — Descoberta de experiências e pacotes | [US02](../user-stories/us02.md) → [RF06](../documento-visao/8_requisitos.md#rf06)<br>[US03](../user-stories/us03.md) → [RF07](../documento-visao/8_requisitos.md#rf07)<br>[US24](../user-stories/us24.md) → [RF36](../documento-visao/8_requisitos.md#rf36) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep03"></span>**EP03** — Conta do cliente | [US04](../user-stories/us04.md) → [RF08](../documento-visao/8_requisitos.md#rf08)<br>[US05](../user-stories/us05.md) → [RF09](../documento-visao/8_requisitos.md#rf09)<br>[US06](../user-stories/us06.md) → [RF10](../documento-visao/8_requisitos.md#rf10)<br>[US07](../user-stories/us07.md) → [RF11](../documento-visao/8_requisitos.md#rf11)<br>[US23](../user-stories/us23.md) → [RF29](../documento-visao/8_requisitos.md#rf29) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep04"></span>**EP04** — Reserva e pagamento | [US08](../user-stories/us08.md) → [RF12](../documento-visao/8_requisitos.md#rf12)<br>[US09](../user-stories/us09.md) → [RF13](../documento-visao/8_requisitos.md#rf13)<br>[US10](../user-stories/us10.md) → [RF14](../documento-visao/8_requisitos.md#rf14) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep05"></span>**EP05** — Gestão de experiências e pacotes | [US11](../user-stories/us11.md) → [RF15](../documento-visao/8_requisitos.md#rf15)<br>[US12](../user-stories/us12.md) → [RF17](../documento-visao/8_requisitos.md#rf17) |
| [OE3](../documento-visao/2_solucao.md#oe3) | <span id="t03"></span>**T03** — Voluntariado | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep06"></span>**EP06** — Conta e perfil do voluntário | [US15](../user-stories/us15.md) → [RF23](../documento-visao/8_requisitos.md#rf23)<br>[US17](../user-stories/us17.md) → [RF26](../documento-visao/8_requisitos.md#rf26)<br>[US22](../user-stories/us22.md) → [RF27](../documento-visao/8_requisitos.md#rf27)<br>[US23](../user-stories/us23.md) → [RF29](../documento-visao/8_requisitos.md#rf29) |
| [OE3](../documento-visao/2_solucao.md#oe3) | T03 | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep07"></span>**EP07** — Descoberta e candidatura | [US14](../user-stories/us14.md) → [RF22](../documento-visao/8_requisitos.md#rf22)<br>[US16](../user-stories/us16.md) → [RF25](../documento-visao/8_requisitos.md#rf25)<br>[US21](../user-stories/us21.md) → [RF21](../documento-visao/8_requisitos.md#rf21) |
| [OE3](../documento-visao/2_solucao.md#oe3) | T03 | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep08"></span>**EP08** — Gestão de oportunidades e candidatos | [US13](../user-stories/us13.md) → [RF18](../documento-visao/8_requisitos.md#rf18)<br>[US18](../user-stories/us18.md) → [RF28](../documento-visao/8_requisitos.md#rf28) |
| [OE1](../documento-visao/2_solucao.md#oe1) | <span id="t04"></span>**T04** — Parcerias Institucionais | [CP6](../documento-visao/2_solucao.md#cp6) | <span id="ep09"></span>**EP09** — Solicitação e análise de parcerias | [US19](../user-stories/us19.md) → [RF33](../documento-visao/8_requisitos.md#rf33)<br>[US20](../user-stories/us20.md) → [RF34](../documento-visao/8_requisitos.md#rf34) |

A US23 aparece em dois épicos (EP03 e EP06) porque o consentimento vale para o cadastro de clientes e de voluntários.

## Regras de negócio e requisitos não funcionais

As regras de negócio e os requisitos não funcionais de cada épico já estão na tabela do [Backlog do Produto](../documento-visao/10_backlog.md), e sua relação com as características de produto está nos catálogos [8.2](../documento-visao/8_requisitos.md#82-lista-de-regras-de-negocio) e [8.3](../documento-visao/8_requisitos.md#83-lista-de-requisitos-nao-funcionais). As User Stories herdam os vínculos do seu épico, e o mapa acima mostra, ao clicar em uma RN ou RNF, quais histórias dependem dela.

## Referências fora do MVP

Os vínculos abaixo reproduzem o [backlog geral](../documento-visao/10_backlog.md) e a [lista de histórias fora do MVP](../user-stories/fora-do-mvp.md). Eles permitem consultar os itens posteriores sem incluí-los no mapa do MVP.

| Tema | Épico | CP de origem | Histórias → RF |
| --- | --- | --- | --- |
| <span id="t05"></span>T05 — Gestão e Transparência de Projetos | <span id="ep10"></span>EP10 — Gestão de projetos | [CP1](../documento-visao/2_solucao.md#cp1) | [US25](../user-stories/us25.md) → RF01; [US26](../user-stories/us26.md) → RF02; [US27](../user-stories/us27.md) → RF03 |
| T05 | <span id="ep11"></span>EP11 — Transparência e impacto dos projetos | [CP1](../documento-visao/2_solucao.md#cp1) | [US29](../user-stories/us29.md) → RF04 |
| T03 — Voluntariado | <span id="ep12"></span>EP12 — Gestão de acesso administrativo | [CP4](../documento-visao/2_solucao.md#cp4) | [US32](../user-stories/us32.md) → [RF20](../documento-visao/8_requisitos.md#rf20) |
| <span id="t06"></span>T06 — Notificações e Engajamento | <span id="ep13"></span>EP13 — Preferências de notificações | [CP5](../documento-visao/2_solucao.md#cp5) | [US34](../user-stories/us34.md) → RF30 |
| T06 | <span id="ep14"></span>EP14 — Gestão e monitoramento de notificações | [CP5](../documento-visao/2_solucao.md#cp5) | [US35](../user-stories/us35.md) → RF31; [US36](../user-stories/us36.md) → RF32 |
