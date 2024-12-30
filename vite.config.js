import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  console.log("VITE_CLIENT_APP_URL", process.env.VITE_CLIENT_APP_URL); // Use process.env here
  return {
    plugins: [
      react(),
      federation({
        name: "host_app",
        remotes: {
          client_app: process.env.VITE_CLIENT_APP_URL,
        },
        shared: ["react"],
      }),
    ],
    build: {
      minify: mode === "production",
      target: mode === "production" ? "esnext" : "es2015",
      cssCodeSplit: mode === "production",
    },
  };
});
