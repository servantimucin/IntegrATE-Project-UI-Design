import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts", // Optional: for global setup like @testing-library/jest-dom
  },
  resolve: {
    alias: {
      "@": "./", // Alias for absolute imports
    },
  },
})
