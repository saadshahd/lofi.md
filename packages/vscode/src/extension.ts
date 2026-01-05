import * as vscode from "vscode";
import { LofiCodeActionProvider } from "./code-actions.js";
import { createLanguageClient, stopLanguageClient } from "./language-client.js";
import { LofiPreviewPanel, updatePreviewDebounced } from "./preview-panel.js";

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const client = createLanguageClient(context);
  await client.start();

  context.subscriptions.push(
    vscode.commands.registerCommand("lofi.preview.open", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "lofi") {
        const panel = LofiPreviewPanel.createOrShow(context.extensionUri);
        panel.update(editor.document);
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lofi.preview.openToSide", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "lofi") {
        const panel = LofiPreviewPanel.createOrShow(context.extensionUri);
        panel.update(editor.document);
      }
    }),
  );

  const autoRefresh = vscode.workspace
    .getConfiguration("lofi.preview")
    .get<boolean>("autoRefresh", true);

  if (autoRefresh) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "lofi") {
          updatePreviewDebounced(event.document);
        }
      }),
    );
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === "lofi") {
        const panel = LofiPreviewPanel.getCurrent();
        if (panel) {
          panel.update(editor.document);
        }
      }
    }),
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: "lofi" },
      new LofiCodeActionProvider(),
      {
        providedCodeActionKinds: LofiCodeActionProvider.providedCodeActionKinds,
      },
    ),
  );
}

export async function deactivate(): Promise<void> {
  await stopLanguageClient();
}
