/**
 * Custom document validator for lofi that provides enhanced error messages.
 *
 * Extends Langium's DefaultDocumentValidator to:
 * 1. Detect unknown keywords in parser errors and report LOFI_SYNTAX_001
 * 2. Add structured error data for future quick-fix support
 */

import type { IToken, MismatchedTokenException } from "chevrotain";
import type { LangiumCoreServices, ParseResult } from "langium";
import { DefaultDocumentValidator } from "langium";
import type {
  Diagnostic,
  DiagnosticSeverity,
  Range,
} from "vscode-languageserver-types";
import {
  ErrorCodes,
  ErrorMeta,
  type LofiErrorCode,
  VALID_KEYWORDS,
  formatErrorMessage,
} from "./errors.js";

export type { ValidationOptions } from "langium";

const DiagnosticSeverityError: DiagnosticSeverity = 1;

interface EnhancedErrorData {
  code: LofiErrorCode | "parsing-error";
  suggestion?: string;
  example?: string;
  invalidKeyword?: string;
}

interface EnhancedError {
  message: string;
  code?: LofiErrorCode | "parsing-error";
  data?: EnhancedErrorData;
}

function tokenToRange(token: IToken): Range {
  return {
    start: {
      character: token.startColumn! - 1,
      line: token.startLine! - 1,
    },
    end: {
      character: token.endColumn!,
      line: token.endLine! - 1,
    },
  };
}

export class LofiDocumentValidator extends DefaultDocumentValidator {
  constructor(services: LangiumCoreServices) {
    super(services);
  }

  protected override processParsingErrors(
    parseResult: ParseResult,
    diagnostics: Diagnostic[],
    _options: unknown,
  ): void {
    for (const parserError of parseResult.parserErrors) {
      let range: Range | undefined = undefined;

      // Handle error recovery where token positions might be NaN
      if (isNaN(parserError.token.startOffset)) {
        if ("previousToken" in parserError) {
          const token = (parserError as MismatchedTokenException).previousToken;
          if (!isNaN(token.startOffset)) {
            range = {
              start: { line: token.endLine! - 1, character: token.endColumn! },
              end: { line: token.endLine! - 1, character: token.endColumn! },
            };
          } else {
            range = {
              start: { line: 0, character: 0 },
              end: { line: 0, character: 0 },
            };
          }
        }
      } else {
        range = tokenToRange(parserError.token);
      }

      if (range) {
        // Try to enhance the error message
        const enhanced = this.enhanceParserError(parserError);
        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverityError,
          range,
          message: enhanced.message,
          code: enhanced.code,
          data: enhanced.data,
          source: this.getSource(),
        };
        diagnostics.push(diagnostic);
      }
    }
  }

  /**
   * Enhance a parser error with LOFI error codes and suggestions.
   */
  private enhanceParserError(parserError: {
    message: string;
    token: { image?: string };
  }): EnhancedError {
    const { message, token } = parserError;
    const tokenImage = token?.image;

    // Check if this looks like an unknown keyword
    if (tokenImage && this.isLowercaseIdentifier(tokenImage)) {
      if (!VALID_KEYWORDS.has(tokenImage)) {
        const meta = ErrorMeta[ErrorCodes.LOFI_SYNTAX_001];
        return {
          message: formatErrorMessage(
            ErrorCodes.LOFI_SYNTAX_001,
            `'${tokenImage}'`,
          ),
          code: ErrorCodes.LOFI_SYNTAX_001,
          data: {
            code: ErrorCodes.LOFI_SYNTAX_001,
            suggestion: meta.suggestion,
            example: meta.example,
            invalidKeyword: tokenImage,
          },
        };
      }
    }

    // Check if error message indicates expecting KEYWORD
    if (
      message.includes("Expecting: one of these possible Token sequences") ||
      message.includes("KEYWORD")
    ) {
      // Try to extract what was found
      const foundMatch = message.match(/but found: '([^']+)'/);
      const found = foundMatch?.[1];
      if (
        found &&
        this.isLowercaseIdentifier(found) &&
        !VALID_KEYWORDS.has(found)
      ) {
        const meta = ErrorMeta[ErrorCodes.LOFI_SYNTAX_001];
        return {
          message: formatErrorMessage(ErrorCodes.LOFI_SYNTAX_001, `'${found}'`),
          code: ErrorCodes.LOFI_SYNTAX_001,
          data: {
            code: ErrorCodes.LOFI_SYNTAX_001,
            suggestion: meta.suggestion,
            example: meta.example,
            invalidKeyword: found,
          },
        };
      }
    }

    // Return original message with parsing error code
    return {
      message,
      code: "parsing-error",
      data: { code: "parsing-error" },
    };
  }

  private isLowercaseIdentifier(text: string): boolean {
    return /^[a-z][a-z0-9]*$/.test(text);
  }
}
