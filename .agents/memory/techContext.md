# Tech Context — HomeCalc Pro

- **Runtime / Build:** Node.js v22.13.1, npm 10.9.2 (`npm.cmd` / `npx.cmd` on Windows PowerShell).
- **Framework:** Next.js 15 App Router (`output: 'export'`, `trailingSlash: true`) for $0 static Vercel deployment.
- **UI Library:** React 19 + TypeScript (`strict: true`).
- **Testing:** Vitest (`vitest.config.ts`).
- **Styling:** Vanilla CSS + CSS Custom Properties (no Tailwind, no CSS-in-JS).
- **Deployment Target:** Static `out/` directory on Vercel at `https://home.gsvalab.com`.
