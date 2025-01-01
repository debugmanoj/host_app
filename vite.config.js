import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

import fs from "fs";
import path from "path";


// Load environment variables
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

   // Ensure the package.json file is being read correctly
   const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
  );
  
  // Create a shared dependencies object
  const sharedDependencies = Object.keys(packageJson.dependencies).reduce(
    (acc, dep) => {
      acc[dep] = {
        singleton: true,
        requiredVersion: packageJson.dependencies[dep],
      };
      return acc;
    },
    {}
  );

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
        shared: sharedDependencies, // Share all dependencies from package.json
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
