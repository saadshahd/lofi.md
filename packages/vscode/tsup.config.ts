import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/extension.ts"],
    format: ["cjs"],
    outDir: "dist",
    external: ["vscode"],
    noExternal: ["@lofi.md/language", "@lofi.md/html"],
    sourcemap: true,
    clean: true,
  },
  {
    entry: ["src/language-server/main.ts"],
    format: ["cjs"],
    outDir: "dist/language-server",
    noExternal: ["@lofi.md/language"],
    sourcemap: true,
  },
]);
