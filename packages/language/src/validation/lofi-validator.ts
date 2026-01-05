/**
 * AST validator for lofi DSL.
 *
 * This validator runs on the parsed AST and checks for semantic errors.
 * Currently minimal - handles cases where error recovery produces Elements
 * with invalid keywords.
 */

import { distance } from "fastest-levenshtein";
import type {
  ValidationAcceptor,
  ValidationChecks,
  ValidationRegistry,
} from "langium";
import type { Element, LofiAstType } from "../generated/ast.js";
import {
  ErrorCodes,
  ErrorMeta,
  VALID_KEYWORDS,
  formatErrorMessage,
} from "./errors.js";
import { VALID_ICON_NAMES } from "./icon-names.js";

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

  checkValidIconName(element: Element, accept: ValidationAcceptor): void {
    if (element.keyword !== "icon") return;

    const nameAttr = element.attrs?.find((a) => a.name === "name");
    const iconName = nameAttr?.value?.replace(/"/g, "");

    if (iconName && !VALID_ICON_NAMES.has(iconName)) {
      const suggestion = this.findIconSuggestion(iconName);
      const hint = suggestion
        ? `Did you mean "${suggestion}"?`
        : `Valid icons include: heart, rocket, shield, inbox, info, warning...`;

      accept(
        "error",
        formatErrorMessage(ErrorCodes.LOFI_ATTR_001, `'${iconName}'. ${hint}`),
        {
          node: element,
          property: "attrs",
          code: ErrorCodes.LOFI_ATTR_001,
          data: {
            code: ErrorCodes.LOFI_ATTR_001,
            invalidIconName: iconName,
            suggestedName: suggestion,
          },
        },
      );
    }
  }

  private findIconSuggestion(invalid: string): string | null {
    let closest = "";
    let minDist = Number.POSITIVE_INFINITY;
    for (const valid of VALID_ICON_NAMES) {
      const dist = distance(invalid, valid);
      if (dist < minDist && dist <= 2) {
        minDist = dist;
        closest = valid;
      }
    }
    return closest || null;
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
    Element: [
      validator.checkValidKeyword.bind(validator),
      validator.checkValidIconName.bind(validator),
    ],
  };
  registry.register(checks, validator);
}
