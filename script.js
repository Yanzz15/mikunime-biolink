/* Yanzz · Bio Link interactions */
(function () {
    "use strict";

    const onReady = (fn) => {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    };

    onReady(() => {
        const root = document.getElementById("biolink");

        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        if (root) {
            requestAnimationFrame(() => root.classList.add("is-visible"));
        }

        const items = document.querySelectorAll(
            ".brand-bar, .hero, .featured, .links, .socials-wrap, .share-btn, .footer"
        );
        items.forEach((el, i) => {
            el.classList.add("fade-up");
            setTimeout(() => el.classList.add("is-in"), 140 + i * 90);
        });

        /* Typewriter — runs inside fixed-height pill, no layout shift */
        const typedEl = document.getElementById("typed");
        if (typedEl) {
            const phrases = [
                "Sub indo, update tiap minggu.",
                "Komunitas anime yang ramah.",
                "Request? Tinggal chat admin.",
                "Selamat menonton."
            ];
            let pi = 0, ci = phrases[0].length, deleting = true;
            typedEl.textContent = phrases[0];
            const tick = () => {
                const cur = phrases[pi];
                if (!deleting) {
                    typedEl.textContent = cur.slice(0, ++ci);
                    if (ci === cur.length) { deleting = true; return setTimeout(tick, 1800); }
                } else {
                    typedEl.textContent = cur.slice(0, --ci);
                    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 280); }
                }
                setTimeout(tick, deleting ? 32 : 56);
            };
            setTimeout(tick, 1400);
        }

        /* Toast */
        const toastEl = document.getElementById("toast");
        const showToast = (msg) => {
            if (!toastEl) return;
            toastEl.textContent = msg;
            toastEl.classList.add("is-show");
            clearTimeout(showToast._t);
            showToast._t = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
        };

        /* Share */
        const shareBtn = document.getElementById("shareBtn");
        if (shareBtn) {
            shareBtn.addEventListener("click", async () => {
                const url = location.href;
                const title = document.title;
                const text = "Bio link Yanzz — MikuNime V5.";
                try {
                    if (navigator.share) {
                        await navigator.share({ title, text, url });
                    } else if (navigator.clipboard) {
                        await navigator.clipboard.writeText(url);
                        showToast("Link disalin");
                    } else {
                        showToast(url);
                    }
                } catch (_) {}
            });
        }
    });
})();
