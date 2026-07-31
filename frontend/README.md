# PRISM Frontend

React + Vite single-page app for the PRISM pharmacy intelligence platform.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

- Dev server proxies `/api` → `http://localhost:4000` (see `vite.config.js`).
- Set `VITE_API_URL` in a `.env` file to point services at a deployed backend.
- Design tokens (healthcare blue, capped radii, subtle shadows) live in `tailwind.config.js`.

See the root [`README.md`](../README.md) for the full overview and demo accounts.
