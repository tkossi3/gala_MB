import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Build multi-pages : le site public (index.html) et l'espace organisateur (admin.html)
// sont deux applications React indépendantes, construites côte à côte.
// En dev, Vite tourne sur http://localhost:5173 et proxifie /api vers Spring Boot (port 8080).
// En prod, le résultat de `npm run build` (dossier dist/) est copié dans le Spring Boot
// (src/main/resources/static) et servi directement par le même serveur, sur le même port.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html")
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});
