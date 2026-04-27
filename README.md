# Mikunime V5 — Bio Link

Bio Link / Link-in-bio statis bertema **Dark Mode + Vibrant Red** dengan glassmorphism, terinspirasi dari gaya Mikunime V5.

## Fitur
- Dark mode deep black + aksen merah neon
- Glassmorphism + glow shadow
- Foto profil bulat dengan border gradasi merah berputar
- Featured button menonjol untuk `mikunime.eu.cc`
- Tombol link dengan hover (sedikit membesar + glow)
- Social icons FontAwesome (Instagram, Discord, Telegram, YouTube)
- HTML5 semantik + meta SEO + Open Graph
- Fully responsive (mobile-first)
- Google Fonts (Poppins)
- Animasi fade-in + stagger via JS, ripple click, dan tilt hover di featured

## Struktur
```
.
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── profile.jpg     # ganti dengan foto kamu
│   └── favicon.svg
└── README.md
```

## Cara pakai
1. Ganti `assets/profile.jpg` dengan foto profil kamu (rekomendasi 512x512 px, kotak).
2. Edit `index.html`:
   - Nama & handle (`Yan` / `@yanzz`)
   - Bio
   - Daftar link di `<nav class="links">`
   - URL social media
3. Buka `index.html` langsung di browser, atau jalankan static server:
   ```bash
   npx serve .
   # atau
   python3 -m http.server 8080
   ```

## Deploy
- **GitHub Pages**: aktifkan Pages dari branch `main` folder root, atau pakai workflow `Deploy to Pages` jika ingin custom.
- **Cloudflare Pages / Netlify / Vercel**: drop folder ini, build command kosong, output directory `.`.

## Lisensi
MIT
