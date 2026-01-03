import type { AstNode } from "langium";

/**
 * Recursively strips Langium internal metadata from AST nodes,
 * keeping only semantic properties for stable snapshot testing.
 *
 * Keeps: $type, keyword, content, attrs, children, lines, name, value
 * Strips: $container, $cstNode, $document, and other $ prefixed internals
 */
export function toCleanAST(node: unknown): unknown {
  if (node === null || node === undefined) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(toCleanAST);
  }

  if (typeof node !== "object") {
    return node;
  }

  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key.startsWith("$") && key !== "$type") {
      continue;
    }
    clean[key] = toCleanAST(value);
  }

  return clean;
}
