# Architecture Decision Records

## 2026-01-21 Initial Technology Stack

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

## 2026-01-21 State Management Choice

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

---

## 2026-01-21 React and Tailwind Versions

**Context:** Need to decide on specific versions for React and Tailwind CSS.

**Decision:** React 19 + Tailwind CSS v4

**Rationale:**
- React-Leaflet 5.0 requires React 19
- Tailwind v4 is current stable with improved Vite integration
- CSS-first configuration simplifies setup

**Consequences:**
- No `tailwind.config.js` file - use CSS `@theme` directive
- Use `@tailwindcss/vite` plugin instead of PostCSS
