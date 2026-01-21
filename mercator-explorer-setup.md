# Mercator Explorer - Repository Setup

## Quick Start for AI Agent

When starting the project, run these commands to initialize the repository:

```bash
# Clone the repo (user will have created this)
git clone https://github.com/GitGeniusX/mercator-explorer.git
cd mercator-explorer

# Initialize the project
npm create vite@latest . -- --template react-ts
npm install

# Install dependencies
npm install leaflet react-leaflet @turf/turf zustand
npm install -D @types/leaflet tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom

# Initialize Tailwind
npx tailwindcss init -p

# Create folder structure
mkdir -p src/{components/{Map,CountryOverlay,InfoPanel,Controls,Onboarding},hooks,stores,utils,data,types}
mkdir -p .github/workflows

# Create communication files
touch PROJECT_STATUS.md DECISIONS.md CHANGELOG.md TODO.md
```

---

## Template Files

### PROJECT_STATUS.md (Initial)

```markdown
# Project Status

## Current Phase: Phase 0 - Project Setup
## Last Updated: [DATE]
## Overall Progress: 0/8 tasks complete

### Completed This Session
- [ ] None yet - project just started

### In Progress
- [ ] 0.1 Initialize Vite + React + TypeScript project

### Blockers
- None

### Next Actions
1. Complete project initialization
2. Install all dependencies
3. Configure Tailwind CSS
4. Set up folder structure

### Notes
- Project specification available in project-spec.md
- Following phased development approach
- All major decisions documented in DECISIONS.md
```

### DECISIONS.md (Initial)

```markdown
# Architecture Decision Records

## [DATE] Initial Technology Stack

**Context:** Need to select technologies for an interactive map-based educational application demonstrating Mercator projection distortion.

**Options Considered:**

1. **Mapbox GL JS + React**
   - Pros: Professional maps, excellent performance, vector tiles
   - Cons: Requires API key, costs at scale, more complex setup

2. **Leaflet + React-Leaflet**
   - Pros: Free, well-documented, large community, sufficient for needs
   - Cons: Raster-based, slightly less performant

3. **OpenLayers**
   - Pros: Full-featured, enterprise-grade
   - Cons: Steeper learning curve, heavier bundle

4. **D3.js only**
   - Pros: Maximum flexibility, excellent for custom visualizations
   - Cons: More code to write, no built-in map features

**Decision:** Leaflet + React-Leaflet with Turf.js for geo processing

**Rationale:**
- Free and open source aligns with educational project goals
- Well-documented with many examples
- React-Leaflet provides clean component model
- Turf.js is industry standard for geo calculations
- Bundle size is reasonable
- Sufficient performance for this use case

**Consequences:**
- May need custom code for drag-and-drop (Leaflet doesn't natively support dragging GeoJSON)
- Limited to raster tiles (acceptable for MVP)
- Good migration path to Mapbox if needed later

---

## [DATE] State Management Choice

**Context:** Need state management for country selection, placed countries, and UI state.

**Options Considered:**

1. **Redux Toolkit**
   - Pros: Industry standard, excellent DevTools, middleware ecosystem
   - Cons: More boilerplate, overkill for this app size

2. **Zustand**
   - Pros: Minimal boilerplate, simple API, good TypeScript support
   - Cons: Smaller ecosystem, less middleware

3. **React Context + useReducer**
   - Pros: Built-in, no dependencies
   - Cons: Performance concerns with frequent updates, more manual code

4. **Jotai/Recoil**
   - Pros: Atomic model, good for derived state
   - Cons: Different mental model, smaller community

**Decision:** Zustand

**Rationale:**
- Simple API reduces development time
- Good TypeScript integration
- Sufficient for app complexity
- Easy to understand for future maintainers
- Small bundle impact

**Consequences:**
- Will need to structure store thoughtfully as app grows
- Middleware for persistence available if needed
```

### CHANGELOG.md (Initial)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial project setup

### Changed
- N/A

### Fixed
- N/A

### Removed
- N/A

---

## Session Log

### Session 1 - [DATE]
**Duration:** ~X hours  
**Phase:** 0 - Project Setup

**Completed:**
- (to be filled in)

**Notes:**
- (to be filled in)

**Next Session Should:**
- (to be filled in)
```

### TODO.md (Initial)

```markdown
# TODO - Current Phase Tasks

## Phase 0: Project Setup (Current)

### High Priority
- [ ] Initialize Vite + React + TypeScript
- [ ] Install dependencies
- [ ] Configure Tailwind CSS
- [ ] Set up folder structure

### Medium Priority
- [ ] Configure Vitest
- [ ] Create type definitions skeleton
- [ ] Set up CI workflow

### Low Priority
- [ ] Add ESLint/Prettier (optional)

---

## Backlog (Future Phases)

### Phase 1: Core Map
- [ ] Download GeoJSON data
- [ ] Implement map component
- [ ] Add country layer with interaction

### Phase 2: Projection Math
- [ ] Mercator scale calculations
- [ ] Polygon transformation functions

### Phase 3: Drag & Drop
- [ ] Draggable country component
- [ ] Real-time resize during drag

(See project-spec.md for full task list)

---

## Known Issues
- None yet

## Technical Debt
- None yet
```

---

## GitHub Workflow Template

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint
        continue-on-error: true

      - name: Run tests
        run: npm run test -- --run

      - name: Build
        run: npm run build
```

---

## Package.json Scripts Addition

Add these scripts to package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx"
  }
}
```

---

## Vitest Config Template

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom'
```

---

## Tailwind Config Template

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'map-water': '#a3d5ff',
        'map-land': '#f0f0f0',
        'map-highlight': '#ffd700',
        'map-ghost': '#cccccc',
      }
    },
  },
  plugins: [],
}
```

---

## AI Agent Instructions Summary

### Starting a Session

1. **Read context:**
   ```bash
   cat PROJECT_STATUS.md
   cat TODO.md
   git log --oneline -5
   ```

2. **Verify working state:**
   ```bash
   npm install
   npm run test -- --run
   npm run build
   ```

3. **Check for issues:**
   - Review GitHub issues for current phase
   - Check for any failing tests
   - Note any blockers mentioned in status

### During Development

1. **Make atomic commits:**
   ```bash
   git add .
   git commit -m "[PHASE-X] type: description"
   ```

2. **Run tests frequently:**
   ```bash
   npm run test -- --run
   ```

3. **Document decisions:**
   - Any non-obvious choice goes in DECISIONS.md
   - Include context and rationale

### Ending a Session

1. **Update status files:**
   - PROJECT_STATUS.md - current state
   - CHANGELOG.md - what was done
   - TODO.md - what's next

2. **Commit updates:**
   ```bash
   git add .
   git commit -m "[PHASE-X] docs: update status and changelog"
   git push
   ```

3. **Leave clear handoff notes:**
   - What was the last thing worked on?
   - What's the immediate next step?
   - Any gotchas or context needed?

### Handling Blockers

If blocked, document in PROJECT_STATUS.md:

```markdown
### Blockers
- **Issue:** Leaflet drag events not firing on GeoJSON layer
  **Attempted:** 
  - Using `draggable: true` option (not supported)
  - Custom mouse event handlers (partial success)
  **Potential Solutions:**
  - Create SVG overlay instead of GeoJSON layer
  - Use Leaflet.Draw library for inspiration
  - Implement custom drag using mouse events on container
  **Need:** Decision on which approach to pursue
```
