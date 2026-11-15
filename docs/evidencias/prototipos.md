## Protótipos

Explicação.

=== "CP3"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp3-1.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 1 — Catálogo de Pacotes de Ecoturismo</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp3-2.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 2 — Página do Pacote Selecionado</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp3-3.png" alt="Protótipo de baixa fidelidade CP3">
          <p class="slide-caption">Tela 3 — Reserva e Pagamento do Pacote Selecionado</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "CP4"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp4-1.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 1 — Catálogo de Oportunidades</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp4-2.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 2 — Página da Oportunidade Selecionada</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp4-3.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 3 — Criação de Perfil do Voluntário</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp4-4.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 4 — Tela de Gestão: Oportunidades</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp4-5.png" alt="Protótipo de baixa fidelidade CP4">
          <p class="slide-caption">Tela 5 — Tela de Gestão: Candidatos</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

=== "CP6"

    <div class="swiper ibrada-carousel">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp6-1.png" alt="Protótipo de baixa fidelidade CP6">
          <p class="slide-caption">Tela 1 — Formulário para Parcerias</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp6-2.png" alt="Protótipo de baixa fidelidade CP6">
          <p class="slide-caption">Tela 2 — Tela de Gestão: Parcerias Recebidas</p>
        </div>
        <div class="swiper-slide">
          <img src="../../assets/prototipos/baixa/cp6-3.png" alt="Protótipo de baixa fidelidade CP6">
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
          <img src="../../assets/prototipos/baixa/fluxo e paleta.png" alt="Fluxos e Paleta do Produto">
          <p class="slide-caption">Tela 1 — Fluxos e Paleta do Produto</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

## Diagramas

### Banco de Dados

<div class="hero-image">
  <img src="../../assets/diagramas/banco.png" alt="Diagrama BD" class="img-destaque" />
</div>

> `PedidoParceria` aparece sem linhas de relação de propósito: quem envia a solicitação é visitante, sem conta (US19).
> `Candidatura` tem restrição única em (`perfilId`, `oportunidadeId`): ninguém se candidata duas vezes à mesma vaga.
> A relação muitos-para-muitos com `Categoria` e `PerfilVoluntario` usa a tabela de junção explícitas `InteresseVoluntario`, com chave composta. Assim o vínculo pode ganhar campos no futuro.