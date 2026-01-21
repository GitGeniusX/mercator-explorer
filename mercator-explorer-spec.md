# Mercator Explorer - Project Specification

## Project Overview

**Name:** Mercator Explorer  
**Purpose:** Interactive web application demonstrating Mercator projection distortion by allowing users to drag countries to different latitudes and see their true relative sizes.

**Target Users:** Students, educators, geography enthusiasts

**Demo Inspiration:** Shows how Greenland appears massive near the pole but is actually similar in size to Algeria when placed at the equator.

---

## Technical Stack (Fixed Decisions)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | React 18+ with TypeScript | Type safety, component model |
| Build Tool | Vite | Fast dev server, simple config |
| Mapping | Leaflet + React-Leaflet | Free, well-documented, sufficient for MVP |
| Geo Processing | Turf.js | Industry standard for geo calculations |
| Styling | Tailwind CSS | Rapid UI development |
| State Management | Zustand | Simple, minimal boilerplate |
| Testing | Vitest + React Testing Library | Vite-native, fast |
| Geo Data | Natural Earth (GeoJSON) | Free, accurate, multiple resolutions |

---

## Communication Protocol

### File-Based Status Tracking

The AI agent shall maintain these files in the repo root:

```
/PROJECT_STATUS.md    - Current phase, completed tasks, blockers
/DECISIONS.md         - Architectural decisions with rationale
/CHANGELOG.md         - What changed in each work session
/TODO.md              - Prioritized task list for current phase
```

### PROJECT_STATUS.md Format

```markdown
# Project Status

## Current Phase: [Phase Name]
## Last Updated: [ISO Date]
## Overall Progress: [X/Y tasks complete]

### Completed This Session
- [x] Task description

### In Progress
- [ ] Task description - [notes on status]

### Blockers
- [Description of blocker and potential solutions]

### Next Actions
1. First priority task
2. Second priority task
```

### Commit Message Convention

```
[PHASE-X] type: description

Types: feat, fix, refactor, test, docs, config
Example: [PHASE-1] feat: implement country selection highlight
```

### GitHub Issues

Create one issue per phase with checklist:
- Issue title: `Phase X: [Phase Name]`
- Body: Checklist of all tasks for that phase
- Labels: `phase-1`, `in-progress`, `blocked`, `complete`

### Decision Documentation

When making architectural choices, document in DECISIONS.md:

```markdown
## [Date] Decision Title

**Context:** Why this decision was needed
**Options Considered:** 
1. Option A - pros/cons
2. Option B - pros/cons

**Decision:** Chosen option
**Rationale:** Why this option
**Consequences:** What this means for the project
```

---

## Project Phases

### Phase 0: Project Setup
**Goal:** Repository structure, tooling, CI pipeline  
**Duration Estimate:** 1 session  
**Quality Gate:** `npm run dev` serves empty app, `npm run test` passes

#### Tasks

- [ ] **0.1** Initialize Vite + React + TypeScript project
  ```bash
  npm create vite@latest mercator-explorer -- --template react-ts
  ```

- [ ] **0.2** Install core dependencies
  ```bash
  npm install leaflet react-leaflet @turf/turf zustand
  npm install -D @types/leaflet tailwindcss postcss autoprefixer vitest @testing-library/react jsdom
  ```

- [ ] **0.3** Configure Tailwind CSS
  - Create `tailwind.config.js`
  - Add Tailwind directives to `index.css`

- [ ] **0.4** Configure Vitest
  - Create `vitest.config.ts`
  - Add test script to `package.json`
  - Create sample test to verify setup

- [ ] **0.5** Create folder structure
  ```
  src/
    components/
      Map/
      CountryOverlay/
      InfoPanel/
      Controls/
    hooks/
    stores/
    utils/
    data/
    types/
  ```

- [ ] **0.6** Create placeholder files
  - `src/types/index.ts` - Type definitions
  - `src/stores/appStore.ts` - Zustand store skeleton
  - `src/utils/projection.ts` - Projection math utilities skeleton

- [ ] **0.7** Setup status tracking files
  - Create `PROJECT_STATUS.md`
  - Create `DECISIONS.md`
  - Create `CHANGELOG.md`
  - Create `TODO.md`

- [ ] **0.8** Create GitHub Actions workflow for CI
  - `.github/workflows/ci.yml`
  - Run lint, typecheck, and tests on PR

#### Acceptance Criteria
- [ ] `npm run dev` starts development server
- [ ] `npm run build` creates production build without errors
- [ ] `npm run test` runs and passes
- [ ] TypeScript compilation succeeds with strict mode
- [ ] All status files present and formatted correctly

---

### Phase 1: Core Map & Data
**Goal:** Display world map with interactive country boundaries  
**Duration Estimate:** 2 sessions  
**Quality Gate:** Map renders, countries highlight on hover

#### Tasks

- [ ] **1.1** Download and process GeoJSON data
  - Source: Natural Earth 110m cultural vectors
  - URL: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
  - Save to `src/data/countries.json`
  - Verify file loads correctly

- [ ] **1.2** Define TypeScript types
  ```typescript
  // src/types/index.ts
  interface Country {
    id: string;
    name: string;
    geometry: GeoJSON.Geometry;
    properties: {
      area_km2: number;
      centroid: [number, number]; // [lng, lat]
      continent: string;
    };
  }

  interface AppState {
    countries: Country[];
    selectedCountry: Country | null;
    placedCountries: PlacedCountry[];
    isLoading: boolean;
  }

  interface PlacedCountry {
    original: Country;
    currentPosition: [number, number]; // [lng, lat]
    scaleFactor: number;
  }
  ```

- [ ] **1.3** Create data loading utility
  ```typescript
  // src/utils/dataLoader.ts
  // - Load GeoJSON
  // - Extract country properties
  // - Calculate centroids using Turf.js
  // - Calculate areas using Turf.js
  ```

- [ ] **1.4** Implement base Map component
  ```typescript
  // src/components/Map/Map.tsx
  // - Full viewport Leaflet map
  // - Equirectangular or standard Mercator projection
  // - Disable scroll zoom initially (can enable later)
  // - Set reasonable initial bounds (world view)
  ```

- [ ] **1.5** Implement CountryLayer component
  ```typescript
  // src/components/Map/CountryLayer.tsx
  // - Render all countries as GeoJSON layer
  // - Style: light fill, darker border
  // - Hover effect: highlight fill color
  // - Click handler: select country
  ```

- [ ] **1.6** Implement Zustand store
  ```typescript
  // src/stores/appStore.ts
  // Actions:
  // - loadCountries()
  // - selectCountry(id: string)
  // - clearSelection()
  // - placeCountry(countryId: string, position: [number, number])
  // - removePlacedCountry(index: number)
  // - reset()
  ```

- [ ] **1.7** Wire up App component
  - Load countries on mount
  - Show loading state
  - Render Map with CountryLayer
  - Handle country selection

- [ ] **1.8** Write tests for data loading
  - Test GeoJSON parsing
  - Test centroid calculation
  - Test area calculation

#### Acceptance Criteria
- [ ] World map displays with all country boundaries
- [ ] Countries highlight on mouse hover
- [ ] Clicking a country logs its name to console
- [ ] Country data includes calculated area and centroid
- [ ] All tests pass

---

### Phase 2: Projection Mathematics
**Goal:** Implement accurate Mercator distortion calculations  
**Duration Estimate:** 1 session  
**Quality Gate:** Unit tests verify calculation accuracy

#### Tasks

- [ ] **2.1** Implement Mercator scale factor function
  ```typescript
  // src/utils/projection.ts
  
  /**
   * Calculate Mercator scale factor at a given latitude
   * Scale = 1/cos(φ) where φ is latitude in radians
   * At equator (0°): scale = 1
   * At 60°: scale = 2
   * At 80°: scale ≈ 5.76
   */
  export function getMercatorScale(latitudeDegrees: number): number
  ```

- [ ] **2.2** Implement size adjustment function
  ```typescript
  /**
   * Calculate how a country's apparent size changes
   * when moved from one latitude to another
   * 
   * Returns multiplier for visual scaling
   * Moving from 70° to 0° returns ~0.34 (appears 66% smaller)
   */
  export function calculateSizeAdjustment(
    fromLatitude: number,
    toLatitude: number
  ): number
  ```

- [ ] **2.3** Implement polygon transformation function
  ```typescript
  /**
   * Transform a GeoJSON polygon to appear at a new location
   * with correct size adjustment for Mercator projection
   * 
   * Steps:
   * 1. Calculate centroid of original polygon
   * 2. Calculate size adjustment factor
   * 3. Scale polygon around centroid
   * 4. Translate to new position
   */
  export function transformCountryToPosition(
    geometry: GeoJSON.Geometry,
    originalCentroid: [number, number],
    newPosition: [number, number]
  ): GeoJSON.Geometry
  ```

- [ ] **2.4** Implement area comparison utilities
  ```typescript
  /**
   * Get human-readable area comparison
   * "Greenland appears 14x larger than its true size at this latitude"
   */
  export function getAreaComparison(
    trueAreaKm2: number,
    apparentScale: number
  ): string
  
  /**
   * Find countries of similar actual size
   * For Greenland (2.166M km²): ["Saudi Arabia", "Mexico", "Indonesia"]
   */
  export function findSimilarSizedCountries(
    areaKm2: number,
    allCountries: Country[],
    tolerance: number = 0.2
  ): Country[]
  ```

- [ ] **2.5** Write comprehensive unit tests
  ```typescript
  // src/utils/projection.test.ts
  
  // Test cases for getMercatorScale:
  // - Equator (0°) → 1.0
  // - 45° → ~1.414
  // - 60° → 2.0
  // - 80° → ~5.76
  // - Negative latitudes (southern hemisphere)
  
  // Test cases for calculateSizeAdjustment:
  // - Same latitude → 1.0
  // - 70° to 0° → ~0.34
  // - 0° to 70° → ~2.92
  
  // Test cases for polygon transformation:
  // - Centroid moves to correct position
  // - Polygon scales correctly
  ```

#### Acceptance Criteria
- [ ] All projection math functions implemented
- [ ] Unit tests cover edge cases (poles, equator, negative latitudes)
- [ ] Tests pass with < 0.01% error margin
- [ ] Functions handle invalid inputs gracefully

---

### Phase 3: Drag & Drop Interaction
**Goal:** Users can drag countries and see them resize in real-time  
**Duration Estimate:** 2 sessions  
**Quality Gate:** Smooth drag experience with live size updates

#### Tasks

- [ ] **3.1** Create DraggableCountry component
  ```typescript
  // src/components/CountryOverlay/DraggableCountry.tsx
  
  // Props:
  // - country: Country
  // - position: [number, number]
  // - onDrag: (newPosition) => void
  // - onDragEnd: (finalPosition) => void
  
  // Implementation:
  // - Render as Leaflet Polygon
  // - Use Leaflet's drag events or custom implementation
  // - Update geometry on drag using projection utils
  ```

- [ ] **3.2** Implement drag state management
  ```typescript
  // Add to appStore:
  // - dragState: { isDragging: boolean, countryId: string | null, currentPos: [number, number] | null }
  // - startDrag(countryId: string)
  // - updateDragPosition(pos: [number, number])
  // - endDrag()
  ```

- [ ] **3.3** Create "lift" animation on selection
  ```typescript
  // When country is selected:
  // 1. Create copy of country geometry
  // 2. Slightly enlarge (1.05x) to show it's "lifted"
  // 3. Add drop shadow effect (CSS or SVG filter)
  // 4. Change z-index to appear above other countries
  ```

- [ ] **3.4** Implement real-time resize during drag
  ```typescript
  // On drag move:
  // 1. Get current cursor latitude
  // 2. Calculate size adjustment from original latitude
  // 3. Transform polygon geometry
  // 4. Update display (throttle to 60fps)
  ```

- [ ] **3.5** Handle drag end - place country
  ```typescript
  // On drag end:
  // 1. Add to placedCountries array in store
  // 2. Keep displaying at final position
  // 3. Original country remains in place (ghosted?)
  // 4. Show comparison info
  ```

- [ ] **3.6** Implement "ghost" display for original position
  ```typescript
  // When country is placed elsewhere:
  // - Show original position with reduced opacity (0.3)
  // - Dashed border
  // - Helps user see the comparison
  ```

- [ ] **3.7** Add touch support for mobile
  ```typescript
  // Handle touch events:
  // - touchstart → select
  // - touchmove → drag
  // - touchend → place
  // - Prevent scroll while dragging
  ```

- [ ] **3.8** Performance optimization
  ```typescript
  // - Simplify geometry during drag (Douglas-Peucker)
  // - Use requestAnimationFrame for updates
  // - Throttle position updates
  // - Restore full detail on drag end
  ```

#### Acceptance Criteria
- [ ] Clicking a country "lifts" it visually
- [ ] Dragging is smooth (60fps)
- [ ] Country resizes in real-time based on latitude
- [ ] Releasing places the country at new position
- [ ] Original position shows ghost outline
- [ ] Works on touch devices
- [ ] No performance issues with multiple placed countries

---

### Phase 4: Information Display
**Goal:** Show educational information about size comparisons  
**Duration Estimate:** 1 session  
**Quality Gate:** Clear, informative UI panels

#### Tasks

- [ ] **4.1** Create InfoPanel component
  ```typescript
  // src/components/InfoPanel/InfoPanel.tsx
  
  // Displays when country is selected or placed:
  // - Country name and flag (optional)
  // - True area in km²
  // - Current apparent area (based on displayed latitude)
  // - Distortion factor ("appears 3.2x larger than reality")
  // - Similar-sized countries at equator
  ```

- [ ] **4.2** Create ComparisonCard component
  ```typescript
  // src/components/InfoPanel/ComparisonCard.tsx
  
  // Shows side-by-side comparison:
  // - [Country A] at [Latitude X]: appears [Y] km²
  // - Actually equals: [Country B, C, D] combined
  // - Visual bar chart of relative sizes
  ```

- [ ] **4.3** Create LatitudeIndicator component
  ```typescript
  // src/components/Map/LatitudeIndicator.tsx
  
  // Shows during drag:
  // - Current latitude line highlighted
  // - Distortion factor at current latitude
  // - "Move toward equator to see true size"
  ```

- [ ] **4.4** Create StatsOverlay component
  ```typescript
  // src/components/InfoPanel/StatsOverlay.tsx
  
  // Fixed position overlay showing:
  // - Number of countries placed
  // - Total "revealed" area savings
  // - Fun facts about Mercator distortion
  ```

- [ ] **4.5** Add preset comparisons
  ```typescript
  // src/data/presets.ts
  
  // Pre-defined interesting comparisons:
  // - Greenland vs Africa
  // - Alaska vs Brazil  
  // - Russia at equator vs USA
  // - All of Europe in Australia
  
  // Each preset:
  // {
  //   name: "Greenland Reality Check",
  //   description: "Greenland looks huge, but...",
  //   countries: ["GRL"],
  //   targetLatitude: 0,
  // }
  ```

- [ ] **4.6** Implement preset loading
  ```typescript
  // "Show me" buttons that:
  // 1. Select the country
  // 2. Animate it to target position
  // 3. Display comparison info
  ```

- [ ] **4.7** Style all info components
  ```typescript
  // Using Tailwind:
  // - Semi-transparent backgrounds
  // - Consistent padding and spacing
  // - Responsive layout (mobile-friendly)
  // - Smooth transitions
  ```

#### Acceptance Criteria
- [ ] InfoPanel displays accurate statistics
- [ ] Information updates in real-time during drag
- [ ] Preset comparisons work correctly
- [ ] UI is readable and non-intrusive
- [ ] All text is educational and clear
- [ ] Responsive on mobile devices

---

### Phase 5: Polish & UX
**Goal:** Professional feel, smooth animations, helpful onboarding  
**Duration Estimate:** 1-2 sessions  
**Quality Gate:** User testing feedback positive

#### Tasks

- [ ] **5.1** Create welcome/tutorial overlay
  ```typescript
  // src/components/Onboarding/Tutorial.tsx
  
  // First-time user experience:
  // 1. "Did you know maps lie about size?"
  // 2. "Click any country to pick it up"
  // 3. "Drag to the equator to see its true size"
  // 4. "Try Greenland - it's not as big as you think!"
  
  // Store tutorial completion in localStorage
  ```

- [ ] **5.2** Add smooth animations
  ```typescript
  // Animations to implement:
  // - Country lift (scale + shadow)
  // - Size change during drag (smooth interpolation)
  // - Place country (slight bounce)
  // - Ghost fade in
  // - Panel slide in/out
  
  // Use CSS transitions or Framer Motion
  ```

- [ ] **5.3** Create control buttons
  ```typescript
  // src/components/Controls/Controls.tsx
  
  // Buttons:
  // - Reset (clear all placed countries)
  // - Undo (remove last placed)
  // - Toggle labels (country names)
  // - Toggle latitude lines
  // - Share (generate shareable link)
  ```

- [ ] **5.4** Implement keyboard shortcuts
  ```typescript
  // Shortcuts:
  // - Escape: deselect / cancel drag
  // - R: reset all
  // - Z: undo last
  // - ?: show help
  ```

- [ ] **5.5** Add sound effects (optional, off by default)
  ```typescript
  // Subtle sounds:
  // - Pick up: soft pop
  // - Place: soft thud
  // - Reset: whoosh
  
  // Use Web Audio API or Howler.js
  ```

- [ ] **5.6** Implement shareable state
  ```typescript
  // URL structure:
  // /?placed=GRL:0:20,USA:10:-30
  // 
  // Format: countryCode:lat:lng
  // 
  // On load:
  // 1. Parse URL params
  // 2. Place countries at specified positions
  // 3. Show comparison view
  ```

- [ ] **5.7** Add loading states and error handling
  ```typescript
  // Loading:
  // - Skeleton map while GeoJSON loads
  // - Progress indicator for large operations
  
  // Errors:
  // - Graceful fallback if data fails to load
  // - User-friendly error messages
  // - Retry mechanisms
  ```

- [ ] **5.8** Accessibility improvements
  ```typescript
  // A11y features:
  // - Keyboard navigation for country selection
  // - ARIA labels on interactive elements
  // - Screen reader announcements for actions
  // - Sufficient color contrast
  // - Focus indicators
  ```

- [ ] **5.9** Performance audit and optimization
  ```typescript
  // Checks:
  // - Lighthouse score > 90
  // - First contentful paint < 1.5s
  // - No memory leaks
  // - Smooth scrolling on mobile
  ```

#### Acceptance Criteria
- [ ] Tutorial explains concept clearly
- [ ] Animations are smooth and purposeful
- [ ] All controls work correctly
- [ ] Shareable links work
- [ ] Accessible to keyboard/screen reader users
- [ ] Performance scores meet targets

---

### Phase 6: Testing & Documentation
**Goal:** Comprehensive test coverage and documentation  
**Duration Estimate:** 1 session  
**Quality Gate:** 80%+ coverage, complete README

#### Tasks

- [ ] **6.1** Write integration tests
  ```typescript
  // Test user flows:
  // - Load app → see map
  // - Click country → see it lift
  // - Drag to equator → see resize
  // - Release → see placed
  // - Click reset → all cleared
  ```

- [ ] **6.2** Write E2E tests (Playwright)
  ```typescript
  // Critical paths:
  // - Full drag and drop flow
  // - Preset comparison loading
  // - Share link generation and loading
  // - Mobile touch interactions
  ```

- [ ] **6.3** Create README.md
  ```markdown
  # Mercator Explorer
  
  ## What is this?
  ## Try it live
  ## How it works
  ## Development
  ## Contributing
  ## Credits
  ```

- [ ] **6.4** Create CONTRIBUTING.md
  ```markdown
  # Contributing
  
  ## Getting started
  ## Code style
  ## Testing
  ## Pull request process
  ```

- [ ] **6.5** Add JSDoc comments to all utilities
  ```typescript
  // Document:
  // - All exported functions
  // - Complex algorithms
  // - Non-obvious code
  ```

- [ ] **6.6** Create demo GIF for README
  ```
  // Show:
  // - Selecting Greenland
  // - Dragging to equator
  // - Size comparison reveal
  ```

#### Acceptance Criteria
- [ ] Test coverage > 80%
- [ ] All critical paths tested
- [ ] README explains project clearly
- [ ] Code is well-documented
- [ ] Demo assets created

---

### Phase 7: Deployment
**Goal:** Live, accessible application  
**Duration Estimate:** 1 session  
**Quality Gate:** Accessible at public URL

#### Tasks

- [ ] **7.1** Configure production build
  ```typescript
  // Vite config:
  // - Optimize chunks
  // - Minify assets
  // - Generate source maps
  // - Set base URL if needed
  ```

- [ ] **7.2** Set up Vercel/Netlify deployment
  ```yaml
  # vercel.json or netlify.toml
  # - Build command: npm run build
  # - Output directory: dist
  # - Redirects for SPA routing
  ```

- [ ] **7.3** Configure custom domain (optional)
  ```
  # DNS settings for custom domain
  # SSL certificate
  ```

- [ ] **7.4** Set up monitoring
  ```typescript
  // Optional:
  // - Error tracking (Sentry)
  // - Analytics (privacy-respecting)
  // - Performance monitoring
  ```

- [ ] **7.5** Create GitHub release
  ```markdown
  # v1.0.0 - Initial Release
  
  ## Features
  - Interactive Mercator projection demonstration
  - Drag and drop countries
  - Real-time size comparison
  - Educational presets
  - Shareable links
  ```

#### Acceptance Criteria
- [ ] App deployed to public URL
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on iOS and Android
- [ ] Loads in < 3 seconds
- [ ] No console errors in production

---

## Appendix A: Reference Data

### Country Size Examples (for testing)

| Country | Area (km²) | Mercator Distortion at Native Lat |
|---------|-----------|-----------------------------------|
| Greenland | 2,166,086 | ~14x at 72°N |
| Russia | 17,098,242 | ~3x average |
| Brazil | 8,515,767 | ~1x (near equator) |
| Australia | 7,692,024 | ~1.3x at -25° |
| Antarctica | 14,200,000 | Extreme (off charts) |

### Key Latitudes

| Latitude | Mercator Scale | Notes |
|----------|---------------|-------|
| 0° | 1.00 | Equator - true scale |
| 30° | 1.15 | Tropics |
| 45° | 1.41 | Mid-latitudes |
| 60° | 2.00 | Near Arctic/Antarctic circles |
| 70° | 2.92 | Sub-polar |
| 80° | 5.76 | Near poles |

---

## Appendix B: Known Challenges

### Challenge 1: Polygon Simplification
**Problem:** Detailed coastlines cause performance issues during drag  
**Solution:** Use Turf.js simplify() during drag, restore on drop

### Challenge 2: Leaflet Drag Events
**Problem:** Leaflet doesn't natively support dragging GeoJSON features  
**Solution:** Custom drag implementation using mouse events + layer updates

### Challenge 3: Date Line Wrapping
**Problem:** Countries near 180° longitude behave strangely when moved  
**Solution:** Clamp longitude or implement wrapping logic

### Challenge 4: Antarctica
**Problem:** Antarctica breaks Mercator projection completely  
**Solution:** Exclude from interactive features or cap at 85°

---

## Appendix C: Future Enhancements (Post-MVP)

1. **Alternative Projections** - Switch between Mercator, Robinson, Mollweide
2. **Quiz Mode** - "Which is bigger: Greenland or India?"
3. **Time-lapse** - Show historical map projections
4. **AR Mode** - Use phone camera to place countries on surfaces
5. **Education Integration** - Lesson plans, worksheets
6. **Multi-language** - Internationalization support

---

## Session Handoff Protocol

At the end of each development session, the AI agent should:

1. **Update PROJECT_STATUS.md** with:
   - Tasks completed
   - Current blockers
   - Next priorities

2. **Update CHANGELOG.md** with:
   - Date and session number
   - Features added
   - Bugs fixed
   - Technical debt notes

3. **Commit all changes** with descriptive message

4. **Create/update GitHub issues** as needed

5. **Leave TODO comments** in code for incomplete work:
   ```typescript
   // TODO(next-session): Implement drag end handler
   // Currently missing: final position calculation
   ```

When starting a new session, the AI agent should:

1. Read PROJECT_STATUS.md for context
2. Check GitHub issues for current phase
3. Run tests to verify working state
4. Continue from documented stopping point
