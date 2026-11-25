---
trigger: model_decision
description: "Apply whenever building or modifying HomeCalc estimators, pure math modules, SEO pages, or CSS layouts."
---

# HomeCalc Pro Engineering & Quality Standards

1. **Zero-Server Architecture:**
   - Astro static output (`output: 'static'`). No server endpoints, no SSR adapters, no databases, no external runtime API calls.
   - Persist user state (Project Bag, unit system preference) strictly in browser `localStorage` with schema versioning and graceful fallback when storage is unavailable or full.

2. **Pure Math Isolation:**
   - All unit conversions and estimator formulas live in `src/lib/math/*.ts` with zero React/DOM/Astro imports.
   - Every math module must guard against negative inputs, `NaN`, `Infinity`, and zero division.
   - Use `safeCeil(value)` (`Math.ceil(value - 1e-9)`) from `src/lib/math/rounding.ts` for all discrete package/bag/tile/post counts to prevent IEEE-754 floating-point drift.
   - Dual US Imperial (default) and Metric modes must be supported in the math layer and UI on the same canonical URL (no duplicate `/metric/` routes).

3. **Explicit TypeScript & Vanilla CSS:**
   - `strict: true` in `tsconfig.json`. No implicit `any`, no silent `catch` blocks, no magic one-liners.
   - Modular Vanilla CSS + CSS Custom Properties (`:root` tokens in `src/styles/tokens.css`). Do NOT install Tailwind CSS or CSS-in-JS libraries.
   - Use `tabular-nums` monospace for all numeric inputs, breakdowns, and receipt quantities.
   - Provide a clean `@media print` stylesheet (`src/styles/print.css`) hiding navigation, ads, and input controls.

4. **AdSense CLS & Safety Guardrails:**
   - `AdSlot.astro` must reserve `min-height: 280px` on desktop and `min-height: 250px` on mobile, labeled `Advertisement`.
   - Place ad slots ONLY below the calculator/results fold or in well-separated editorial gaps with at least `32px` clearance from interactive controls. Never place ads inside the Project Bag drawer or near `+/-` buttons.

5. **Unique Per-Page SEO Content:**
   - Every estimator page must include unique below-the-fold static HTML: worked example, formula breakdown, reference tables, practical field warnings, 5–6 FAQs, and contextual sibling links.
   - Include canonical URL (`https://home.gsvalab.com/...`), Open Graph tags, and valid JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`).
