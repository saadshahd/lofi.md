/**
 * AST validator for lofi DSL.
 *
 * This validator runs on the parsed AST and checks for semantic errors.
 * Currently minimal - handles cases where error recovery produces Elements
 * with invalid keywords.
 */

import type {
  ValidationAcceptor,
  ValidationChecks,
  ValidationRegistry,
} from "langium";
import type { LofiAstType, Element } from "../generated/ast.js";
import {
  ErrorCodes,
  ErrorMeta,
  VALID_KEYWORDS,
  formatErrorMessage,
} from "./errors.js";

/**
 * Validator class for lofi DSL.
 *
 * Registered checks run on each AST node of the corresponding type.
 */
export class LofiValidator {
  /**
   * Check that Element keywords are valid.
   *
   * This catches cases where error recovery produces Elements with
   * keywords that don't match the grammar's KEYWORD terminal.
   */
  checkValidKeyword(element: Element, accept: ValidationAcceptor): void {
    if (element.keyword && !VALID_KEYWORDS.has(element.keyword)) {
      const meta = ErrorMeta[ErrorCodes.LOFI_SYNTAX_001];
      accept(
        "error",
        formatErrorMessage(ErrorCodes.LOFI_SYNTAX_001, `'${element.keyword}'`),
        {
          node: element,
          property: "keyword",
          code: ErrorCodes.LOFI_SYNTAX_001,
          data: {
            code: ErrorCodes.LOFI_SYNTAX_001,
            suggestion: meta.suggestion,
            example: meta.example,
            invalidKeyword: element.keyword,
          },
        },
      );
    }
  }
}

/**
 * Register lofi validation checks with the validation registry.
 *
 * @param registry The Langium ValidationRegistry
 * @param validator Instance of LofiValidator
 */
export function registerLofiValidation(
  registry: ValidationRegistry,
  validator: LofiValidator,
): void {
  const checks: ValidationChecks<LofiAstType> = {
    Element: validator.checkValidKeyword,
  };
  registry.register(checks, validator);
}
