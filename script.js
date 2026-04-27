/* Mikunime V5 — Bio Link interactions (v3) */
(function () {
    "use strict";

    const onReady = (fn) => {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    };

    onReady(() => {
        const root = document.getElementById("biolink");

        /* Footer year */
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        /* Initial fade-in */
        if (root) {
            requestAnimationFrame(() => root.classList.add("is-visible"));
        }

        /* Stagger fade-up */
        const items = document.querySelectorAll(
            ".profile, .stats, .featured, .links, .socials-wrap, .share-btn, .footer"
        );
        items.forEach((el, i) => {
            el.classList.add("fade-up");
            setTimeout(() => el.classList.add("is-in"), 180 + i * 110);
        });

        /* Typewriter bio */
        const typedEl = document.getElementById("typed");
        if (typedEl) {
            const phrases = [
                "Streaming anime sub indo gratis.",
                "Update episode tiap minggu.",
                "Komunitas hangat & ramah newbie.",
                "Request anime? Tinggal chat admin."
            ];
            let pi = 0, ci = 0, deleting = false;
            const tick = () => {
                const cur = phrases[pi];
                if (!deleting) {
                    typedEl.textContent = cur.slice(0, ++ci);
                    if (ci === cur.length) { deleting = true; return setTimeout(tick, 1700); }
                } else {
                    typedEl.textContent = cur.slice(0, --ci);
                    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 350); }
                }
                setTimeout(tick, deleting ? 28 : 55);
            };
            tick();
        }

        /* Ripple click */
        const ripple = (e, el) => {
            const rect = el.getBoundingClientRect();
            const span = document.createElement("span");
            const size = Math.max(rect.width, rect.height);
            span.style.cssText = `
                position:absolute;
                left:${e.clientX - rect.left - size / 2}px;
                top:${e.clientY - rect.top - size / 2}px;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:rgba(255,255,255,0.18);
                pointer-events:none;
                transform:scale(0);
                opacity:0.6;
                transition:transform 600ms ease, opacity 700ms ease;
                z-index:0;
            `;
            if (getComputedStyle(el).position === "static") el.style.position = "relative";
            if (getComputedStyle(el).overflow !== "hidden") el.style.overflow = "hidden";
            el.appendChild(span);
            requestAnimationFrame(() => {
                span.style.transform = "scale(1)";
                span.style.opacity = "0";
            });
            setTimeout(() => span.remove(), 700);
        };
        document.querySelectorAll(".link-btn, .featured__btn, .social, .share-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => ripple(e, btn));
        });

        /* Tilt featured (desktop only) */
        const featured = document.querySelector(".featured__btn");
        if (featured && matchMedia("(hover: hover)").matches) {
            featured.addEventListener("mousemove", (e) => {
                const r = featured.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                featured.style.transform = `translateY(-2px) scale(1.01) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
            });
            featured.addEventListener("mouseleave", () => { featured.style.transform = ""; });
        }

        /* Subtle parallax on background blobs (desktop only) */
        if (matchMedia("(hover: hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const blobs = document.querySelectorAll(".blob");
            window.addEventListener("mousemove", (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                blobs.forEach((b, i) => {
                    const factor = (i + 1) * 0.5;
                    b.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
                });
            }, { passive: true });
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
                const text = "Cek bio link Mikunime V5 — semua link dalam satu halaman.";
                try {
                    if (navigator.share) {
                        await navigator.share({ title, text, url });
                    } else if (navigator.clipboard) {
                        await navigator.clipboard.writeText(url);
                        showToast("Link disalin ke clipboard");
                    } else {
                        showToast(url);
                    }
                } catch (_) {}
            });
        }

        /* Console click log */
        document.querySelectorAll("a[href]").forEach((a) => {
            a.addEventListener("click", () => {
                try { console.debug("[biolink] click \u2192", a.href); } catch (_) {}
            });
        });

        /* Konami easter egg */
        const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
        let idx = 0;
        document.addEventListener("keydown", (e) => {
            if (e.key === seq[idx]) {
                idx++;
                if (idx === seq.length) {
                    document.documentElement.style.setProperty("--red-glow", "0 0 40px rgba(255,35,72,0.85), 0 0 100px rgba(255,35,72,0.45)");
                    showToast("\u2726 Mode glow maksimal aktif");
                    idx = 0;
                }
            } else { idx = 0; }
        });
    });
})();
