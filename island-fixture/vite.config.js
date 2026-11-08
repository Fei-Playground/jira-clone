import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// The app's API runs on API_PORT (8000 by default); /api is proxied to it.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": `http://127.0.0.1:${process.env.API_PORT || 8000}` } },
});
