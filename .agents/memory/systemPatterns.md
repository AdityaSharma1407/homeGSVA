# System Patterns — HomeCalc Pro

- **Pure Math Layer (`src/lib/math/`):** Framework-agnostic TypeScript modules (`rounding.ts`, `units.ts`, `paint.ts`, `concrete.ts`, `mulch.ts`, `tile.ts`, `fence.ts`, `gravel.ts`) tested with Vitest (`src/lib/math/__tests__/`).
- **State & Persistence (`src/lib/storage/projectBag.ts`):** Versioned, schema-validated `localStorage` store for multi-zone project items and unit preference, with safe fallback if `localStorage` throws or is unavailable.
- **UI Architecture:**
  - Astro `.astro` pages render static SEO shell, header/footer, breadcrumbs, AdSense-safe `AdSlot.astro`, and unique below-the-fold editorial content.
  - React `.tsx` islands (`client:load`) handle interactive split-pane estimators (60% inputs left, 40% sticky live receipt + `SvgSchematic.tsx` right) and `ProjectBagDrawer.tsx` / `PrintSheet.tsx`.
- **Styling:** Vanilla CSS (`tokens.css`, `global.css`, `calculator.css`, `print.css`) using an "Architectural Drafting Desk" light-first palette (`#F8F7F4` paper, `#FFFFFF` cards, `#1E3A5F` blueprint navy, `#C84B24` terracotta accent).
