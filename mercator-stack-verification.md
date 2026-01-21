# Mercator Explorer - Technical Stack Verification

## ✅ Verified Versions (January 2025)

| Component | Recommended Version | Notes |
|-----------|---------------------|-------|
| **Node.js** | 20.19+ or 22.12+ | Required by Vite 7 |
| **React** | 19.x | v19.2.1 is latest stable |
| **Vite** | 7.x | v7.3.1 is latest |
| **TypeScript** | 5.x | Latest stable |
| **Tailwind CSS** | 4.x | v4.1 latest - **MAJOR changes from v3** |
| **Leaflet** | 1.9.4 | Stable (2.0 is alpha) |
| **React-Leaflet** | 5.0.0 | Requires React 19 |
| **Turf.js** | 7.x | v7.3.2 latest - package: `@turf/turf` |
| **Zustand** | 5.x | v5.0.10 latest |
| **Vitest** | 3.x | Latest |

---

## 🔄 Critical Changes from Original Spec

### 1. React Version Update
**Original:** React 18+  
**Corrected:** React 19.x

React 19 is now stable (since December 2024). React-Leaflet 5.0 requires React 19.

### 2. Tailwind CSS v4 - Major Overhaul
**Original:** Tailwind with `tailwind.config.js`  
**Corrected:** Tailwind v4 with CSS-first configuration

Tailwind v4 (released January 22, 2025) has a completely new setup:
- Uses `@tailwindcss/vite` plugin instead of PostCSS
- CSS-first configuration with `@theme` directive
- No more `tailwind.config.js` file needed
- Automatic content detection

### 3. Turf.js Package Name
**Original:** `@turf/turf`  
**Corrected:** `@turf/turf` ✓ (was correct, just confirming)

Note: The old package `turf` (without @) is deprecated (last updated 10 years ago).

### 4. Vite Version
**Original:** Vite (unspecified)  
**Corrected:** Vite 7.x

Vite 7 requires Node.js 20.19+ or 22.12+ and is ESM-only.

---

## 📦 Updated Install Commands

```bash
# Create project with Vite + React + TypeScript
npm create vite@latest mercator-explorer -- --template react-ts
cd mercator-explorer

# Install core dependencies
npm install leaflet react-leaflet @turf/turf zustand

# Install Tailwind v4 with Vite plugin
npm install tailwindcss @tailwindcss/vite

# Install dev dependencies
npm install -D @types/leaflet vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## ⚙️ Updated Configuration Files

### vite.config.ts (Tailwind v4 style)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### src/index.css (Tailwind v4 style)

```css
@import "tailwindcss";

/* Custom theme variables (replaces tailwind.config.js) */
@theme {
  --color-map-water: oklch(0.75 0.1 220);
  --color-map-land: oklch(0.95 0.01 90);
  --color-map-highlight: oklch(0.85 0.2 85);
  --color-map-ghost: oklch(0.8 0.02 0);
}
```

### No tailwind.config.js needed!

Tailwind v4 auto-detects content files and uses CSS-first configuration.

---

## ⚠️ Compatibility Matrix

| Component | Works With | Notes |
|-----------|------------|-------|
| React-Leaflet 5.x | React 19 only | ❌ Not compatible with React 18 |
| React-Leaflet 4.x | React 18 | Use if React 18 is required |
| Zustand 5.x | React 18 & 19 | ✅ Works with both |
| Tailwind v4 | Vite 6+, 7+ | ✅ First-party Vite plugin |
| Leaflet 1.9.4 | All React versions | ✅ Stable |

---

## 🎯 Recommended Stack (Final)

For this project, use these exact versions:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^5.0.0",
    "@turf/turf": "^7.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^7.0.0",
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0"
  }
}
```

---

## 📋 Updated Phase 0 Tasks

Replace the original Phase 0 setup with:

```bash
# 1. Create project
npm create vite@latest mercator-explorer -- --template react-ts
cd mercator-explorer

# 2. Install dependencies
npm install leaflet react-leaflet @turf/turf zustand
npm install tailwindcss @tailwindcss/vite
npm install -D @types/leaflet vitest @testing-library/react @testing-library/jest-dom jsdom

# 3. Update vite.config.ts to include tailwindcss plugin

# 4. Update src/index.css with @import "tailwindcss";

# 5. Create folder structure
mkdir -p src/{components/{Map,CountryOverlay,InfoPanel,Controls,Onboarding},hooks,stores,utils,data,types}

# 6. Verify setup
npm run dev
```

---

## 🔗 Reference Documentation

- [React 19 Release](https://react.dev/versions)
- [Vite 7 Announcement](https://vite.dev/blog/announcing-vite7)
- [Tailwind CSS v4 Guide](https://tailwindcss.com/blog/tailwindcss-v4)
- [React-Leaflet v5 Docs](https://react-leaflet.js.org/)
- [Turf.js Getting Started](https://turfjs.org/docs/getting-started)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

## Summary of Changes for AI Agent

When implementing Phase 0, the AI agent should:

1. **Use React 19** (not 18) with React-Leaflet 5.0
2. **Use Tailwind v4 setup** with `@tailwindcss/vite` plugin
3. **No `tailwind.config.js`** - use CSS `@theme` directive instead
4. **Use `@turf/turf`** package (not `turf`)
5. **Ensure Node.js 20.19+** is installed
6. **Update the project spec** (DECISIONS.md) to document these version choices
