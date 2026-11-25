# HomeCalc Pro — Workspace Instructions

**HomeCalc Pro** (`https://home.gsvalab.com`) is a zero-server **Home & Renovation Material Estimators Hub** built with Next.js App Router (`output: 'export'` for Vercel), React, strict TypeScript, Vanilla CSS (`:root` design tokens), and Vitest.

## Commands
- Type-check, test, and build: `npx tsc --noEmit && npm test && npm run build` (on Windows PowerShell, use `npx.cmd` and `npm.cmd`).
- Unit tests only: `npm test`
- Local static preview: `npx serve out` (or `npm run dev`)

## Scope & Non-Overlap
- Strictly Home, Renovation, Yard, and Landscaping estimation: Paint, Concrete, Mulch, Tile Wastage, Fencing, and Gravel.
- Do NOT add generic image, OCR, PDF, QR, audio/video, CSV/JSON/XML, or text utilities (handled on `tools.gsvalab.com`).
- Zero backend API routes, zero databases, zero external runtime API dependencies. All state persists in browser `localStorage`.

## Memory Bank
- @.agents/memory/projectbrief.md
- @.agents/memory/systemPatterns.md
- @.agents/memory/techContext.md
- @.agents/memory/activeContext.md
