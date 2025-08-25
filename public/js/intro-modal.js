(() => {
    const INTRO_KEY = "IntroModal_v1";

    function qs(id) { return document.getElementById(id); }

    function openModal() {
        const modal = qs("introModal");
        const okBtn = qs("introOk");
        if (!modal) return;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        (okBtn || modal).focus();
    }

    function closeModal(saveChoice = true) {
        const modal = qs("introModal");
        const dont = qs("dontShow");
        if (!modal) return;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        if (saveChoice && dont?.checked) {
            try { localStorage.setItem(INTRO_KEY, "1"); } catch { }
        }
    }

    function wireEvents() {
        const modal = qs("introModal");
        const okBtn = qs("introOk");
        const openBtn = qs("openIntro");
        const dont = qs("dontShow");

        // Mostrar solo si no se marcó "no volver a mostrar"
        try { if (!localStorage.getItem(INTRO_KEY)) openModal(); }
        catch { openModal(); }

        okBtn?.addEventListener("click", () => closeModal(true));
        openBtn?.addEventListener("click", () => { if (dont) dont.checked = false; openModal(); });

        // Cerrar con ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
                closeModal(false);
            }
        });

        // Click fuera de la tarjeta cierra
        modal?.addEventListener("click", (e) => {
            if (e.target === modal) closeModal(false);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireEvents);
    } else {
        wireEvents();
    }
})();