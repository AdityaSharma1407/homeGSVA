# IndexNow Verification Key Setup

To enable instant search engine indexing via `astro-indexnow`:

1. Generate a 32-character hexadecimal IndexNow API key (or UUID without hyphens).
2. Create a UTF-8 plain text file in `public/` named `<YOUR_INDEXNOW_KEY>.txt` containing only `<YOUR_INDEXNOW_KEY>`.
3. Set the environment variable `INDEXNOW_KEY=<YOUR_INDEXNOW_KEY>` in your CI/CD host (Cloudflare Pages, Vercel, or GitHub Actions) before running `npm run build`.
4. Verify after deployment that `https://home.gsvalab.com/<YOUR_INDEXNOW_KEY>.txt` returns HTTP 200 with the exact key string.
