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
