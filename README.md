# Antibes Flat — Guest Guide

A small website I built for friends staying at our place in Antibes. I took the opportunity to explore dot-based designs inspired by [Linear](https://linear.app/next). The main visual is a reproduction of a carpet by [Tarta Gelatina](https://tartagelatina.com/products/chubby-checker-round-rug) that we have at home — it's pretty distinctive, so it felt like a natural centerpiece for the design.

## Dot System

Everything visual is built from dense dot grids rendered on `<canvas>` (or SVG for the static one). The dots share a common toolkit: `devicePixelRatio`-aware rendering, `requestAnimationFrame` loops, `Path2D` batching, and a spring-damper physics model for cursor repulsion. Colors are yellow `#F5C842` and pink `#E8457A` on cream `#f0ede6`.

Five components, each a different take on the same idea:

- **WavePattern** — The carpet reproduction. Dots fill sinusoidal wave stripes inside a circular frame with two concentric rings (yellow inner, pink outer). Two modes: continuous rightward drift with wobble, or scroll-driven dispersal where dots fly outward.
- **WavePatternAnimated** — Full-bleed living wave pattern. Wave height and amplitude oscillate on independent sine cycles with a continuous vertical phase scroll, so the pattern never repeats exactly.
- **CubeDotPattern** — Isometric 3D cube (yellow) with an open pink-rimmed box sitting on top, all made of dots. Each face is shaded with different color tones. 3D projection classifies which dot belongs to which face.
- **DotFadeBox** — Background dot field with wind physics. Dots get random nudges biased leftward, stronger at the left edge. Fades radially from an elliptical center. Wraps content via `children`.
- **DotCluster** — Static SVG pill-shaped dot field for section titles. Yellow dissolves into pink left-to-right, with noise-based edge breakup.

All interactive components respond to the cursor — dots push away and spring back.

## Data & Privacy

The repo is public but personal data is kept out of the codebase:

- **Pictures** are stored in Blob, not in the repo.
- **Address, phone numbers, and map coordinates** are environment variables (`NEXT_PUBLIC_*` in `.env.local`, mirrored on Vercel).
- **The deployment is password-protected** (`SITE_PASSWORD` env var) so that personal information is only visible to guests who have the password.
