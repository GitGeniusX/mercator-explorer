# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mercator Explorer is an interactive educational web application demonstrating Mercator projection distortion. Users can drag countries to different latitudes to see their true relative sizes (e.g., Greenland appears massive near the pole but is actually similar in size to Algeria at the equator).

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 7 (requires Node.js 20.19+)
- **Mapping:** Leaflet 1.9.4 + React-Leaflet 5.0
- **Geo Processing:** Turf.js 7 (`@turf/turf` package)
- **Styling:** Tailwind CSS 4 (CSS-first config, no `tailwind.config.js`)
- **State:** Zustand 5
- **Testing:** Vitest + React Testing Library

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (tsc && vite build)
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once
npm run typecheck  # TypeScript check without emit
npm run lint       # ESLint
```

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Map/              # Leaflet map, country layer rendering
│   ├── CountryOverlay/   # Draggable country with live resize
│   ├── InfoPanel/        # Stats, comparisons, educational content
│   ├── Controls/         # Reset, undo, toggle buttons
│   └── Onboarding/       # First-time user tutorial
├── stores/appStore.ts    # Zustand state (countries, selection, placed)
├── utils/
│   ├── dataLoader.ts     # GeoJSON loading, centroid/area calculation
│   └── projection.ts     # Mercator math (scale factor, transformations)
├── data/countries.json   # Natural Earth 110m GeoJSON
└── types/index.ts        # Country, PlacedCountry, AppState interfaces
```

### Key Algorithms
- **Mercator scale:** `1/cos(latitude)` - equator=1, 60°=2, 80°≈5.76
- **Size adjustment:** Ratio of scale factors when moving between latitudes
- **Polygon transform:** Scale around centroid, then translate to new position

### Data Flow
1. Load GeoJSON → extract countries with calculated areas/centroids
2. User clicks country → "lift" animation, add to selection
3. User drags → calculate new latitude → transform polygon in real-time
4. User releases → add to `placedCountries`, show ghost at original position

## Development Conventions

### Status Tracking Files
Maintain these files in repo root:
- `PROJECT_STATUS.md` - Current phase, completed tasks, blockers
- `DECISIONS.md` - Architecture decisions with rationale
- `CHANGELOG.md` - Session-by-session changes
- `TODO.md` - Prioritized task list

### Commit Messages
```
[PHASE-X] type: description

Types: feat, fix, refactor, test, docs, config
Example: [PHASE-1] feat: implement country selection highlight
```

### Session Protocol
**Starting:** Read `PROJECT_STATUS.md` → Run `npm test -- --run` → Check GitHub issues
**Ending:** Update status files → Commit → Leave clear handoff notes

## Known Challenges

1. **Leaflet drag on GeoJSON:** No native support - implement custom mouse events
2. **Performance during drag:** Simplify polygons with Turf.js `simplify()`, restore on drop
3. **Date line wrapping:** Countries near 180° longitude need clamping/wrapping logic
4. **Antarctica:** Exclude from interactive features or cap at 85° latitude

## Learnings

### TypeScript Configuration
- `erasableSyntaxOnly` and `noUncheckedSideEffectImports` are not available in TS 5.7 - don't use these options
- Keep tsconfig.json conservative with well-established options

### Vite Project Init
- `npm create vite@latest .` in non-empty directory requires interactive confirmation - fails in automation
- Solution: Manually create `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, and `src/` files

### macOS Shell
- No `timeout` command available by default
- Use pattern: `command & sleep N; kill $!` for timed process testing

## Tailwind v4 Setup

Uses `@tailwindcss/vite` plugin (not PostCSS). Configuration is CSS-first:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-map-water: oklch(0.75 0.1 220);
  --color-map-land: oklch(0.95 0.01 90);
  --color-map-highlight: oklch(0.85 0.2 85);
  --color-map-ghost: oklch(0.8 0.02 0);
}
```

## Testing

- Unit tests for projection math with <0.01% error margin
- Integration tests for user flows (click → drag → place → reset)
- Test files: `*.test.ts` or `*.spec.ts` in `src/`

## Project Phases

0. Project Setup (tooling, CI)
1. Core Map & Data (display, hover, click)
2. Projection Math (scale calculations)
3. Drag & Drop (real-time resize)
4. Info Display (educational panels)
5. Polish & UX (animations, onboarding)
6. Testing & Docs (80%+ coverage)
7. Deployment (Vercel/Netlify)

See `mercator-explorer-spec.md` for detailed task breakdowns and acceptance criteria.
