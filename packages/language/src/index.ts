import {
  inject,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  type LangiumCoreServices,
  type LangiumSharedCoreServices,
  EmptyFileSystem,
} from "langium";
import { parseHelper } from "langium/test";
import {
  LofiGeneratedModule,
  LofiGeneratedSharedModule,
} from "./generated/module.js";
import { LofiModule } from "./lofi-module.js";
import type {
  Document,
  Element,
  Attribute,
  MdBlock,
  HtmlBlock,
} from "./generated/ast.js";

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
 * Uses IndentationAwareTokenBuilder for Python-style indentation.
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
  const errors = doc.parseResult.parserErrors;

  if (errors.length > 0) {
    const errorMessages = errors
      .map((e) => `Line ${e.token.startLine ?? "?"}: ${e.message}`)
      .join("\n");
    throw new Error(`Parse errors:\n${errorMessages}`);
  }

  return doc.parseResult.value;
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
