## Protótipos Iniciais

As primeiras representações visuais do produto foram desenvolvidas durante o ciclo do Incremento 1 e serviram de base para a estrutura visual e os fluxos do produto. As imagens a seguir foram exibidas ao cliente com o objetivo de validar os fluxos de operações; no entanto, devido à dificuldade de entendimento desses protótipos de baixa fidelidade, as validações foram realizadas com os protótipos de média fidelidade exibidos no [mapa de rastreabilidade](../planejamento/rastreabilidade.md#mapa-interativo), onde a estrutura visual do site e os fluxos de atividades são mais evidentes.

=== "EP05"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp3-1.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 1 — Catálogo de Pacotes de Ecoturismo</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp3-2.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 2 — Página do Pacote Selecionado</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp3-3.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 3 — Reserva e Pagamento do Pacote Selecionado</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "EP07"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp4-1.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 1 — Catálogo de Oportunidades</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp4-2.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 2 — Página da Oportunidade Selecionada</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp4-3.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 3 — Criação de Perfil do Voluntário</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "EP08"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp4-4.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 1 — Tela de Gestão: Oportunidades</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp4-5.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 2 — Tela de Gestão: Candidatos</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "EP09"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp6-1.png" alt="Protótipo de baixa fidelidade CP6">
          <p class="slide-caption">Tela 1 — Formulário para Parcerias</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp6-2.png" alt="Protótipo de baixa fidelidade CP6">
          <p class="slide-caption">Tela 2 — Tela de Gestão: Parcerias Recebidas</p>
        </div>
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/cp6-3.png" alt="Protótipo de baixa fidelidade CP6">
          <p class="slide-caption">Tela 3 — Confirmação do Formulário</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "Outros"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../../assets/prototipos/baixa/fluxo e paleta.png" alt="Fluxos e Paleta do Produto">
          <p class="slide-caption">Tela 1 — Fluxos e Paleta do Produto</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

## Banco de Dados

O diagrama entidade-relacionamento abaixo representa a implementação atual do banco de dados, bem como as relações entre suas tabelas.

<div class="hero-image">
  <img src="../../../assets/diagramas/banco.png" alt="Diagrama BD" class="img-destaque" />
</div>

#### Resumo por tema

| Tema | Tabelas | User stories |
| --- | --- | --- |
| Conta e LGPD | `User`, `ConsentRecord` | US04–US07, US17, US22, US23 |
| Ecoturismo e reservas | `Experiencia`, `Booking`, `Payment` | US02, US03, US08–US12 |
| Voluntariado | `Projeto`, `Oportunidade`, `Candidatura`, `PerfilVoluntario`, `Categoria`, `InteresseVoluntario` | US13–US18, US21 |
| Parcerias | `PedidoParceria` | US19, US20 |

> `PedidoParceria` aparece sem linhas de relação de propósito: quem envia a solicitação é visitante, sem conta (US19).
> `Candidatura` tem restrição única em (`perfilId`, `oportunidadeId`): ninguém se candidata duas vezes à mesma vaga.
> A relação muitos-para-muitos com `Categoria` e `PerfilVoluntario` usa a tabela de junção explícita `InteresseVoluntario`, com chave composta. Assim o vínculo pode ganhar campos no futuro.