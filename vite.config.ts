import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Use repository subpath only when building on GitHub Actions for Pages.
  base: process.env.GITHUB_ACTIONS ? "/Interactive-Resume-Builder/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  }
});
