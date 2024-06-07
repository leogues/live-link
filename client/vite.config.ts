import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: ["src/setupTests.ts"],
//   },
// });

export default defineConfig(({ mode }) => {
  mode = mode === "production" ? "production" : "development";
  const env = loadEnv(mode, `${process.cwd()}`);

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    build: {
      outDir: "dist",
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/setupTests.ts"],
    },
  };
});
