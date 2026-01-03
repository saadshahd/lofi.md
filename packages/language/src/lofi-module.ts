import {
  type Module,
  type LangiumCoreServices,
  type PartialLangiumCoreServices,
  IndentationAwareTokenBuilder,
  IndentationAwareLexer,
} from "langium";

/**
 * Custom module for lofi language that enables indentation-sensitive parsing.
 * This registers the IndentationAwareTokenBuilder which injects synthetic
 * INDENT/DEDENT tokens based on whitespace changes.
 */
export const LofiModule: Module<
  LangiumCoreServices,
  PartialLangiumCoreServices
> = {
  parser: {
    TokenBuilder: () => new IndentationAwareTokenBuilder(),
    Lexer: (services) => new IndentationAwareLexer(services),
  },
};
