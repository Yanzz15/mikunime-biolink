/* Mikunime V5 — Bio Link interactions */
(function () {
    "use strict";

    const onReady = (fn) => {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    };

    onReady(() => {
        const root = document.getElementById("biolink");

        // Footer year
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        // Initial fade-in
        if (root) {
            requestAnimationFrame(() => {
                root.classList.add("is-visible");
            });
        }

        // Stagger fade-up for sections
        const items = document.querySelectorAll(
            ".profile, .featured, .links, .socials, .footer"
        );
        items.forEach((el, i) => {
            el.classList.add("fade-up");
            setTimeout(() => el.classList.add("is-in"), 180 + i * 110);
        });

        // Subtle ripple on click for link buttons
        const ripple = (e, el) => {
            const rect = el.getBoundingClientRect();
            const span = document.createElement("span");
            const size = Math.max(rect.width, rect.height);
            span.style.cssText = `
                position:absolute;
                left:${e.clientX - rect.left - size / 2}px;
                top:${e.clientY - rect.top - size / 2}px;
                width:${size}px;
                height:${size}px;
                border-radius:50%;
                background:rgba(255,255,255,0.18);
                pointer-events:none;
                transform:scale(0);
                opacity:0.6;
                transition:transform 600ms ease, opacity 700ms ease;
                z-index:0;
            `;
            const prevPos = getComputedStyle(el).position;
            if (prevPos === "static") el.style.position = "relative";
            const prevOverflow = getComputedStyle(el).overflow;
            if (prevOverflow !== "hidden") el.style.overflow = "hidden";
            el.appendChild(span);
            requestAnimationFrame(() => {
                span.style.transform = "scale(1)";
                span.style.opacity = "0";
            });
            setTimeout(() => span.remove(), 700);
        };

        document.querySelectorAll(".link-btn, .featured__btn, .social").forEach((btn) => {
            btn.addEventListener("click", (e) => ripple(e, btn));
        });

        // Tilt hover for featured (desktop only)
        const featured = document.querySelector(".featured__btn");
        if (featured && matchMedia("(hover: hover)").matches) {
            featured.addEventListener("mousemove", (e) => {
                const r = featured.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                featured.style.transform = `translateY(-2px) scale(1.01) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
            });
            featured.addEventListener("mouseleave", () => {
                featured.style.transform = "";
            });
        }
    });
})();
