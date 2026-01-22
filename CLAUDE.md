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

### Progress Tracking with GitHub Issues
**IMPORTANT:** Use GitHub Issues as the primary tracking mechanism for:
- Bugs discovered during development
- Feature requests and enhancements
- Known issues that need future attention
- UX improvements identified during testing

**When to create issues:**
- When you find a bug but it's not blocking current work
- When you identify improvements outside the current phase scope
- When user feedback suggests changes
- Before ending a session, review work and create issues for anything not addressed

**Issue workflow:**
```bash
gh issue list                    # Check open issues at session start
gh issue view <number>           # Read issue details before working on it
gh issue create --title "..." --body "..." --label "bug"
gh issue close <number> --comment "Fixed in [describe fix]"  # When resolved
```

**Issue lifecycle:**
1. **Create** - When bug/improvement identified but not immediately addressed
2. **Review** - At session start, check `gh issue list` for open items
3. **Work** - Reference issue number in commits when fixing
4. **Close** - When resolved, close with comment explaining the fix

### Status Tracking Files
Maintain these files in repo root:
- `PROJECT_STATUS.md` - Current phase, completed tasks, blockers
- `DECISIONS.md` - Architecture decisions with rationale
- `CHANGELOG.md` - Session-by-session changes
- `TODO.md` - Prioritized task list

### Documentation Requirements
**Document functionality as you build it:**
1. **Component documentation** - Add JSDoc comments for public interfaces
2. **Utility functions** - Document parameters, return values, and edge cases
3. **Architecture updates** - Update this CLAUDE.md when adding new patterns
4. **API/Data structures** - Document in types/index.ts with comments

**Example:**
```typescript
/**
 * Transforms a country's geometry to a new position, adjusting for Mercator distortion.
 * @param geometry - Original GeoJSON geometry
 * @param fromCentroid - Original [lng, lat] centroid
 * @param toCentroid - Target [lng, lat] position
 * @returns Transformed geometry at new position with correct size
 */
export function transformCountryToPosition(...) { }
```

### Commit Messages
```
[PHASE-X] type: description

Types: feat, fix, refactor, test, docs, config
Example: [PHASE-1] feat: implement country selection highlight
```

### Session Protocol

**Starting a session:**
1. Read `PROJECT_STATUS.md` to understand current state
2. Run `npm test -- --run` to verify everything works
3. Run `gh issue list` to check open issues
4. Review TODO.md for prioritized tasks

**During the session:**
- **Commit frequently** - Make local commits after each logical unit of work:
  - After completing a component or feature
  - After fixing a bug
  - After adding tests
  - Before starting a risky refactor (safety checkpoint)
  - Rule of thumb: If you'd be upset losing the work, commit it
- Create GitHub issues for bugs/improvements found but not immediately addressed
- Close GitHub issues when resolved: `gh issue close <number> --comment "Fixed in [commit]"`
- Update documentation as you build features
- Keep CHANGELOG.md updated with significant changes

**Commit frequency guidelines:**
```bash
# Small, focused commits are better than large ones
git add -A && git commit -m "[PHASE-X] feat: add Tutorial component"
git add -A && git commit -m "[PHASE-X] feat: add URL state parsing"
git add -A && git commit -m "[PHASE-X] style: add CSS animations"

# Push when: phase complete, end of session, or before risky changes
git push
```

**Before commit and push - Learning Summary:**
1. **Review what was built** - List new files, modified files, new patterns
2. **Document learnings** - Add any new insights to the Learnings section below
3. **Update architecture docs** - If component structure changed, update this file
4. **Create issues** - For anything discovered but not addressed
5. **Verify tests pass** - `npm run test:run && npm run typecheck`

**Ending a session:**
1. Update `PROJECT_STATUS.md` with completed work
2. Update `TODO.md` with completed/new tasks
3. Update `CHANGELOG.md` with session summary
4. Close resolved GitHub issues with comments explaining the fix
5. Create new GitHub issues for any outstanding items discovered
6. Commit with proper message format
7. Push changes
8. Leave clear handoff notes in PROJECT_STATUS.md

### Phase Completion
**IMPORTANT:** When a phase is finished:
1. Verify all acceptance criteria are met
2. Run full test suite
3. Update all status files
4. Create issues for any deferred items
5. Commit AND push all changes before starting the next phase

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

### JSON Imports with TypeScript
- Complex GeoJSON with strict typing requires double cast: `as unknown as FeatureCollection<...>`
- TypeScript infers very specific types from JSON (e.g., `number[]` not `BBox`) causing type mismatches

### Natural Earth 110m Data
- Contains 177 countries (not all territories/micro-states)
- Smallest country: Luxembourg (~2,400 km²) - no Vatican, Monaco, San Marino
- Properties available: `NAME`, `ADMIN`, `ADM0_A3` (ISO code), `CONTINENT`
- File size: ~820KB - contributes to 1.2MB bundle warning
- Consider lazy loading or code splitting for production

### Turf.js Usage
- `turf.area(feature)` returns square meters - divide by 1,000,000 for km²
- `turf.centroid(feature)` returns a Point Feature, access coords via `.geometry.coordinates`
- Import as `import * as turf from '@turf/turf'` for tree-shaking

### React-Leaflet Patterns
- Must import Leaflet CSS: `import 'leaflet/dist/leaflet.css'` in Map component
- GeoJSON component needs unique `key` prop to force re-render on style changes
- Use `key={\`countries-${hoveredId}-${selectedId}\`}` pattern for hover/select updates
- `worldCopyJump={true}` improves UX when panning across date line

### Leaflet Styling
- Use CartoDB tiles for clean look: `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png`
- z-index for overlays on Leaflet: use `z-[1000]` or higher in Tailwind

### Mercator Projection Transformation (CRITICAL)
The Mercator projection handles X and Y axes **differently**:

**Longitude (X-axis):**
- Linear: `x = R × longitude`
- Same pixel width per degree at ALL latitudes
- Does NOT auto-adjust when moving countries

**Latitude (Y-axis):**
- Nonlinear: `y = R × ln(tan(π/4 + lat/2))`
- Stretched more at high latitudes
- Auto-adjusts visual height when coordinates are translated

**When transforming a country from lat₁ to lat₂:**
- ❌ Scale BOTH dimensions by `cos(lat₁)/cos(lat₂)` → Double compensation, country too small
- ❌ Scale NEITHER dimension (translate only) → Width still exaggerated, shape distorted
- ✅ Scale ONLY LONGITUDE by `cos(lat₁)/cos(lat₂)` → Correct size AND shape preserved

**Why longitude-only scaling works:**
1. Mercator Y-formula automatically reduces height when translating to lower latitude
2. Longitude scaling removes the E-W exaggeration that Mercator X doesn't handle
3. Both dimensions end up scaled by the same factor → shape preserved
4. Area becomes 1/(scale²) of original → true relative size

**Example - Greenland (72°N) to equator (0°):**
- Longitude scale: `cos(72°)/cos(0°) ≈ 0.31`
- Height also ~0.31x (from Mercator Y-formula)
- Area: ~0.31² ≈ 0.096 = 1/10.4 (matches distortion factor at 72°N)

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
