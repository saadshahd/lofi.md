import { describe, expect, it } from "vitest";
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
  it("rejects unknown keywords via validation", async () => {
    // Grammar accepts any ID, validator catches unknown keywords
    const doc = await parseWithDiagnostics("unknownelement");
    expect(doc.parseResult.parserErrors).toHaveLength(0);
    // Validation should flag unknown keyword
    const validator = (await import("../index.js")).services.Lofi.validation
      .DocumentValidator;
    const diagnostics = await validator.validateDocument(doc);
    const hasUnknownKeyword = diagnostics.some(
      (d) =>
        d.message.includes("LOFI_SYNTAX_001") ||
        d.message.includes("Unknown element"),
    );
    expect(hasUnknownKeyword).toBe(true);
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
  input "Email" type=email
  input "Password" type=password
  button "Sign In" variant=primary`;

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

async function getValidationDiagnostics(input: string) {
  const doc = await parseWithDiagnostics(input);
  const { services } = await import("../index.js");
  const validator = services.Lofi.validation.DocumentValidator;
  return validator.validateDocument(doc);
}

describe("LOFI_SYNTAX_002 - missing content", () => {
  it("errors on button without label", async () => {
    const diagnostics = await getValidationDiagnostics(
      "button variant=primary",
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_002"),
    );
    expect(hasError).toBe(true);
  });

  it("errors on heading without text", async () => {
    const diagnostics = await getValidationDiagnostics("heading level=2");
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_002"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts card without content", async () => {
    const diagnostics = await getValidationDiagnostics("card");
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_002"),
    );
    expect(hasError).toBe(false);
  });

  it("accepts icon without content", async () => {
    const diagnostics = await getValidationDiagnostics("icon name=heart");
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_002"),
    );
    expect(hasError).toBe(false);
  });
});

describe("LOFI_SYNTAX_003 - invalid attribute", () => {
  it("errors on unknown attribute for button", async () => {
    const diagnostics = await getValidationDiagnostics('button "Save" foo=bar');
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_003"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts valid attribute for button", async () => {
    const diagnostics = await getValidationDiagnostics(
      'button "Save" variant=primary',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_003"),
    );
    expect(hasError).toBe(false);
  });

  it("errors on unknown attribute for card", async () => {
    const diagnostics = await getValidationDiagnostics("card unknown=value");
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_SYNTAX_003"),
    );
    expect(hasError).toBe(true);
  });
});

describe("LOFI_ATTR_002 - invalid attribute value", () => {
  it("errors on invalid enum value for button variant", async () => {
    const diagnostics = await getValidationDiagnostics(
      'button "Save" variant=invalid',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_002"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts valid enum value for button variant", async () => {
    const diagnostics = await getValidationDiagnostics(
      'button "Save" variant=danger',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_002"),
    );
    expect(hasError).toBe(false);
  });

  it("errors on out-of-range number for heading level", async () => {
    const diagnostics = await getValidationDiagnostics(
      'heading "Title" level=10',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_002"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts valid number for heading level", async () => {
    const diagnostics = await getValidationDiagnostics(
      'heading "Title" level=3',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_002"),
    );
    expect(hasError).toBe(false);
  });

  it("errors on invalid input type", async () => {
    const diagnostics = await getValidationDiagnostics(
      'input "Name" type=invalid',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_002"),
    );
    expect(hasError).toBe(true);
  });
});

describe("LOFI_ATTR_003 - duplicate attribute", () => {
  it("errors on duplicate attribute", async () => {
    const diagnostics = await getValidationDiagnostics(
      'button "Save" disabled=1 disabled=0',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_003"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts unique attributes", async () => {
    const diagnostics = await getValidationDiagnostics(
      'button "Save" variant=primary disabled=1',
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_ATTR_003"),
    );
    expect(hasError).toBe(false);
  });
});

describe("LOFI_BLOCK_001 - empty block", () => {
  it("errors on empty md block", async () => {
    const diagnostics = await getValidationDiagnostics("card\n  md\n    ");
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_BLOCK_001"),
    );
    expect(hasError).toBe(true);
  });

  it("accepts md block with content", async () => {
    const diagnostics = await getValidationDiagnostics(
      "card\n  md\n    **Bold text**",
    );
    const hasError = diagnostics.some((d) =>
      d.message.includes("LOFI_BLOCK_001"),
    );
    expect(hasError).toBe(false);
  });
});
