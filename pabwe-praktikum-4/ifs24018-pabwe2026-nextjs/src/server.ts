/// <reference types="bun" />
// Launcher Next.js: membaca APP_PORT dari .env (Bun memuat .env otomatis)
const mode = process.argv[2] === "start" ? "start" : "dev";
const port = String(Number(process.env.APP_PORT) || 3000);

const proc = Bun.spawn(["bunx", "next", mode, "-p", port], {
  stdio: ["inherit", "inherit", "inherit"],
});

process.exit(await proc.exited);

export {};
