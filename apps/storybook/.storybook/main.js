import { dirname, join, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const workspaceRoot = resolve(
  dirname(import.meta.url.replace("file://", "")),
  "../../..",
);

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lofi/language": resolve(
        workspaceRoot,
        "packages/language/src/index.ts",
      ),
      "@lofi/html/lofi.css": resolve(
        workspaceRoot,
        "packages/html/src/lofi.css",
      ),
      "@lofi/html": resolve(workspaceRoot, "packages/html/src/index.ts"),
    };

    return config;
  },
};

export default config;
