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

## Phase 5: Polish & UX (In Progress)

### Completed Tasks

- [x] **5.0** Split MultiPolygon countries
  - Split countries with disconnected landmasses > 500,000 km²
  - USA → `USA_CONT` (Continental) + `USA_ALASKA` (Alaska)
  - Canada → `CAN_MAIN` (Mainland) + `CAN_BAFFIN` (Baffin Island)
  - Updated presets to use country IDs instead of ISO codes

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

### Additional Improvements
- Country labels use `centerOfMass` for better visual positioning
- Labels centered with CSS transform
- Latitude lines with proper styling (Equator red, circles blue, others gray)

### Remaining Tasks

- [ ] **5.1** Create welcome/tutorial overlay
  - 4-step onboarding: "Maps lie" → "Click to pick up" → "Drag to equator" → "Try Greenland!"
  - Store completion in localStorage
  - Skip button + "Don't show again"

- [ ] **5.6** Implement shareable URL state
  - URL format: `/?placed=USA_ALASKA:0:20,GRL:-10:0`
  - Parse on load, place countries at positions
  - Copy-to-clipboard button (basic implementation done)

- [ ] **5.2** Polish animations (CSS-based, no new deps)
  - Panel slide in/out transitions
  - Country placement bounce
  - Ghost fade in
  - Smooth hover transitions

- [ ] **5.9** Performance check
  - Quick Lighthouse audit
  - Verify no memory leaks
  - Target: FCP < 2s, score > 85

### Skipped (out of scope for now)
- ~~5.5 Sound effects~~ - Low value, adds complexity
- ~~5.7 Loading states~~ - Current UX is acceptable
- ~~5.8 Accessibility~~ - Defer to Phase 6

### Acceptance Criteria
- [x] MultiPolygon countries split and independently draggable
- [ ] Tutorial explains concept clearly
- [x] All control buttons work correctly
- [x] Keyboard shortcuts functional
- [ ] Shareable links work (partial - copy works, parse on load pending)
- [ ] Animations are smooth (CSS transitions)

---

## Backlog (Future Phases)

### Phase 6: Testing & Docs
- [ ] Integration tests for user flows
- [ ] E2E tests with Playwright
- [ ] README and CONTRIBUTING documentation
- [ ] JSDoc comments for utilities
- [ ] Demo GIF for README

### Phase 7: Deployment
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
