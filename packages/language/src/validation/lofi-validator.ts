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
import type {
  Element,
  HtmlBlock,
  LofiAstType,
  MdBlock,
} from "../generated/ast.js";
import { ELEMENT_SCHEMAS } from "./element-schema.js";
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
        : "Valid icons include: heart, rocket, shield, inbox, info, warning...";

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

  checkRequiredContent(element: Element, accept: ValidationAcceptor): void {
    const schema = ELEMENT_SCHEMAS[element.keyword];
    if (!schema) return;

    if (schema.requiresContent && !element.content) {
      const meta = ErrorMeta[ErrorCodes.LOFI_SYNTAX_002];
      accept(
        "error",
        formatErrorMessage(
          ErrorCodes.LOFI_SYNTAX_002,
          `'${element.keyword}' requires content`,
        ),
        {
          node: element,
          property: "keyword",
          code: ErrorCodes.LOFI_SYNTAX_002,
          data: {
            code: ErrorCodes.LOFI_SYNTAX_002,
            suggestion: meta.suggestion,
            example: meta.example,
          },
        },
      );
    }
  }

  checkValidAttributes(element: Element, accept: ValidationAcceptor): void {
    const schema = ELEMENT_SCHEMAS[element.keyword];
    if (!schema) return;

    for (const attr of element.attrs) {
      const attrName = attr.name.replace(/=$/, "");

      if (attrName === "name" && element.keyword === "icon") {
        continue;
      }

      if (!schema.validAttrs.has(attrName)) {
        const validList = Array.from(schema.validAttrs.keys());
        const hint =
          validList.length > 0
            ? `Valid: ${validList.join(", ")}`
            : "No attributes allowed";

        accept(
          "error",
          formatErrorMessage(
            ErrorCodes.LOFI_SYNTAX_003,
            `'${attrName}' for '${element.keyword}'. ${hint}`,
          ),
          {
            node: attr,
            property: "name",
            code: ErrorCodes.LOFI_SYNTAX_003,
            data: {
              code: ErrorCodes.LOFI_SYNTAX_003,
              invalidAttr: attrName,
              element: element.keyword,
            },
          },
        );
      }
    }
  }

  checkAttributeValues(element: Element, accept: ValidationAcceptor): void {
    const schema = ELEMENT_SCHEMAS[element.keyword];
    if (!schema) return;

    for (const attr of element.attrs) {
      const attrName = attr.name.replace(/=$/, "");
      const attrSchema = schema.validAttrs.get(attrName);
      if (!attrSchema) continue;

      const value = attr.value.replace(/^"|"$/g, "");

      if (attrSchema.type === "enum" && attrSchema.values) {
        if (!attrSchema.values.includes(value)) {
          accept(
            "error",
            formatErrorMessage(
              ErrorCodes.LOFI_ATTR_002,
              `'${value}' for '${attrName}'. Expected: ${attrSchema.values.join(", ")}`,
            ),
            {
              node: attr,
              property: "value",
              code: ErrorCodes.LOFI_ATTR_002,
              data: {
                code: ErrorCodes.LOFI_ATTR_002,
                invalidValue: value,
                validValues: attrSchema.values,
              },
            },
          );
        }
      }

      if (attrSchema.type === "number") {
        const num = Number.parseInt(value, 10);
        const outOfRange =
          Number.isNaN(num) ||
          (attrSchema.min !== undefined && num < attrSchema.min) ||
          (attrSchema.max !== undefined && num > attrSchema.max);

        if (outOfRange) {
          const range =
            attrSchema.min !== undefined && attrSchema.max !== undefined
              ? `${attrSchema.min}-${attrSchema.max}`
              : attrSchema.min !== undefined
                ? `>= ${attrSchema.min}`
                : `<= ${attrSchema.max}`;

          accept(
            "error",
            formatErrorMessage(
              ErrorCodes.LOFI_ATTR_002,
              `'${value}' for '${attrName}'. Expected number in range ${range}`,
            ),
            {
              node: attr,
              property: "value",
              code: ErrorCodes.LOFI_ATTR_002,
              data: {
                code: ErrorCodes.LOFI_ATTR_002,
                invalidValue: value,
                range,
              },
            },
          );
        }
      }
    }
  }

  checkDuplicateAttributes(element: Element, accept: ValidationAcceptor): void {
    const seen = new Map<string, boolean>();

    for (const attr of element.attrs) {
      const attrName = attr.name.replace(/=$/, "");

      if (seen.has(attrName)) {
        accept(
          "error",
          formatErrorMessage(ErrorCodes.LOFI_ATTR_003, `'${attrName}'`),
          {
            node: attr,
            property: "name",
            code: ErrorCodes.LOFI_ATTR_003,
            data: {
              code: ErrorCodes.LOFI_ATTR_003,
              duplicateAttr: attrName,
            },
          },
        );
      } else {
        seen.set(attrName, true);
      }
    }
  }

  checkEmptyMdBlock(block: MdBlock, accept: ValidationAcceptor): void {
    const content = block.lines.join("\n").trim();
    if (!content) {
      accept("error", formatErrorMessage(ErrorCodes.LOFI_BLOCK_001, "md"), {
        node: block,
        code: ErrorCodes.LOFI_BLOCK_001,
        data: {
          code: ErrorCodes.LOFI_BLOCK_001,
          blockType: "md",
        },
      });
    }
  }

  checkEmptyHtmlBlock(block: HtmlBlock, accept: ValidationAcceptor): void {
    const content = block.lines.join("\n").trim();
    if (!content) {
      accept("error", formatErrorMessage(ErrorCodes.LOFI_BLOCK_001, "html"), {
        node: block,
        code: ErrorCodes.LOFI_BLOCK_001,
        data: {
          code: ErrorCodes.LOFI_BLOCK_001,
          blockType: "html",
        },
      });
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
    Element: [
      validator.checkValidKeyword.bind(validator),
      validator.checkValidIconName.bind(validator),
      validator.checkRequiredContent.bind(validator),
      validator.checkValidAttributes.bind(validator),
      validator.checkAttributeValues.bind(validator),
      validator.checkDuplicateAttributes.bind(validator),
    ],
    MdBlock: [validator.checkEmptyMdBlock.bind(validator)],
    HtmlBlock: [validator.checkEmptyHtmlBlock.bind(validator)],
  };
  registry.register(checks, validator);
}
