import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import fs from "fs";
import path from "path";

// Read package.json dependencies
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

// Extract dependencies to be shared
const sharedDependencies = Object.keys(packageJson.dependencies).map(dep => ({
  [dep]: {
    singleton: true,
    requiredVersion: packageJson.dependencies[dep],
  },
}));

// Flatten the array of shared dependencies
const shared = Object.assign({}, ...sharedDependencies);

// Load environment variables
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  console.log(
    "process.env.VITE_CLIENT_APP_URL: ",
    process.env.VITE_CLIENT_APP_URL
  );
  console.log("process.env.VITE_CALC_APP_URL: ", process.env.VITE_CALC_APP_URL);
  return {
    plugins: [
      react(),
      federation({
        name: "host_app",
        remotes: {
          client_app: process.env.VITE_CLIENT_APP_URL,
          calc_app: process.env.VITE_CALC_APP_URL,
        },
        shared, // Share all dependencies from package.json
      }),
    ],
    server: {
      port: 5173, // Host app runs on port 5173
      proxy: {
        "/api": "http://localhost:8080", // Proxy API requests to another server
      },
      hmr: {
        overlay: false, // Disable the HMR overlay
      },
    },
    build: {
      minify: mode === "production",
      target: mode === "production" ? "esnext" : "es2015",
      cssCodeSplit: mode === "production",
    },
  };
});
