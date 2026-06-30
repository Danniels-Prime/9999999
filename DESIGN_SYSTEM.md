# Æthermind — Design System

## Aesthetic
**Cosmic / Deep Space** — dark, immersive, full of depth. Like looking at the night sky through a telescope: vast, mysterious, full of possibility. Not harsh, not cold.

Reference aesthetic: Obsidian dark theme × Linear UI quality × deep space photography.

---

## Color Tokens

Defined in `src/app/globals.css` under `@theme`. Tailwind v4 automatically generates utilities from `--color-*` variables.

| Token | Hex | Tailwind Utility | Usage |
|---|---|---|---|
| `void` | `#060612` | `bg-void` | Page background |
| `nebula` | `#0d0d2b` | `bg-nebula` | Card / panel background |
| `stardust` | `#1e1e3f` | `bg-stardust` | Hover states, borders |
| `aurora-start` | `#7c3aed` | `from-aurora-start` | Gradient violet end |
| `aurora-end` | `#06b6d4` | `to-aurora-end` | Gradient cyan end |
| `starlight` | `#e2e8f0` | `text-starlight` | Primary text |
| `comet` | `#94a3b8` | `text-comet` | Secondary / muted text |
| `supernova` | `#f59e0b` | `text-supernova` | Warning / highlight |
| `danger` | `#ef4444` | `text-danger` | Error states |

**Aurora gradient** (reused across CTAs and active indicators):
```css
background: linear-gradient(135deg, #7c3aed, #06b6d4);
```
In Tailwind: `bg-gradient-to-r from-aurora-start to-aurora-end`

---

## Typography
- **Font**: Geist Sans (loaded via `next/font/google` in `src/app/layout.tsx`)
- **Mono**: Geist Mono (code, labels, counters)
- **Scale**: Tailwind defaults — `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`

---

## Component Rules

### Button
Three variants in `src/components/ui/Button.tsx`:
- **primary**: Aurora gradient bg, white text, `rounded-xl`, scale 1.01 on hover
- **secondary**: `bg-stardust`, `text-starlight`, border `border-stardust`, aurora border on hover
- **ghost**: Transparent, `text-comet`, `text-starlight` + `bg-stardust` on hover

### Input
Defined in `src/components/ui/Input.tsx`:
- Background: `bg-nebula`, border: `border-stardust`
- Focus: `border-aurora-start` with aurora glow ring
- Error state: `border-danger` ring

### Card
Defined in `src/components/ui/Card.tsx`:
- Background: `bg-nebula`, border: `border-stardust`, `rounded-2xl`, `p-6`
- Elevated variant: adds `shadow-lg shadow-black/50`

---

## Animations (Framer Motion)

| Element | Animation |
|---|---|
| Page entrance | `opacity: 0→1, y: 20→0, duration: 0.4s` |
| Card hover | `scale: 1.01, duration: 0.2s` |
| Button press | `scale: 0.97` |
| Chat message entrance | `opacity: 0→1, x: -10→0, duration: 0.3s` |
| Card flip (flashcard) | `rotateY: 0→180, duration: 0.5s` |

All animated elements must be in `'use client'` components.

---

## Spacing
Standard Tailwind 4px base unit. Generous card padding: `p-6` minimum. Gap between form elements: `gap-4`. Section spacing: `mb-8`.

## Responsive
Mobile-first. Target breakpoints:
- `sm` (640px): Single column layouts
- `md` (768px): Two-column grids, sidebar appears
- `lg` (1024px): Three-column grids, full dashboard layout
