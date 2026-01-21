# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial project setup with Vite + React 19 + TypeScript
- Tailwind CSS v4 configuration with custom map colors
- Vitest configuration with React Testing Library
- Zustand store skeleton with type definitions
- Projection math utilities (getMercatorScale, calculateSizeAdjustment)
- Data loading utilities skeleton
- GitHub Actions CI workflow
- Project status tracking files
- Natural Earth 110m GeoJSON data (177 countries)
- Data loading utility with Turf.js (centroid, area calculations)
- Map component with Leaflet + React-Leaflet
- CountryLayer component with hover/click interactions
- Info overlay showing selected country details
- Comprehensive tests for data loading (12 tests)
- DraggableCountry component with real-time resize during drag
- GhostCountry component showing original position
- PlacedCountry component for countries at new positions
- InteractiveOverlay orchestrating all draggable/placed countries
- DragHandler component with mouse and touch support
- useDragInteraction hook managing drag state
- simplifyGeometry function for performance during drag
- Real-time info panel with scale factor and comparison text
- Placed countries panel with reset functionality
- Escape key to cancel drag operation
- CSS styles for lifted/dragged/ghost country effects

### Changed
- N/A

### Fixed
- N/A

### Removed
- N/A

---

## Session Log

### Session 1 - 2026-01-21
**Phase:** 0 - Project Setup

**Completed:**
- Initialized Vite + React + TypeScript project
- Installed all core dependencies (React 19, Leaflet, React-Leaflet 5, Turf.js 7, Zustand 5)
- Configured Tailwind CSS v4 with CSS-first setup
- Configured Vitest with jsdom environment
- Created component folder structure
- Created TypeScript type definitions
- Created Zustand store skeleton
- Created projection and dataLoader utility skeletons
- Added sample projection tests
- Created status tracking files
- Created GitHub Actions CI workflow

**Notes:**
- Used React 19 instead of 18 for React-Leaflet 5 compatibility
- Tailwind v4 requires different setup than v3 (no config.js)
- All acceptance criteria met

**Next Session Should:**
- Begin Phase 1: Core Map & Data
- Download Natural Earth GeoJSON data
- Implement base Map component

### Session 2 - 2026-01-21
**Phase:** 1 - Core Map & Data

**Completed:**
- Downloaded Natural Earth 110m GeoJSON data (177 countries, ~820KB)
- Implemented data loading utility with Turf.js
  - Centroid calculation using turf.centroid()
  - Area calculation using turf.area()
  - Helper functions: findSimilarSizedCountries, getCountryById, getCountriesByArea
- Created Map component with Leaflet + React-Leaflet
  - Full viewport map with CartoDB light tiles (no labels)
  - Zoom controls positioned bottom-right
- Created CountryLayer component
  - Renders all countries as GeoJSON
  - Hover effect with highlight color
  - Click to select country
  - Logs country name to console
- Updated Zustand store to use actual data loader
- Wired up App component
  - Loads countries on mount
  - Shows loading spinner while loading
  - Shows error state if load fails
  - Info overlay displays selected country details
  - Status bar shows country count
- Added comprehensive tests for data loading (12 new tests, 22 total)

**Notes:**
- Natural Earth 110m is coarse resolution; smallest country is Luxembourg
- Bundle size warning (1.2MB) due to GeoJSON data being bundled
- All acceptance criteria met for Phase 1

**Next Session Should:**
- Begin Phase 2: Projection Mathematics
- Implement full Mercator scale calculations
- Implement polygon transformation function

### Session 3 - 2026-01-21
**Phase:** 2 - Projection Mathematics

**Completed:**
- Verified and cleaned up getMercatorScale function (removed TODO)
- Verified and cleaned up calculateSizeAdjustment function
- Implemented transformCountryToPosition function
  - Scales polygon around centroid based on latitude change
  - Translates to new position
  - Handles Polygon and MultiPolygon geometries
- Implemented findSimilarSizedCountries function
  - Finds countries within tolerance of target area
  - Sorts by closeness to target
- Implemented getDistortionAtLatitude utility
- Implemented formatArea utility for human-readable display
- Wrote comprehensive unit tests (35 projection tests, 47 total)

**Test Coverage:**
- getMercatorScale: 7 tests covering 0°, 45°, 60°, 80°, negatives, clamping
- calculateSizeAdjustment: 7 tests covering same lat, 70°→0°, symmetry
- getAreaComparison: 4 tests covering all thresholds
- transformCountryToPosition: 5 tests covering centroid, scaling, MultiPolygon
- findSimilarSizedCountries: 4 tests covering tolerance and sorting
- getDistortionAtLatitude: 4 tests
- formatArea: 4 tests

**Notes:**
- All tests pass with < 0.01% error margin
- Latitude clamped at ±85° to avoid infinity at poles
- Area distortion = scale² (60° → 4x, 80° → 33x)

**Next Session Should:**
- Begin Phase 3: Drag & Drop Interaction
- Create DraggableCountry component
- Implement drag state management

### Session 4 - 2026-01-21
**Phase:** 3 - Drag & Drop Interaction

**Completed:**
- Created DraggableCountry component
  - Renders country at current drag position
  - Transforms geometry using projection math
  - Uses simplified geometry during drag for performance
  - Amber color scheme for visibility
- Created GhostCountry component
  - Shows original position with dashed gray outline
  - Non-interactive (pointer-events: none)
- Created PlacedCountry component
  - Renders countries at their placed positions
  - Green color scheme
  - Click to remove, tooltip on hover
- Created InteractiveOverlay component
  - Orchestrates rendering of all overlay layers
  - Manages ghosts, placed countries, and dragged country
- Created DragHandler component
  - Handles mouse events (mousedown, mousemove, mouseup)
  - Disables map dragging during country drag
  - Updates cursor style
- Created useDragInteraction hook
  - Manages drag state with requestAnimationFrame throttling
  - Touch event support (touchstart, touchmove, touchend)
  - Escape key to cancel drag
- Added simplifyGeometry function
  - Uses turf.simplify for Douglas-Peucker algorithm
  - Reduces polygon complexity during drag
- Updated App component
  - Real-time info panel showing latitude and scale during drag
  - Placed countries panel with reset button
  - Status bar updated to show instructions
- Updated placeCountry in store
  - Now calculates actual scale factor using projection math
- Added CSS for visual effects
  - Drop shadow on lifted/dragged countries
  - Smooth transitions

**Notes:**
- All 47 tests still pass
- TypeScript compiles without errors
- Dev server runs successfully
- All Phase 3 acceptance criteria met

**Next Session Should:**
- Begin Phase 4: Information Display
- Create InfoPanel component
- Add preset comparisons (Greenland vs Africa, etc.)
- Create LatitudeIndicator component
