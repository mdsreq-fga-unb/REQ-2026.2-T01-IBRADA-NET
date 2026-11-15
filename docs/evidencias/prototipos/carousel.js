function initIbradaCarousels() {
  if (typeof Swiper === "undefined") return;

  document.querySelectorAll(".ibrada-carousel").forEach((el) => {
    if (el.swiper) return;

    new Swiper(el, {
      loop: true,
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
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIbradaCarousels);
} else {
  initIbradaCarousels();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(initIbradaCarousels);
}