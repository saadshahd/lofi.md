import type { Attribute, Element } from "@lofi.md/language";

export function getAttr(attrs: Attribute[], name: string): string | undefined {
  return attrs.find((a) => a.name === name)?.value;
}

/**
 * Check if a boolean attribute is truthy.
 * Truthy values: "1", "true", "yes"
 * Falsy: undefined, "0", "false", "no", or any other value
 */
export function hasAttr(attrs: Attribute[], name: string): boolean {
  const value = getAttr(attrs, name);
  return value === "1" || value === "true" || value === "yes";
}

export function escapeHtml(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stripQuotes(s: string | undefined): string {
  if (!s) return "";
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}
