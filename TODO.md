# TODO - Current Phase Tasks

## Phase 0: Project Setup ✅ COMPLETE

All tasks completed.

---

## Phase 1: Core Map & Data ✅ COMPLETE

All tasks completed.

---

## Phase 2: Projection Math ✅ COMPLETE

All tasks completed:
- [x] Implement full Mercator scale calculations
- [x] Implement polygon transformation function (transformCountryToPosition)
- [x] Implement area comparison utilities (getAreaComparison, findSimilarSizedCountries)
- [x] Implement helper utilities (getDistortionAtLatitude, formatArea)
- [x] Comprehensive unit tests (35 tests, <0.01% error margin)
- [x] Handle edge cases (poles clamped at ±85°, negative latitudes)

---

## Phase 3: Drag & Drop ✅ COMPLETE

All tasks completed:
- [x] Create DraggableCountry component
- [x] Implement drag state management in store
- [x] Create "lift" animation on selection (amber highlight + shadow)
- [x] Real-time resize during drag using transformCountryToPosition
- [x] Handle drag end - place country at final position
- [x] Implement "ghost" display for original position (dashed gray outline)
- [x] Add touch support for mobile (touchstart, touchmove, touchend)
- [x] Performance optimization (polygon simplification during drag)

### Components Created
- `DraggableCountry` - Renders country during drag with real-time resize
- `GhostCountry` - Shows original position outline
- `PlacedCountry` - Renders placed countries at new positions
- `InteractiveOverlay` - Orchestrates all overlay layers
- `DragHandler` - Handles mouse/touch events
- `useDragInteraction` hook - Manages drag state

---

## Phase 4: Information Display ✅ COMPLETE

All tasks completed:
- [x] InfoPanel component with detailed statistics
- [x] ComparisonCard component for side-by-side comparison
- [x] LatitudeIndicator component for real-time drag feedback
- [x] StatsOverlay component with session stats and fun facts
- [x] PresetSelector component with 8 educational presets
- [x] Preset comparisons data (Greenland, Russia, Alaska, etc.)
- [x] usePresetAnimation hook for smooth animations
- [x] Animation state management in store
- [x] Style all info components

### Preset Comparisons
1. Greenland Reality Check
2. Alaska vs Brazil
3. Russia at the Equator
4. Africa is Massive
5. Scandinavian Surprise
6. Things That Fit in Australia
7. Canada Reality
8. Antarctica Distortion

---

## Phase 5: Polish & UX ✅ COMPLETE

All tasks completed:

- [x] **5.0** Split MultiPolygon countries
  - Split countries with disconnected landmasses > 500,000 km²
  - USA → `USA_CONT` (Continental) + `USA_ALASKA` (Alaska)
  - Canada → `CAN_MAIN` (Mainland) + `CAN_BAFFIN` (Baffin Island)
  - Updated presets to use country IDs instead of ISO codes

- [x] **5.1** Create welcome/tutorial overlay
  - 4-step onboarding: "Maps lie" → "Click to pick up" → "Drag to equator" → "Try Greenland!"
  - Progress dots with step navigation
  - "Don't show again" checkbox + Skip button
  - Completion stored in localStorage
  - Tutorial skipped when loading shared state

- [x] **5.2** Polish animations (CSS-based, no new deps)
  - Panel slide-in transitions (left, right, up)
  - Country placement bounce animation
  - Ghost fade-in animation
  - Button hover/active transitions

- [x] **5.3** Create control buttons
  - Reset, Undo, Toggle labels, Toggle latitude lines, Share, Help
  - Clean button bar UI at bottom center

- [x] **5.4** Implement keyboard shortcuts
  - Escape: deselect / cancel drag
  - R: reset all
  - Z: undo last
  - L: toggle labels
  - G: toggle latitude grid
  - ?: show help modal

- [x] **5.6** Implement shareable URL state
  - URL format: `?placed=USA_ALASKA:0:20,GRL:-10:0`
  - Parse on load, place countries at positions
  - Copy-to-clipboard button working

- [x] **5.9** Performance check
  - Bundle: 1.26 MB (340 KB gzipped) - expected with GeoJSON
  - All event listeners properly cleaned up
  - No memory leaks detected
  - 48 tests passing

### Skipped (out of scope)
- ~~5.5 Sound effects~~ - Low value, adds complexity
- ~~5.7 Loading states~~ - Current UX is acceptable
- ~~5.8 Accessibility~~ - Defer to Phase 6

---

## Phase 6: Testing & Docs (Next)

- [ ] Integration tests for user flows
- [ ] E2E tests with Playwright
- [ ] README and CONTRIBUTING documentation
- [ ] JSDoc comments for utilities
- [ ] Demo GIF for README

---

## Phase 7: Deployment (Future)

- [ ] Production build optimization (code splitting for GeoJSON)
- [ ] Deploy to Vercel/Netlify
- [ ] Custom domain (optional)
- [ ] Monitoring setup (optional)

(See mercator-explorer-spec.md for full task details)

---

## Known Issues
- Bundle size warning (1.2MB JS chunk with GeoJSON data)

## Technical Debt
- Consider lazy loading GeoJSON data
- Consider code splitting for Turf.js
