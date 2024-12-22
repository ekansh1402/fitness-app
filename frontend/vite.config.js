import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Replace 3000 with the port you want to use
    proxy: {
      "/api/v1": {
        target: "http://localhost:4000",
        secure: false,
      },
    },
  },
});
