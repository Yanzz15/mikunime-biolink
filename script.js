/* Yanzz · Bio Link interactions */
(function () {
    "use strict";

    const onReady = (fn) => {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    };

    const $ = (id) => document.getElementById(id);

    onReady(() => {
        const root = $("biolink");

        const yearEl = $("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        if (root) {
            requestAnimationFrame(() => root.classList.add("is-visible"));
        }

        const items = document.querySelectorAll(
            ".brand-bar, .hero, .stats, .featured, .links, .socials-wrap, .player, .share-btn, .footer"
        );
        items.forEach((el, i) => {
            el.classList.add("fade-up");
            setTimeout(() => el.classList.add("is-in"), 140 + i * 80);
        });

        /* ---------- Toast ---------- */
        const toastEl = $("toast");
        const showToast = (msg) => {
            if (!toastEl) return;
            toastEl.textContent = msg;
            toastEl.classList.add("is-show");
            clearTimeout(showToast._t);
            showToast._t = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
        };

        /* ---------- Typewriter ---------- */
        const typedEl = $("typed");
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

        /* ---------- URL chip (tap to copy) ---------- */
        const urlChip = $("urlChip");
        const urlText = $("urlText");
        if (urlChip && urlText) {
            const path = (location.pathname || "/").replace(/\/index(\.html)?$/, "/").replace(/\/+$/, "") || "/";
            const display = (location.host + path).replace(/^www\./, "");
            urlText.textContent = display.length > 28 ? display.slice(0, 26) + "…" : display;
            urlChip.title = location.href;
            urlChip.addEventListener("click", async () => {
                try {
                    if (navigator.clipboard) await navigator.clipboard.writeText(location.href);
                    urlChip.classList.add("is-copied");
                    showToast("Link disalin");
                    setTimeout(() => urlChip.classList.remove("is-copied"), 1400);
                } catch (_) {
                    showToast(location.href);
                }
            });
        }

        /* ---------- Live clock (WIB) ---------- */
        const clockEl = $("clock");
        const dateEl = $("dateline");
        if (clockEl && dateEl) {
            const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const pad = (n) => String(n).padStart(2, "0");
            const tickClock = () => {
                const wib = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
                clockEl.textContent = `${pad(wib.getHours())}:${pad(wib.getMinutes())}:${pad(wib.getSeconds())}`;
                dateEl.textContent = `${days[wib.getDay()]} ${pad(wib.getDate())} ${months[wib.getMonth()]} · WIB`;
            };
            tickClock();
            setInterval(tickClock, 1000);
        }

        /* ---------- Visitor geo (real IP geolocation) ---------- */
        const geoCity = $("geoCity");
        const geoMeta = $("geoMeta");
        if (geoCity && geoMeta) {
            const trim = (s, n) => (s || "").length > n ? (s || "").slice(0, n - 1) + "…" : (s || "");
            const tryFetch = async (url, mapper) => {
                const r = await fetch(url, { cache: "no-store" });
                if (!r.ok) throw new Error(r.status);
                return mapper(await r.json());
            };
            (async () => {
                const sources = [
                    () => tryFetch("https://ipapi.co/json/", (d) => ({
                        city: d.city, cc: d.country_code, region: d.region,
                        org: (d.org || d.asn || "").replace(/^AS\d+\s*/, "")
                    })),
                    () => tryFetch("https://ipwho.is/", (d) => d && d.success !== false ? ({
                        city: d.city, cc: d.country_code, region: d.region,
                        org: (d.connection && d.connection.isp) || ""
                    }) : Promise.reject("ipwho fail")),
                    () => tryFetch("https://get.geojs.io/v1/ip/geo.json", (d) => {
                        const g = Array.isArray(d) ? d[0] : d;
                        return { city: g.city, cc: g.country_code, region: g.region, org: g.organization || "" };
                    })
                ];
                for (const fn of sources) {
                    try {
                        const g = await fn();
                        if (g && g.city) {
                            geoCity.textContent = `${g.city}, ${g.cc || "—"}`;
                            geoMeta.textContent = trim(g.org || g.region || "—", 28);
                            return;
                        }
                    } catch (_) {}
                }
                geoCity.textContent = "Unknown";
                geoMeta.textContent = "—";
            })();
        }

        /* ---------- Edge region (best-effort from response headers) ---------- */
        const edgeName = $("edgeName");
        const edgeRegion = $("edgeRegion");
        if (edgeName && edgeRegion) {
            (async () => {
                try {
                    const r = await fetch(location.pathname + "?_e=" + Date.now(), { method: "HEAD", cache: "no-store" });
                    const vid = r.headers.get("x-vercel-id") || "";
                    const cf = r.headers.get("cf-ray") || "";
                    const server = r.headers.get("server") || "";
                    if (vid) {
                        edgeName.textContent = "Vercel";
                        const region = (vid.split("::")[0] || "").toUpperCase();
                        edgeRegion.textContent = region || "edge";
                    } else if (cf) {
                        edgeName.textContent = "Cloudflare";
                        edgeRegion.textContent = (cf.split("-")[1] || "edge").toUpperCase();
                    } else if (/github/i.test(server)) {
                        edgeName.textContent = "GH Pages";
                        edgeRegion.textContent = "Fastly";
                    } else if (location.host.includes("devinapps.com")) {
                        edgeName.textContent = "Devin";
                        edgeRegion.textContent = "preview";
                    } else if (location.host.includes("vercel.app")) {
                        edgeName.textContent = "Vercel";
                        edgeRegion.textContent = "edge";
                    } else {
                        edgeName.textContent = "Static";
                        edgeRegion.textContent = server ? server.split("/")[0].toLowerCase() : "—";
                    }
                } catch (_) {
                    edgeName.textContent = "Static";
                    edgeRegion.textContent = "—";
                }
            })();
        }

        /* ---------- Share ---------- */
        const shareBtn = $("shareBtn");
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

        /* ---------- Music player (search via Piped, embed via YouTube) ---------- */
        const playerForm = $("playerForm");
        const playerInput = $("playerInput");
        const playerBtn = playerForm ? playerForm.querySelector(".player__form-btn") : null;
        const playerHint = $("playerHint");
        const playerDisplay = $("playerDisplay");
        const playerEmpty = $("playerEmpty");
        const ytFrame = $("ytplayer");
        const presetButtons = document.querySelectorAll(".player__presets button");

        const setHint = (msg, isError = false) => {
            if (!playerHint) return;
            playerHint.textContent = msg;
            playerHint.classList.toggle("is-error", isError);
        };

        const extractId = (raw) => {
            const s = (raw || "").trim();
            if (!s) return null;
            const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
            if (m) return m[1];
            if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
            return null;
        };

        const playVideo = (id, title) => {
            if (!ytFrame || !playerDisplay || !playerEmpty) return;
            const params = new URLSearchParams({
                autoplay: "1",
                modestbranding: "1",
                rel: "0",
                playsinline: "1",
                color: "white"
            });
            ytFrame.src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
            playerDisplay.hidden = false;
            playerEmpty.hidden = true;
            setHint(title ? `▶ ${title}` : "▶ Now playing");
        };

        // Public Piped API instances. Try in order; fall back gracefully.
        const pipedInstances = [
            "https://pipedapi.kavin.rocks",
            "https://pipedapi.adminforge.de",
            "https://pipedapi.r4fo.com",
            "https://pipedapi.privacydev.net"
        ];

        const searchYouTube = async (query) => {
            const direct = extractId(query);
            if (direct) return { id: direct, title: "Direct link" };
            for (const base of pipedInstances) {
                try {
                    const ctl = new AbortController();
                    const t = setTimeout(() => ctl.abort(), 4500);
                    const r = await fetch(`${base}/search?q=${encodeURIComponent(query)}&filter=videos`, {
                        signal: ctl.signal,
                        cache: "no-store"
                    });
                    clearTimeout(t);
                    if (!r.ok) continue;
                    const d = await r.json();
                    const list = (d && d.items) || [];
                    const item = list.find((i) => i && (i.url || i.videoId));
                    if (!item) continue;
                    let id = item.videoId;
                    if (!id && item.url) {
                        const m = item.url.match(/v=([A-Za-z0-9_-]{11})/) ||
                                  item.url.match(/\/watch\?v=([A-Za-z0-9_-]{11})/) ||
                                  item.url.match(/^\/?([A-Za-z0-9_-]{11})$/);
                        id = m && m[1];
                    }
                    if (id) return { id, title: item.title || query };
                } catch (_) { /* try next instance */ }
            }
            return null;
        };

        const submitQuery = async (raw) => {
            const q = (raw || "").trim();
            if (!q) return;
            if (playerBtn) playerBtn.classList.add("is-loading");
            const prevIcon = playerBtn ? playerBtn.innerHTML : "";
            if (playerBtn) playerBtn.innerHTML = '<i class="fa-solid fa-spinner"></i>';
            setHint("Mencari…");
            try {
                const direct = extractId(q);
                if (direct) {
                    playVideo(direct, "Direct link");
                    return;
                }
                const result = await searchYouTube(q);
                if (result) {
                    playVideo(result.id, result.title);
                } else {
                    setHint("Ga ketemu. Coba paste URL YouTube langsung.", true);
                }
            } catch (_) {
                setHint("Error. Coba paste URL YouTube langsung.", true);
            } finally {
                if (playerBtn) {
                    playerBtn.classList.remove("is-loading");
                    playerBtn.innerHTML = prevIcon || '<i class="fa-solid fa-play"></i>';
                }
            }
        };

        if (playerForm && playerInput) {
            playerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                submitQuery(playerInput.value);
            });
        }
        presetButtons.forEach((b) => {
            b.addEventListener("click", () => {
                const q = b.dataset.q;
                if (!q) return;
                if (playerInput) playerInput.value = q;
                submitQuery(q);
            });
        });
    });
})();
