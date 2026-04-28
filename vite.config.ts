import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vitest/config";

const isStorybook = !!process.env.STORYBOOK;

export default defineConfig({
  plugins: [!process.env.VITEST && !isStorybook && reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [
      "react-dnd",
      "react-dnd-html5-backend",
      "react-dnd-touch-backend",
      "@react-dnd/invariant",
      "dnd-core",
      "@react-dnd/shallowequal",
      "@react-dnd/asap",
      "react-toastify",
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["src/app/routes/**/*.spec.ts", "node_modules/**"],
  },
});
