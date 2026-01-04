import { describe, it, expect } from "vitest";
import {
  ErrorCodes,
  ErrorMeta,
  VALID_KEYWORDS,
  formatErrorMessage,
} from "./errors.js";

describe("error constants", () => {
  it("has 31 valid keywords matching grammar", () => {
    expect(VALID_KEYWORDS.size).toBe(31);
  });

  it("includes all container keywords", () => {
    const containers = [
      "page",
      "section",
      "card",
      "grid",
      "modal",
      "nav",
      "tabs",
      "menu",
      "form",
      "alert",
      "breadcrumb",
    ];
    for (const keyword of containers) {
      expect(VALID_KEYWORDS.has(keyword)).toBe(true);
    }
  });

  it("includes all control keywords", () => {
    const controls = [
      "button",
      "input",
      "checkbox",
      "radio",
      "dropdown",
      "textarea",
      "link",
      "tab",
      "accordion",
      "toggle",
      "slider",
    ];
    for (const keyword of controls) {
      expect(VALID_KEYWORDS.has(keyword)).toBe(true);
    }
  });

  it("includes all content keywords", () => {
    const content = [
      "heading",
      "text",
      "image",
      "icon",
      "badge",
      "toast",
      "avatar",
      "progress",
      "chart",
    ];
    for (const keyword of content) {
      expect(VALID_KEYWORDS.has(keyword)).toBe(true);
    }
  });

  it("has metadata for all error codes", () => {
    for (const code of Object.values(ErrorCodes)) {
      expect(ErrorMeta[code]).toBeDefined();
      expect(ErrorMeta[code].message).toBeTruthy();
      expect(ErrorMeta[code].suggestion).toBeTruthy();
      expect(ErrorMeta[code].example).toBeTruthy();
    }
  });

  it("has 6 error codes defined", () => {
    expect(Object.keys(ErrorCodes).length).toBe(6);
  });
});

describe("formatErrorMessage", () => {
  it("formats error with code and suggestion", () => {
    const message = formatErrorMessage(ErrorCodes.LOFI_INDENT_002);
    expect(message).toContain("[LOFI_INDENT_002]");
    expect(message).toContain("Tab characters not allowed");
    expect(message).toContain("Replace tabs with 2 spaces");
  });

  it("includes detail when provided", () => {
    const message = formatErrorMessage(
      ErrorCodes.LOFI_SYNTAX_001,
      "'unknownelement'",
    );
    expect(message).toContain("[LOFI_SYNTAX_001]");
    expect(message).toContain("'unknownelement'");
    expect(message).toContain("Unknown element");
  });
});
