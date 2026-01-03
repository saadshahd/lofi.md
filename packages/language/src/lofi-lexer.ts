/**
 * Custom lexer for lofi DSL.
 *
 * Implements post-lexer token collapsing for md/html blocks.
 *
 * Why? Content like `1. First item` inside md blocks would tokenize as NUMBER.
 * The canonical solution is lexer modes, but Langium's IndentationAwareLexer
 * doesn't expose mode control. This post-lexer pass is equivalent: find
 * `md/html INDENT ... DEDENT` sequences and collapse tokens into RAW_LINE.
 */

import type {
  LangiumCoreServices,
  LexerResult,
  TokenizeOptions,
} from "langium";
import { IndentationAwareLexer, DEFAULT_TOKENIZE_OPTIONS } from "langium";
import type { ILexingError, IToken, TokenType } from "chevrotain";

const RAW_BLOCK_KEYWORDS = new Set(["md", "html"]);

export class LofiLexer extends IndentationAwareLexer {
  override tokenize(
    text: string,
    options: TokenizeOptions = DEFAULT_TOKENIZE_OPTIONS,
  ): LexerResult {
    const result = super.tokenize(text, options);
    this.surfaceIndentErrors(result);
    result.tokens = this.collapseRawBlocks(result.tokens, text);
    return result;
  }

  private surfaceIndentErrors(result: LexerResult): void {
    const diagnostics = result.report?.diagnostics ?? [];
    const errors: ILexingError[] = diagnostics
      .filter((d) => d.severity === "error")
      .map((d) => ({
        offset: d.offset,
        length: d.length ?? 1,
        line: d.line ?? 1,
        column: d.column ?? 1,
        message: d.message,
      }));
    result.errors.push(...errors);
  }

  private getTokenType(name: string): TokenType | undefined {
    const lexer = this.chevrotainLexer as { lexerDefinition?: TokenType[] };
    return lexer.lexerDefinition?.find((t) => t.name === name);
  }

  /**
   * Find `md/html INDENT ... DEDENT` and collapse content into RAW_LINE tokens.
   */
  private collapseRawBlocks(tokens: IToken[], text: string): IToken[] {
    const rawLine = this.getTokenType("RAW_LINE");
    const dedent = this.getTokenType("DEDENT");
    if (!rawLine || !dedent) return tokens;

    const result: IToken[] = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (RAW_BLOCK_KEYWORDS.has(token.tokenType.name)) {
        const next = tokens[i + 1];
        if (next?.tokenType.name === "INDENT") {
          result.push(token, next);
          i += 2;
          const { end, content } = this.collectUntilDedent(tokens, i);
          result.push(...this.toRawLines(content, text, rawLine, dedent));
          i = end;
          continue;
        }
      }

      result.push(token);
      i++;
    }

    return result;
  }

  private collectUntilDedent(
    tokens: IToken[],
    start: number,
  ): { end: number; content: IToken[] } {
    const content: IToken[] = [];
    let depth = 1;
    let i = start;

    while (i < tokens.length && depth > 0) {
      const name = tokens[i].tokenType.name;
      if (name === "INDENT") depth++;
      else if (name === "DEDENT" && --depth === 0) break;
      content.push(tokens[i]);
      i++;
    }

    return { end: i + 1, content };
  }

  private toRawLines(
    tokens: IToken[],
    text: string,
    rawLineType: TokenType,
    dedentType: TokenType,
  ): IToken[] {
    const byLine = new Map<number, IToken[]>();

    for (const t of tokens) {
      if (t.tokenType.name === "INDENT" || t.tokenType.name === "DEDENT")
        continue;
      const line = t.startLine ?? 1;
      const group = byLine.get(line) ?? [];
      group.push(t);
      byLine.set(line, group);
    }

    const result: IToken[] = [];

    for (const [lineNum, lineTokens] of byLine) {
      const first = lineTokens[0];
      const last = lineTokens[lineTokens.length - 1];
      const start = first.startOffset;
      const end = (last.endOffset ?? last.startOffset) + 1;

      result.push({
        tokenType: rawLineType,
        tokenTypeIdx: rawLineType.tokenTypeIdx ?? 0,
        image: text.substring(start, end),
        startOffset: start,
        endOffset: end - 1,
        startLine: lineNum,
        endLine: lineNum,
        startColumn: first.startColumn ?? 1,
        endColumn: (last.endColumn ?? 1) + (last.image?.length ?? 0) - 1,
      });
    }

    const lastToken = tokens[tokens.length - 1];
    if (lastToken) {
      const offset = (lastToken.endOffset ?? lastToken.startOffset) + 1;
      result.push({
        tokenType: dedentType,
        tokenTypeIdx: dedentType.tokenTypeIdx ?? 0,
        image: "",
        startOffset: offset,
        endOffset: offset,
        startLine: lastToken.endLine ?? 1,
        endLine: lastToken.endLine ?? 1,
        startColumn: 1,
        endColumn: 1,
      });
    }

    return result;
  }
}
