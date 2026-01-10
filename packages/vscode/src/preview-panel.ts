import { generate } from "@lofi.md/html";
import { parse } from "@lofi.md/language";
import * as vscode from "vscode";

let currentPanel: LofiPreviewPanel | undefined;
let debounceTimer: NodeJS.Timeout | undefined;

export class LofiPreviewPanel {
  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];
  private currentDocument: vscode.TextDocument | undefined;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  static createOrShow(extensionUri: vscode.Uri): LofiPreviewPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    if (currentPanel) {
      currentPanel.panel.reveal(column);
      return currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "lofiPreview",
      "lofi Preview",
      column,
      {
        enableScripts: false,
        localResourceRoots: [extensionUri],
      },
    );

    currentPanel = new LofiPreviewPanel(panel, extensionUri);
    return currentPanel;
  }

  static getCurrent(): LofiPreviewPanel | undefined {
    return currentPanel;
  }

  async update(document: vscode.TextDocument): Promise<void> {
    this.currentDocument = document;
    const source = document.getText();

    try {
      const doc = await parse(source);
      const content = generate(doc);
      this.panel.webview.html = this.wrapHtml(content);
    } catch (error) {
      this.panel.webview.html = this.wrapHtml(
        `<div class="text-lofi-error font-hand p-4">
          <h2 class="font-sketch text-xl mb-2">Parse Error</h2>
          <pre class="bg-lofi-muted p-2 rounded-lofi text-sm">${escapeHtml(
            String(error),
          )}</pre>
        </div>`,
      );
    }
  }

  private getStylesheetUri(): vscode.Uri {
    return this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist", "lofi.css"),
    );
  }

  private wrapHtml(content: string): string {
    const styleUri = this.getStylesheetUri();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource} https://fonts.googleapis.com; font-src https://fonts.gstatic.com;">
  <title>lofi Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet">
  <link href="${styleUri}" rel="stylesheet">
</head>
<body class="bg-lofi-bg p-4 font-hand text-lofi">
  ${content}
</body>
</html>`;
  }

  private dispose(): void {
    currentPanel = undefined;
    this.panel.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}

export function updatePreviewDebounced(document: vscode.TextDocument): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const delay = vscode.workspace
    .getConfiguration("lofi.preview")
    .get<number>("refreshDelay", 100);

  debounceTimer = setTimeout(() => {
    const panel = LofiPreviewPanel.getCurrent();
    if (panel) {
      panel.update(document);
    }
  }, delay);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
