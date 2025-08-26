// public/js/trailer-modal.js
(() => {
  const qs  = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const modal   = qs("#videoModal");
  const frame   = qs("#videoFrame");
  const titleEl = qs("#videoTitle");
  const closeBt = qs("#videoClose");

  // Transforma URL de YouTube a URL de embebido
  function toEmbed(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      }
      if (host === "youtube.com" || host === "m.youtube.com") {
        if (u.pathname.startsWith("/shorts/")) {
          const id = u.pathname.split("/")[2];
          return `https://www.youtube.com/embed/${id}`;
        }
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // fallback: devuelve original
      return url;
    } catch {
      return url;
    }
  }

  function openModal({ title, url }) {
    if (!modal) return;
    titleEl.textContent = title || "Tráiler";
    const embed = toEmbed(url) + "?autoplay=1&rel=0&modestbranding=1";
    frame.src = embed;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeBt?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    // Detener reproducción
    frame.src = "";
  }

  // Eventos de cierre
  closeBt?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") closeModal();
  });

  // Delegación: click en cualquier figure con data-trailer
  qsa(".gallery .grid figure[data-trailer]").forEach(fig => {
    fig.addEventListener("click", () => {
      openModal({ title: fig.dataset.title || fig.querySelector("figcaption")?.textContent?.trim(), url: fig.dataset.trailer });
    });
  });

  // Export opcional para reusar desde otros scripts
  window.openTrailer = openModal;
  window.closeTrailer = closeModal;
})();