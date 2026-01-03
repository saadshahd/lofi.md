/**
 * lofi Error Taxonomy
 *
 * Error codes follow the pattern: LOFI_[CATEGORY]_[NUMBER]
 * Categories: INDENT, SYNTAX, ATTR, BLOCK
 */

export const ErrorCodes = {
  LOFI_INDENT_001: "LOFI_INDENT_001",
  LOFI_INDENT_002: "LOFI_INDENT_002",
  LOFI_INDENT_003: "LOFI_INDENT_003",
  LOFI_INDENT_004: "LOFI_INDENT_004",
  LOFI_SYNTAX_001: "LOFI_SYNTAX_001",
} as const;

export type LofiErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Structured error with code, message, and helpful context.
 * Designed to support LSP quick-fixes via suggestion/example fields.
 */
export interface LofiError {
  code: LofiErrorCode;
  message: string;
  line: number;
  column: number;
  length?: number;
  suggestion?: string;
  example?: string;
}

/**
 * Error metadata providing suggestions and examples for each error code.
 * Used to enrich error messages and support future quick-fix generation.
 */
export const ErrorMeta: Record<
  LofiErrorCode,
  { message: string; suggestion: string; example: string }
> = {
  LOFI_INDENT_001: {
    message: "Expected 2-space indentation",
    suggestion: "Use exactly 2 spaces for each nesting level",
    example: 'card\n  heading "Title"',
  },
  LOFI_INDENT_002: {
    message: "Tab characters not allowed",
    suggestion: "Replace tabs with 2 spaces",
    example: 'card\n  button "Save"',
  },
  LOFI_INDENT_003: {
    message: "Mixed spaces and tabs",
    suggestion: "Use only 2-space indentation, no tabs",
    example: 'card\n  heading "Title"\n  text "Content"',
  },
  LOFI_INDENT_004: {
    message: "Invalid indentation level",
    suggestion: "Check parent element nesting - each level is 2 spaces",
    example: 'card\n  heading "Title"\ncard\n  text "Another"',
  },
  LOFI_SYNTAX_001: {
    message: "Unknown element",
    suggestion:
      "Valid elements: page, section, card, grid, modal, nav, tabs, menu, form, alert, breadcrumb, button, input, checkbox, radio, dropdown, textarea, link, tab, accordion, toggle, slider, heading, text, image, icon, badge, toast, avatar, progress, chart",
    example: 'card\n  heading "Title"\n  button "Save"',
  },
};

/**
 * All valid lofi keywords (31 total).
 * SYNC: Must match KEYWORD terminal in lofi.langium
 */
const KEYWORDS = [
  // Containers (11)
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
  // Controls (11)
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
  // Content (9)
  "heading",
  "text",
  "image",
  "icon",
  "badge",
  "toast",
  "avatar",
  "progress",
  "chart",
] as const;

export type LofiKeyword = (typeof KEYWORDS)[number];
export const VALID_KEYWORDS: ReadonlySet<string> = new Set(KEYWORDS);

/**
 * Format an error message with code and suggestion.
 */
export function formatErrorMessage(
  code: LofiErrorCode,
  detail?: string,
): string {
  const meta = ErrorMeta[code];
  const base = detail ? `${meta.message}: ${detail}` : meta.message;
  return `[${code}] ${base}. ${meta.suggestion}`;
}
