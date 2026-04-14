# Duelighedsbevis – Teoriprøve Forberedelse

A web app for preparing the Danish recreational sailing certificate (duelighedsbevis) theoretical exam.

## What's inside

The app covers all 7 exam topics with study material, interactive quizzes, and visual identification exercises:

- **Navigation** — compass correction (CDMVT), chart plotting, cross bearings, speed/distance/time, current triangles. Includes interactive calculators for compass corrections and SDT problems.
- **COLREGS (Rules of the Road)** — right of way, sound signals, vessel lights and shapes. Visual exercises where you identify vessels from their navigation light configurations.
- **Buoyage & Marks (IALA Region A)** — cardinal marks, lateral marks, isolated danger, safe water, and special marks. Visual exercises where you identify marks from SVG renderings.
- **Safety at Sea** — Mayday/PAN PAN/SECURITÉ procedures, MOB recovery, EPIRB, SART, hypothermia, DSC.
- **Meteorology** — Beaufort scale, frontal systems, sea/land breezes, barometric pressure.
- **Fire Safety** — fire triangle, extinguisher types, engine room fires, gas safety.
- **Watchkeeping & Environment** — MARPOL, pollution reporting, lookout duties, navigation lights display.

Features per-topic mastery tracking, a 25-question full mock exam mode, and topic-specific quizzes with 12 questions each.

## Tech stack

Single-file React app (`duelighedsbevis-prep.jsx`, ~2500 lines) built with Vite and served via nginx in a Docker container.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Railway

The repo includes a `Dockerfile` and `railway.toml`. To deploy:

1. Connect this repo to a new Railway project
2. Railway auto-detects the Dockerfile and builds it
3. The app is served on port 8080 (Railway maps this to your public URL)

Alternatively, using the Railway CLI:

```bash
railway init
railway up
```

## Building for production

```bash
npm run build
```

Output goes to `dist/` — a static site you can host anywhere (Netlify, Vercel, Cloudflare Pages, etc.).

## Licence

This project was built as a study aid for personal and classmate use.
