# Lost & Founds (ReactJS + Redux)

Praktikum PABWE 2026 – Pertemuan 4 (Studi Kasus 2.1). 

## Menjalankan
```bash
bun install
cp .env.example .env      # DELCOM_BASEURL dan APP_PORT
bun run dev               # http://localhost:3000
bun run test:coverage     # unit test + coverage (threshold 100%)
bun run build
```

## Struktur
- `src/features/auth | users | lost-founds` → `api/`, `states/` (action + reducer), `pages/`, `layouts/`, `components/`, `modals/`
- `src/helpers` (apiHelper, toolsHelper), `src/hooks/useInput.js`, `src/components/Avatar.jsx`
- `src/store.js`, `src/main.jsx`, `src/App.jsx`, `src/setupTests.js`, `src/test-utils.jsx`

## Rute
`/auth/login`, `/auth/register`, `/` (dashboard, filter, aksi cepat, #statistik), `/lost-founds/:id`, `/users`, `/profile`
