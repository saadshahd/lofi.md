import type {
  LangiumCoreServices,
  Module,
  PartialLangiumCoreServices,
} from "langium";
import { LofiLexer } from "./lofi-lexer.js";
import { LofiDocumentValidator } from "./validation/lofi-document-validator.js";
import { LofiTokenBuilder } from "./validation/lofi-token-builder.js";
import {
  LofiValidator,
  registerLofiValidation,
} from "./validation/lofi-validator.js";

/**
 * Custom module for lofi language that enables:
 * - Indentation-sensitive parsing via LofiTokenBuilder
 * - Enhanced error messages with LOFI_* error codes via LofiLexer
 * - Semantic validation of Element keywords
 */
export const LofiModule: Module<
  LangiumCoreServices,
  PartialLangiumCoreServices
> = {
  parser: {
    TokenBuilder: () => new LofiTokenBuilder(),
    Lexer: (services) => new LofiLexer(services),
  },
  validation: {
    DocumentValidator: (services) => new LofiDocumentValidator(services),
  },
};

/**
 * Register lofi AST validation checks.
 * Call this after creating services to enable semantic validation.
 */
export function registerLofiValidationChecks(
  services: LangiumCoreServices,
): void {
  const registry = services.validation.ValidationRegistry;
  const validator = new LofiValidator();
  registerLofiValidation(registry, validator);
}
