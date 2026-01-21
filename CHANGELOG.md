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
