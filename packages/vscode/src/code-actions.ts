import * as vscode from "vscode";

/**
 * CodeActionProvider for lofi diagnostics.
 *
 * Provides quick fixes based on error metadata from Langium validation.
 * Error data includes: code, suggestion, example, and type-specific hints.
 */
export class LofiCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (!diagnostic.code) continue;

      const code = String(diagnostic.code);
      if (!code.startsWith("LOFI_")) continue;

      const data = (diagnostic as { data?: unknown }).data as
        | Record<string, unknown>
        | undefined;

      if (code === "LOFI_ATTR_001" && data?.suggestedName) {
        actions.push(
          this.createIconFixAction(
            document,
            diagnostic,
            data.invalidIconName as string,
            data.suggestedName as string,
          ),
        );
      }

      if (data?.suggestion) {
        actions.push(
          this.createShowSuggestionAction(
            diagnostic,
            data.suggestion as string,
          ),
        );
      }
    }

    return actions;
  }

  private createIconFixAction(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
    invalidName: string,
    suggestedName: string,
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `Replace '${invalidName}' with '${suggestedName}'`,
      vscode.CodeActionKind.QuickFix,
    );

    action.diagnostics = [diagnostic];
    action.isPreferred = true;

    const edit = new vscode.WorkspaceEdit();
    const line = document.lineAt(diagnostic.range.start.line);
    const lineText = line.text;

    const newText = lineText.replace(
      new RegExp(`name="${invalidName}"`),
      `name="${suggestedName}"`,
    );

    edit.replace(document.uri, line.range, newText);
    action.edit = edit;

    return action;
  }

  private createShowSuggestionAction(
    diagnostic: vscode.Diagnostic,
    suggestion: string,
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `ℹ️ ${suggestion}`,
      vscode.CodeActionKind.QuickFix,
    );

    action.diagnostics = [diagnostic];
    action.isPreferred = false;

    return action;
  }
}
