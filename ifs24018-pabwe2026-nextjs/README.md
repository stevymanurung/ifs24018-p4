# Delcom Posts (Next.js App Router + TypeScript + Redux)

## Menjalankan
```bash
bun install
cp .env.example .env      # NEXT_PUBLIC_DELCOM_BASEURL / APP_PORT
bun run dev
bun run test:coverage     # threshold 100%
bun run build && bun run start   # build butuh internet (Google Fonts)
```

## Deploy ke Netlify
`netlify.toml` sudah disiapkan. Netlify mendeteksi Next.js otomatis. Pastikan **Base directory** menunjuk ke folder proyek ini (package.json di root proyek), dan jangan mengisi Publish directory secara manual.
