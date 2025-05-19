import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    historyApiFallback: true
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
