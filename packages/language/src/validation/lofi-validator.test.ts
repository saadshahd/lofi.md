import { describe, it, expect } from "vitest";
import { parseWithDiagnostics } from "../index.js";

describe("lofi validation - indentation errors", () => {
  it("detects tab characters with LOFI_INDENT_002", async () => {
    const doc = await parseWithDiagnostics('card\n\theading "Title"');
    const lexerDiagnostics = doc.parseResult.lexerReport?.diagnostics ?? [];
    const hasTabError = lexerDiagnostics.some(
      (d) =>
        d.message.includes("LOFI_INDENT_002") ||
        d.message.includes("Tab characters"),
    );
    expect(hasTabError).toBe(true);
  });

  it("detects mixed tabs and spaces with LOFI_INDENT_003", async () => {
    const doc = await parseWithDiagnostics('card\n \theading "Title"');
    const lexerDiagnostics = doc.parseResult.lexerReport?.diagnostics ?? [];
    const hasMixedError = lexerDiagnostics.some(
      (d) =>
        d.message.includes("LOFI_INDENT_003") || d.message.includes("Mixed"),
    );
    expect(hasMixedError).toBe(true);
  });

  it("detects odd number of spaces with LOFI_INDENT_001", async () => {
    const doc = await parseWithDiagnostics('card\n   heading "Title"');
    const lexerDiagnostics = doc.parseResult.lexerReport?.diagnostics ?? [];
    const hasOddSpaceError = lexerDiagnostics.some(
      (d) =>
        d.message.includes("LOFI_INDENT_001") ||
        d.message.includes("2-space indentation"),
    );
    expect(hasOddSpaceError).toBe(true);
  });
});

describe("lofi validation - syntax errors", () => {
  it("rejects unknown keywords", async () => {
    const doc = await parseWithDiagnostics("unknownelement");
    expect(doc.parseResult.parserErrors.length).toBeGreaterThan(0);
  });

  it("accepts valid keywords", async () => {
    const doc = await parseWithDiagnostics('button "Save"');
    expect(doc.parseResult.parserErrors).toHaveLength(0);
    expect(doc.parseResult.lexerErrors).toHaveLength(0);
  });
});

describe("lofi validation - error message format", () => {
  it("includes error code in bracket format", async () => {
    const doc = await parseWithDiagnostics('card\n\theading "Title"');
    const lexerDiagnostics = doc.parseResult.lexerReport?.diagnostics ?? [];
    const hasCodeFormat = lexerDiagnostics.some((d) =>
      /\[LOFI_[A-Z]+_\d{3}\]/.test(d.message),
    );
    expect(hasCodeFormat).toBe(true);
  });

  it("includes suggestion in error message", async () => {
    const doc = await parseWithDiagnostics('card\n\theading "Title"');
    const lexerDiagnostics = doc.parseResult.lexerReport?.diagnostics ?? [];
    const hasSuggestion = lexerDiagnostics.some(
      (d) =>
        d.message.includes("Replace") ||
        d.message.includes("Use") ||
        d.message.includes("Check"),
    );
    expect(hasSuggestion).toBe(true);
  });
});

describe("lofi validation - valid input", () => {
  it("parses valid lofi without errors", async () => {
    const validLofi = `card
  heading "Login"
  input "Email" type="email"
  input "Password" type="password"
  button "Sign In" primary`;

    const doc = await parseWithDiagnostics(validLofi);
    expect(doc.parseResult.parserErrors).toHaveLength(0);
    expect(doc.parseResult.lexerErrors).toHaveLength(0);
  });

  it("parses nested elements", async () => {
    const nestedLofi = `page "Dashboard"
  section
    card
      heading "Stats"
      text "Some content"`;

    const doc = await parseWithDiagnostics(nestedLofi);
    expect(doc.parseResult.parserErrors).toHaveLength(0);
    expect(doc.parseResult.lexerErrors).toHaveLength(0);
  });
});
