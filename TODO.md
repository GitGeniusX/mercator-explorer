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

## Phase 3: Drag & Drop (Next)

### High Priority
- [ ] Create DraggableCountry component
- [ ] Implement drag state management in store
- [ ] Create "lift" animation on selection
- [ ] Real-time resize during drag using transformCountryToPosition

### Medium Priority
- [ ] Handle drag end - place country
- [ ] Implement "ghost" display for original position
- [ ] Add touch support for mobile
- [ ] Performance optimization (polygon simplification during drag)

### Acceptance Criteria
- [ ] Clicking a country "lifts" it visually
- [ ] Dragging is smooth (60fps)
- [ ] Country resizes in real-time based on latitude
- [ ] Releasing places the country at new position
- [ ] Original position shows ghost outline
- [ ] Works on touch devices

---

## Backlog (Future Phases)

### Phase 4: Information Display
- [ ] InfoPanel component
- [ ] Comparison cards
- [ ] Preset comparisons

### Phase 5: Polish & UX
- [ ] Tutorial overlay
- [ ] Animations
- [ ] Keyboard shortcuts

### Phase 6: Testing & Docs
- [ ] Integration tests
- [ ] E2E tests
- [ ] README and documentation

### Phase 7: Deployment
- [ ] Production build optimization (code splitting for GeoJSON)
- [ ] Deploy to Vercel/Netlify

(See mercator-explorer-spec.md for full task details)

---

## Known Issues
- Bundle size warning (1.2MB JS chunk with GeoJSON data)

## Technical Debt
- Consider lazy loading GeoJSON data
- Consider code splitting for Turf.js
