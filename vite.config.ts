import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart(), // Este levanta el servidor SSR y las rutas al mismo tiempo
    viteReact(),     // Tiene que ir siempre debajo del de Start
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