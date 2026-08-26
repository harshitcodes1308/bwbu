import { defineConfig } from "vite";

// Dev: forward /api to the TypeScript backend so the OpenAI key stays server-side.
export default defineConfig({
  server: {
    proxy: { "/api": "http://127.0.0.1:8787" },
  },
});
