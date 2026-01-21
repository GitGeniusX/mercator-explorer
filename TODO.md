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

## Phase 5: Polish & UX (Next)

### High Priority
- [ ] Create welcome/tutorial overlay
- [ ] Add smooth animations (panel transitions, country placement bounce)
- [ ] Implement keyboard shortcuts (Escape, R for reset, Z for undo, ? for help)

### Medium Priority
- [ ] Implement shareable state via URL parameters
- [ ] Add loading states and error handling improvements
- [ ] Accessibility improvements (ARIA labels, focus indicators)

### Lower Priority
- [ ] Add sound effects (optional, off by default)
- [ ] Performance audit (Lighthouse score > 90)

### Acceptance Criteria
- [ ] Tutorial explains concept clearly
- [ ] Animations are smooth and purposeful
- [ ] All controls work correctly
- [ ] Shareable links work
- [ ] Accessible to keyboard/screen reader users

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
