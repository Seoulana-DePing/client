import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    port: 3000,
  },
  assetsInclude: ["**/*.json"], // JSON 파일을 asset으로 처리
});
