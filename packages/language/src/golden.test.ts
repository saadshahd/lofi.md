import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, parseWithDiagnostics } from "./index.js";
import { toCleanAST } from "./test-utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const testCasesDir = resolve(__dirname, "../../../test-cases");

describe("golden tests", () => {
  describe("valid cases", () => {
    const validDir = join(testCasesDir, "valid");
    const validFiles = readdirSync(validDir)
      .filter((f) => f.endsWith(".lofi"))
      .sort();

    for (const file of validFiles) {
      it(`parses ${file}`, async () => {
        const input = readFileSync(join(validDir, file), "utf-8");
        const doc = await parse(input);
        expect(toCleanAST(doc)).toMatchSnapshot();
      });
    }
  });

  describe("invalid cases", () => {
    const invalidDir = join(testCasesDir, "invalid");
    const invalidFiles = readdirSync(invalidDir)
      .filter((f) => f.endsWith(".lofi"))
      .sort();

    for (const file of invalidFiles) {
      it(`rejects ${file}`, async () => {
        const input = readFileSync(join(invalidDir, file), "utf-8");
        const result = await parseWithDiagnostics(input);

        // Check parser errors first
        const parserErrors = result.parseResult.parserErrors;

        // For unknown-keyword, grammar accepts any ID, validation catches it
        const { services } = await import("./index.js");
        const validator = services.Lofi.validation.DocumentValidator;
        const validationDiagnostics = await validator.validateDocument(result);

        const allErrors = [
          ...parserErrors.map((e) => e.message),
          ...validationDiagnostics.map((d) => d.message),
        ];

        expect(allErrors.length).toBeGreaterThan(0);

        const errorCodes = allErrors.map((msg) => {
          const match = msg.match(/\[LOFI_\w+\]/);
          return match ? match[0] : msg;
        });

        expect(errorCodes).toMatchSnapshot();
      });
    }
  });
});
