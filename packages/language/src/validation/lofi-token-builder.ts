/**
 * Custom token builder for lofi with enhanced indentation error messages.
 *
 * Wraps Chevrotain lexer errors with LOFI_* codes and suggestions.
 * Detects tabs, mixed whitespace, and non-2-space indentation.
 */

import type { LexingDiagnostic } from "langium";
import {
  IndentationAwareTokenBuilder,
  type IndentationLexingReport,
} from "langium";
import { ErrorCodes, formatErrorMessage } from "./errors.js";

export class LofiTokenBuilder extends IndentationAwareTokenBuilder {
  override flushLexingReport(text: string): IndentationLexingReport {
    const report = super.flushLexingReport(text);

    report.diagnostics = report.diagnostics.map((diagnostic) =>
      this.transformDiagnostic(diagnostic),
    );

    const additionalDiagnostics = this.detectIndentationIssues(text);
    report.diagnostics.push(...additionalDiagnostics);

    return report;
  }

  private transformDiagnostic(diagnostic: LexingDiagnostic): LexingDiagnostic {
    if (diagnostic.message.includes("Invalid dedent level")) {
      return {
        ...diagnostic,
        message: formatErrorMessage(ErrorCodes.LOFI_INDENT_004),
      };
    }
    return diagnostic;
  }

  private detectIndentationIssues(text: string): LexingDiagnostic[] {
    const diagnostics: LexingDiagnostic[] = [];
    const lines = text.split(/\r\n|\r|\n/);
    let offset = 0;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const leadingWhitespace = line.match(/^[\t ]*/)?.[0] ?? "";

      if (leadingWhitespace.length > 0) {
        const hasTabs = leadingWhitespace.includes("\t");
        const hasSpaces = leadingWhitespace.includes(" ");

        if (hasTabs && hasSpaces) {
          diagnostics.push({
            severity: "error",
            message: formatErrorMessage(ErrorCodes.LOFI_INDENT_003),
            offset: offset,
            length: leadingWhitespace.length,
            line: lineNum + 1,
            column: 1,
          });
        } else if (hasTabs) {
          diagnostics.push({
            severity: "error",
            message: formatErrorMessage(ErrorCodes.LOFI_INDENT_002),
            offset: offset,
            length: leadingWhitespace.length,
            line: lineNum + 1,
            column: 1,
          });
        } else if (hasSpaces && leadingWhitespace.length % 2 !== 0) {
          diagnostics.push({
            severity: "error",
            message: formatErrorMessage(
              ErrorCodes.LOFI_INDENT_001,
              `found ${leadingWhitespace.length} spaces`,
            ),
            offset: offset,
            length: leadingWhitespace.length,
            line: lineNum + 1,
            column: 1,
          });
        }
      }

      offset += line.length + 1;
    }

    return diagnostics;
  }
}
