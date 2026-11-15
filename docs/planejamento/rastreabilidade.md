# Rastreabilidade do Produto

Esta página reúne, em um só lugar, como os itens do planejamento se relacionam para as histórias do **MVP**. Cada nível do backlog se liga a um nível dos objetivos e requisitos do produto, e as páginas das [User Stories](../user-stories/us01.md) apontam para os itens já existentes na documentação, sem repetir suas descrições.

Os níveis e suas relações (Tema → OE, Épico → CP, User Story → RF) estão descritos na seção [10.1.1 do Backlog](../documento-visao/10_backlog.md#1011-composicao-e-rastreabilidade-do-backlog).

!!! info "Escopo desta página"
    Aparecem apenas as 24 histórias dentro do MVP. As 12 histórias restantes estão listadas em [User Stories fora do MVP](../user-stories/fora-do-mvp.md), sem critérios de aceitação por enquanto.

## Mapa Interativo

Navegue pelo caminho **Objetivo → Tema → Épico → User Story**. Clique em qualquer item para abrir os detalhes, inclusive características de produto, regras de negócio e requisitos não funcionais.

!!! note "Sobre os critérios de aceitação"
    Os critérios são sincronizados automaticamente a partir das issues vinculadas no GitHub de cada história.

<div id="mapa-rastreabilidade" data-base="../../"></div>

<link rel="stylesheet" href="../mapa/mapa.css">

<script src="../mapa/dados.js"></script>

<script src="../mapa/mapa.js"></script>


## Visão consolidada

| OE | Tema | CP | Épico | User Stories → RF |
| --- | --- | --- | --- | --- |
| [OE1](../documento-visao/2_solucao.md#oe1) | <span id="t01"></span>**T01** — Atendimento e Triagem | [CP2](../documento-visao/2_solucao.md#cp2) | <span id="ep01"></span>**EP01** — Triagem e direcionamento | US01 → [RF05](../documento-visao/8_requisitos.md#rf05) |
| [OE2](../documento-visao/2_solucao.md#oe2) | <span id="t02"></span>**T02** — Ecoturismo e Reservas | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep02"></span>**EP02** — Descoberta de experiências e pacotes | US02 → [RF06](../documento-visao/8_requisitos.md#rf06)<br>US03 → [RF07](../documento-visao/8_requisitos.md#rf07)<br>US24 → [RF36](../documento-visao/8_requisitos.md#rf36) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep03"></span>**EP03** — Conta do cliente | US04 → [RF08](../documento-visao/8_requisitos.md#rf08)<br>US05 → [RF09](../documento-visao/8_requisitos.md#rf09)<br>US06 → [RF10](../documento-visao/8_requisitos.md#rf10)<br>US07 → [RF11](../documento-visao/8_requisitos.md#rf11)<br>US23 → [RF29](../documento-visao/8_requisitos.md#rf29) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep04"></span>**EP04** — Reserva e pagamento | US08 → [RF12](../documento-visao/8_requisitos.md#rf12)<br>US09 → [RF13](../documento-visao/8_requisitos.md#rf13)<br>US10 → [RF14](../documento-visao/8_requisitos.md#rf14) |
| [OE2](../documento-visao/2_solucao.md#oe2) | T02 | [CP3](../documento-visao/2_solucao.md#cp3) | <span id="ep05"></span>**EP05** — Gestão de experiências e pacotes | US11 → [RF15](../documento-visao/8_requisitos.md#rf15)<br>US12 → [RF17](../documento-visao/8_requisitos.md#rf17) |
| [OE3](../documento-visao/2_solucao.md#oe3) | <span id="t03"></span>**T03** — Voluntariado | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep06"></span>**EP06** — Conta e perfil do voluntário | US15 → [RF23](../documento-visao/8_requisitos.md#rf23)<br>US17 → [RF26](../documento-visao/8_requisitos.md#rf26)<br>US22 → [RF27](../documento-visao/8_requisitos.md#rf27) |
| [OE3](../documento-visao/2_solucao.md#oe3) | T03 | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep07"></span>**EP07** — Descoberta e candidatura | US14 → [RF22](../documento-visao/8_requisitos.md#rf22)<br>US16 → [RF25](../documento-visao/8_requisitos.md#rf25)<br>US21 → [RF21](../documento-visao/8_requisitos.md#rf21) |
| [OE3](../documento-visao/2_solucao.md#oe3) | T03 | [CP4](../documento-visao/2_solucao.md#cp4) | <span id="ep08"></span>**EP08** — Gestão de oportunidades e candidatos | US13 → [RF18](../documento-visao/8_requisitos.md#rf18)<br>US18 → [RF28](../documento-visao/8_requisitos.md#rf28) |
| [OE1](../documento-visao/2_solucao.md#oe1) | <span id="t04"></span>**T04** — Parcerias Institucionais | [CP6](../documento-visao/2_solucao.md#cp6) | <span id="ep09"></span>**EP09** — Solicitação e análise de parcerias | US19 → [RF33](../documento-visao/8_requisitos.md#rf33)<br>US20 → [RF34](../documento-visao/8_requisitos.md#rf34) |

## Regras de Negócio e Requisitos Não Funcionais

As regras de negócio e os requisitos não funcionais de cada épico já estão na tabela do [Backlog do Produto](../documento-visao/10_backlog.md), e sua relação com as características de produto está nos catálogos [8.2](../documento-visao/8_requisitos.md#82-lista-de-regras-de-negocio) e [8.3](../documento-visao/8_requisitos.md#83-lista-de-requisitos-nao-funcionais). As User Stories herdam os vínculos do seu épico, e o mapa acima mostra, ao clicar em uma RN ou RNF, quais histórias dependem dela.
