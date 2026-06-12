import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        preset: "vercel",
      },
    } as any), // <-- CON ESTO TYPESCRIPT GUARDA SILENCIO
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