# TODO - Current Phase Tasks

## Phase 0: Project Setup ✅ COMPLETE

All tasks completed.

---

## Phase 1: Core Map & Data ✅ COMPLETE

All tasks completed:
- [x] Download Natural Earth 110m GeoJSON data
- [x] Define and validate TypeScript types
- [x] Create data loading utility with Turf.js
- [x] Implement base Map component
- [x] Implement CountryLayer component with hover/click
- [x] Wire up Zustand store with data loading
- [x] Wire up App component
- [x] Write tests for data loading

---

## Phase 2: Projection Math (Next)

### High Priority
- [ ] Implement full Mercator scale calculations (expand skeleton from Phase 0)
- [ ] Implement polygon transformation function
- [ ] Implement area comparison utilities

### Medium Priority
- [ ] Comprehensive unit tests with edge cases
- [ ] Test transformations with real country geometries

### Acceptance Criteria
- [ ] All projection math functions implemented
- [ ] Unit tests cover edge cases (poles, equator, negative latitudes)
- [ ] Tests pass with < 0.01% error margin
- [ ] Functions handle invalid inputs gracefully

---

## Backlog (Future Phases)

### Phase 3: Drag & Drop
- [ ] Draggable country component
- [ ] Real-time resize during drag
- [ ] Touch support

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
