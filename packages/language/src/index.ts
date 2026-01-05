import {
  EmptyFileSystem,
  type FileSystemProvider,
  type LangiumCoreServices,
  type LangiumSharedCoreServices,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
} from "langium";
import {
  type LangiumServices,
  type LangiumSharedServices,
  createDefaultModule,
  createDefaultSharedModule,
} from "langium/lsp";
import { parseHelper } from "langium/test";
import {
  type Attribute,
  type Document,
  type Element,
  type HtmlBlock,
  type MdBlock,
  isElement,
} from "./generated/ast.js";
import {
  LofiGeneratedModule,
  LofiGeneratedSharedModule,
} from "./generated/module.js";
import { LofiModule, registerLofiValidationChecks } from "./lofi-module.js";

// Re-export error types for consumers
export type { LofiError, LofiErrorCode } from "./validation/errors.js";
export { ErrorCodes, ErrorMeta, VALID_KEYWORDS } from "./validation/errors.js";

// Re-export AST types for consumers
export type {
  Document,
  Element,
  Attribute,
  MdBlock,
  HtmlBlock,
  TopLevelElement,
  ChildElement,
} from "./generated/ast.js";
export {
  isDocument,
  isElement,
  isAttribute,
  isMdBlock,
  isHtmlBlock,
} from "./generated/ast.js";

export type LofiServices = LangiumCoreServices;

/**
 * Create Langium services for the lofi language.
 *
 * Includes:
 * - LofiTokenBuilder for Python-style indentation with enhanced error messages
 * - LofiDocumentValidator for LOFI_* error codes
 * - LofiValidator for semantic AST validation
 */
export function createLofiServices(fileSystem = EmptyFileSystem): {
  shared: LangiumSharedCoreServices;
  Lofi: LofiServices;
} {
  const shared = inject(
    createDefaultSharedCoreModule(fileSystem),
    LofiGeneratedSharedModule,
  );
  const Lofi = inject(
    createDefaultCoreModule({ shared }),
    LofiGeneratedModule,
    LofiModule,
  );
  shared.ServiceRegistry.register(Lofi);

  // Register semantic validation checks
  registerLofiValidationChecks(Lofi);

  return { shared, Lofi };
}

// Default services instance for simple use cases
const services = createLofiServices();

/**
 * Parse a lofi document string into an AST.
 *
 * @param input - The lofi source code to parse
 * @returns The parsed Document AST node
 * @throws If the input contains syntax errors
 *
 * @example
 * ```ts
 * const doc = await parse(`
 * card
 *   heading "Hello"
 *   button "Click" primary
 * `);
 * console.log(doc.elements[0].keyword); // 'card'
 * ```
 */
export async function parse(input: string): Promise<Document> {
  const helper = parseHelper<Document>(services.Lofi);
  const doc = await helper(input);
  const parserErrors = doc.parseResult.parserErrors;
  const lexerErrors = doc.parseResult.lexerErrors;

  if (parserErrors.length > 0 || lexerErrors.length > 0) {
    const parserMessages = parserErrors.map(
      (e) => `Line ${e.token.startLine ?? "?"}: ${e.message}`,
    );
    const lexerMessages = lexerErrors.map(
      (e) => `Line ${e.line ?? "?"}: ${e.message}`,
    );
    throw new Error(
      `Parse errors:\n${[...parserMessages, ...lexerMessages].join("\n")}`,
    );
  }

  const result = doc.parseResult.value;
  normalizeAttrNames(result);
  return result;
}

function normalizeAttrNames(doc: Document): void {
  for (const el of doc.elements) {
    if (isElement(el)) {
      normalizeElement(el);
    }
  }
}

function normalizeElement(el: Element): void {
  for (const attr of el.attrs) {
    if (attr.name.endsWith("=")) {
      (attr as { name: string }).name = attr.name.slice(0, -1);
    }
  }
  for (const child of el.children) {
    if (isElement(child)) {
      normalizeElement(child);
    }
  }
}

/**
 * Parse a lofi document and return the full result including errors.
 * Useful for LSP and editor integrations that need error diagnostics.
 */
export async function parseWithDiagnostics(input: string) {
  const helper = parseHelper<Document>(services.Lofi);
  return helper(input);
}

export { services };

import type { DefaultSharedModuleContext } from "langium/lsp";
import type { Connection } from "vscode-languageserver";

export type LofiLSPContext = DefaultSharedModuleContext & {
  connection: Connection;
};

/**
 * Create Langium services with full LSP support for VS Code extension.
 *
 * Includes everything from createLofiServices plus:
 * - LSP Connection for client communication
 * - Completion, hover, diagnostics handlers
 * - Code actions for quick fixes
 */
export function createLofiLSPServices(context: LofiLSPContext): {
  shared: LangiumSharedServices;
  Lofi: LangiumServices;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    LofiGeneratedSharedModule,
  );
  const Lofi = inject(
    createDefaultModule({ shared }),
    LofiGeneratedModule,
    LofiModule,
  );
  shared.ServiceRegistry.register(Lofi);
  registerLofiValidationChecks(Lofi);

  return { shared, Lofi };
}
