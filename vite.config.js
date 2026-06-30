import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-dom") || id.includes("gsap") || id.includes("motion")) {
            return "framework-vendor";
          }
          if (id.includes("ogl") || id.includes("gl-matrix")) return "graphics-vendor";
          if (id.includes("@phosphor-icons") || id.includes("simple-icons")) return "icons-vendor";
          return "vendor";
        },
      },
    },
  },
});
