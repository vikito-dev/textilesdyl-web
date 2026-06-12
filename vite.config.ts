import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// 1. Creamos la configuración aparte y le decimos a TypeScript que es de tipo "any"
const startConfig: any = {
  server: {
    preset: "vercel"
  }
};

export default defineConfig({
  plugins: [
    // 2. Pasamos la variable fantasma sin que TypeScript se queje
    tanstackStart(startConfig),
    viteReact(),     
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true, 
  },
  server: {
    host: true,
    port: 3000,
  },
});