function createZoomModal() {
  if (document.getElementById("ibrada-zoom-modal")) return;

  const modal = document.createElement("div");
  modal.id = "ibrada-zoom-modal";
  modal.className = "ibrada-zoom-modal";
  modal.innerHTML = `
    <div class="ibrada-zoom-toolbar">
      <button type="button" data-zoom="out" title="Reduzir (-)">−</button>
      <span class="ibrada-zoom-level">100%</span>
      <button type="button" data-zoom="in" title="Ampliar (+)">+</button>
      <button type="button" data-zoom="reset" title="Tamanho original">100%</button>
      <button type="button" data-zoom="close" title="Fechar (Esc)">✕</button>
    </div>
    <div class="ibrada-zoom-stage">
      <img src="" alt="Visualização ampliada">
    </div>
    <p class="ibrada-zoom-caption"></p>
  `;
  document.body.appendChild(modal);

  const img = modal.querySelector("img");
  const caption = modal.querySelector(".ibrada-zoom-caption");
  const levelLabel = modal.querySelector(".ibrada-zoom-level");

  let scale = 1;
  let posX = 0;
  let posY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    levelLabel.textContent = `${Math.round(scale * 100)}%`;
    img.style.cursor = scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in";
  }

  function setScale(newScale) {
    scale = Math.min(Math.max(newScale, 0.5), 4);
    if (scale <= 1) {
      posX = 0;
      posY = 0;
    }
    applyTransform();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  modal.querySelector(".ibrada-zoom-toolbar").addEventListener("click", (e) => {
    const action = e.target.closest("button")?.dataset.zoom;
    if (!action) return;
    if (action === "in") setScale(scale + 0.5);
    if (action === "out") setScale(scale - 0.5);
    if (action === "reset") {
      posX = 0;
      posY = 0;
      setScale(1);
    }
    if (action === "close") closeModal();
  });

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isDragging) return;
    if (scale === 1) {
      setScale(2);
    } else {
      posX = 0;
      posY = 0;
      setScale(1);
    }
  });

  modal.querySelector(".ibrada-zoom-stage").addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      setScale(scale + (e.deltaY < 0 ? 0.25 : -0.25));
    },
    { passive: false }
  );

  img.addEventListener("mousedown", (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    applyTransform();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    setTimeout(() => {
      isDragging = false;
      applyTransform();
    }, 0);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("ibrada-zoom-stage")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "+" || e.key === "=") setScale(scale + 0.5);
    if (e.key === "-") setScale(scale - 0.5);
  });

  window.openIbradaZoom = function (src, alt, captionText) {
    img.src = src;
    img.alt = alt || "Imagem ampliada";
    caption.textContent = captionText || "";
    posX = 0;
    posY = 0;
    setScale(1);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
}

function attachZoomButton(carouselEl) {
  if (carouselEl.querySelector(".ibrada-zoom-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ibrada-zoom-btn";
  btn.title = "Ampliar imagem";
  btn.setAttribute("aria-label", "Ampliar imagem");
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
    <span>Zoom</span>
  `;

  btn.addEventListener("click", () => {
    const activeSlide =
      carouselEl.querySelector(".swiper-slide-active") ||
      carouselEl.querySelector(".swiper-slide");
    const img = activeSlide?.querySelector("img");
    const caption = activeSlide?.querySelector(".slide-caption");
    if (img && typeof window.openIbradaZoom === "function") {
      window.openIbradaZoom(img.src, img.alt, caption?.textContent);
    }
  });

  carouselEl.appendChild(btn);
}

function initIbradaCarousels() {
  if (typeof Swiper === "undefined") return;
  createZoomModal();

  document.querySelectorAll(".ibrada-carousel").forEach((el) => {
    const slideCount = el.querySelectorAll(".swiper-slide").length;

    if (!el.swiper) {
      new Swiper(el, {
        loop: slideCount > 1,
        watchOverflow: true,
        spaceBetween: 20,
        observer: true,
        observeParents: true,
        pagination: {
          el: el.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: el.querySelector(".swiper-button-next"),
          prevEl: el.querySelector(".swiper-button-prev"),
        },
      });
    } else {
      el.swiper.update();
    }

    attachZoomButton(el);
  });
}

// Atualiza o layout do Swiper logo após o Material alternar a aba clicada
document.addEventListener("click", (e) => {
  if (e.target.closest(".tabbed-labels label")) {
    requestAnimationFrame(() => {
      document.querySelectorAll(".ibrada-carousel").forEach((el) => {
        if (el.swiper) el.swiper.update();
      });
    });
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIbradaCarousels);
} else {
  initIbradaCarousels();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(initIbradaCarousels);
}