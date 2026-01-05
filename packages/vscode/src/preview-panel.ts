import { SVG_WOBBLE_FILTER, generate } from "@lofi/html";
import { parse } from "@lofi/language";
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
          <pre class="bg-lofi-muted p-2 rounded-lofi text-sm">${escapeHtml(String(error))}</pre>
        </div>`,
      );
    }
  }

  private wrapHtml(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;">
  <title>lofi Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet">
  <style>
    ${getInlineStyles()}
  </style>
</head>
<body class="bg-lofi-bg p-4 font-hand text-lofi">
  ${SVG_WOBBLE_FILTER}
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

function getInlineStyles(): string {
  return `
    :root {
      --color-lofi: #2B2B2B;
      --color-lofi-bg: #FFFDF5;
      --color-lofi-muted: #F5F4EF;
      --color-lofi-placeholder: #7F8C8D;
      --color-lofi-text-muted: #7F8C8D;
      --color-lofi-border: #4A4A4A;
      --color-lofi-accent: #0984E3;
      --color-lofi-error: #C0392B;
      --color-lofi-success: #0A7A5C;
      --color-lofi-warning: #B45309;
      --font-sketch: 'Kalam', cursive;
      --font-hand: 'Kalam', cursive;
      --radius-lofi: 6px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--color-lofi-bg);
      color: var(--color-lofi);
      font-family: var(--font-hand);
      padding: 1rem;
      line-height: 1.6;
    }

    .font-hand { font-family: var(--font-hand); }
    .font-sketch { font-family: var(--font-sketch); font-weight: 700; }
    .bg-lofi-bg { background-color: var(--color-lofi-bg); }
    .bg-lofi-muted { background-color: var(--color-lofi-muted); }
    .text-lofi { color: var(--color-lofi); }
    .text-lofi-muted { color: var(--color-lofi-text-muted); }
    .text-lofi-error { color: var(--color-lofi-error); }
    .text-lofi-accent { color: var(--color-lofi-accent); }
    .text-lofi-success { color: var(--color-lofi-success); }
    .text-lofi-warning { color: var(--color-lofi-warning); }
    .border-lofi-border { border-color: var(--color-lofi-border); }
    .rounded-lofi { border-radius: var(--radius-lofi); }

    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .m-2 { margin: 0.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-4 { margin-top: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }

    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .grid { display: grid; }

    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-3xl { font-size: 1.875rem; }
    .font-bold { font-weight: 700; }

    .border { border-width: 1px; }
    .border-2 { border-width: 2px; }
    .border-solid { border-style: solid; }

    .shadow-hard { box-shadow: 3px 3px 0 0 var(--color-lofi-border); }

    .w-full { width: 100%; }
    .min-w-0 { min-width: 0; }

    .inline-flex { display: inline-flex; }
    .inline-block { display: inline-block; }

    .cursor-pointer { cursor: pointer; }
    .opacity-50 { opacity: 0.5; }

    /* Wobble filter effect */
    .wobble { filter: url(#lofi-wobble); }
    .wobble-subtle { filter: url(#lofi-wobble-subtle); }

    /* Button styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lofi);
      border-width: 2px;
      border-style: solid;
      padding: 0.5rem 1rem;
      font-family: var(--font-hand);
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      filter: url(#lofi-wobble);
    }

    .btn-secondary {
      background-color: var(--color-lofi-bg);
      border-color: var(--color-lofi-border);
      color: var(--color-lofi);
      box-shadow: 3px 3px 0 0 var(--color-lofi-border);
    }

    .btn-primary {
      background-color: var(--color-lofi);
      border-color: var(--color-lofi);
      color: var(--color-lofi-bg);
      box-shadow: 3px 3px 0 0 var(--color-lofi-border);
    }

    .btn-danger {
      background-color: var(--color-lofi-error);
      border-color: var(--color-lofi-error);
      color: var(--color-lofi-bg);
      box-shadow: 3px 3px 0 0 var(--color-lofi-border);
    }

    /* Input styles */
    .input {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      font-family: var(--font-hand);
      background-color: var(--color-lofi-bg);
      filter: url(#lofi-wobble);
    }

    .input::placeholder { color: var(--color-lofi-placeholder); }

    /* Card styles */
    .card {
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      padding: 1rem;
      background-color: var(--color-lofi-bg);
      box-shadow: 3px 3px 0 0 var(--color-lofi-border);
      filter: url(#lofi-wobble);
    }

    /* Badge styles */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: var(--font-hand);
      filter: url(#lofi-wobble);
    }

    .badge-info { background-color: rgba(9, 132, 227, 0.15); color: var(--color-lofi-accent); }
    .badge-success { background-color: rgba(10, 122, 92, 0.15); color: var(--color-lofi-success); }
    .badge-warning { background-color: rgba(180, 83, 9, 0.15); color: var(--color-lofi-warning); }
    .badge-error { background-color: rgba(192, 57, 43, 0.15); color: var(--color-lofi-error); }

    /* Alert styles */
    .alert {
      padding: 1rem;
      border: 2px solid;
      border-radius: var(--radius-lofi);
      font-family: var(--font-hand);
      filter: url(#lofi-wobble);
    }

    .alert-info { border-color: var(--color-lofi-accent); background-color: rgba(9, 132, 227, 0.1); }
    .alert-success { border-color: var(--color-lofi-success); background-color: rgba(10, 122, 92, 0.1); }
    .alert-warning { border-color: var(--color-lofi-warning); background-color: rgba(180, 83, 9, 0.1); }
    .alert-error { border-color: var(--color-lofi-error); background-color: rgba(192, 57, 43, 0.1); }

    /* Progress bar */
    .progress {
      width: 100%;
      height: 0.5rem;
      background-color: var(--color-lofi-muted);
      border-radius: var(--radius-lofi);
      overflow: hidden;
      filter: url(#lofi-wobble);
    }

    .progress-bar {
      height: 100%;
      background-color: var(--color-lofi-accent);
      transition: width 0.3s ease;
    }

    /* Checkbox and radio */
    .checkbox, .radio {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-hand);
      cursor: pointer;
    }

    .checkbox input, .radio input {
      width: 1.25rem;
      height: 1.25rem;
      accent-color: var(--color-lofi-accent);
    }

    /* Toggle switch */
    .toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-hand);
    }

    .toggle-switch {
      width: 2.5rem;
      height: 1.25rem;
      background-color: var(--color-lofi-muted);
      border: 2px solid var(--color-lofi-border);
      border-radius: 9999px;
      position: relative;
      cursor: pointer;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 0.75rem;
      height: 0.75rem;
      background-color: var(--color-lofi-border);
      border-radius: 50%;
      top: 50%;
      left: 2px;
      transform: translateY(-50%);
      transition: left 0.2s ease;
    }

    .toggle-switch.checked {
      background-color: var(--color-lofi-accent);
    }

    .toggle-switch.checked::after {
      left: calc(100% - 0.75rem - 2px);
      background-color: var(--color-lofi-bg);
    }

    /* Dropdown/Select */
    .dropdown {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      font-family: var(--font-hand);
      background-color: var(--color-lofi-bg);
      cursor: pointer;
      filter: url(#lofi-wobble);
    }

    /* Textarea */
    .textarea {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      font-family: var(--font-hand);
      background-color: var(--color-lofi-bg);
      resize: vertical;
      filter: url(#lofi-wobble);
    }

    /* Link */
    .link {
      color: var(--color-lofi-accent);
      text-decoration: underline;
      text-underline-offset: 0.18em;
      cursor: pointer;
    }

    .link:hover { opacity: 0.8; }
    .link.active { font-weight: 700; }

    /* Tab */
    .tab {
      padding: 0.5rem 1rem;
      border-bottom: 2px solid transparent;
      font-family: var(--font-hand);
      cursor: pointer;
    }

    .tab.active {
      border-bottom-color: var(--color-lofi-accent);
      color: var(--color-lofi-accent);
    }

    /* Nav */
    .nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 2px solid var(--color-lofi-border);
      font-family: var(--font-hand);
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-hand);
    }

    .breadcrumb a:not(:last-child)::after {
      content: "/";
      margin-left: 0.5rem;
      color: var(--color-lofi-text-muted);
    }

    /* Modal */
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--color-lofi-bg);
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      padding: 1.5rem;
      box-shadow: 6px 6px 0 0 var(--color-lofi-border);
      filter: url(#lofi-wobble);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
    }

    /* Toast */
    .toast {
      padding: 0.75rem 1rem;
      border: 2px solid;
      border-radius: var(--radius-lofi);
      font-family: var(--font-hand);
      box-shadow: 3px 3px 0 0 var(--color-lofi-border);
      filter: url(#lofi-wobble);
    }

    /* Avatar */
    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: var(--color-lofi-muted);
      border: 2px solid var(--color-lofi-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-sketch);
      filter: url(#lofi-wobble);
    }

    .avatar-sm { width: 2rem; height: 2rem; font-size: 0.75rem; }
    .avatar-lg { width: 3rem; height: 3rem; font-size: 1.25rem; }

    /* Slider */
    .slider {
      width: 100%;
      accent-color: var(--color-lofi-accent);
    }

    /* Chart placeholder */
    .chart {
      width: 100%;
      height: 200px;
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      background-color: var(--color-lofi-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-hand);
      color: var(--color-lofi-text-muted);
      filter: url(#lofi-wobble);
    }

    /* Accordion */
    .accordion {
      border: 2px solid var(--color-lofi-border);
      border-radius: var(--radius-lofi);
      overflow: hidden;
    }

    .accordion-item { border-bottom: 1px solid var(--color-lofi-border); }
    .accordion-item:last-child { border-bottom: none; }

    .accordion-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 1rem;
      font-family: var(--font-sketch);
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      list-style: none;
    }

    .accordion-trigger::-webkit-details-marker { display: none; }

    .accordion-trigger::after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-right: 2px solid var(--color-lofi);
      border-bottom: 2px solid var(--color-lofi);
      transform: rotate(-45deg);
      transition: transform 0.2s ease;
    }

    details[open] > .accordion-trigger::after { transform: rotate(45deg); }

    .accordion-content {
      padding: 0 1rem 1rem;
      font-family: var(--font-hand);
    }

    /* Tabs container */
    .tabs {
      display: flex;
      border-bottom: 2px solid var(--color-lofi-border);
    }

    /* Menu */
    .menu {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .menu-item {
      padding: 0.5rem 1rem;
      font-family: var(--font-hand);
      cursor: pointer;
      border-radius: var(--radius-lofi);
    }

    .menu-item:hover { background-color: var(--color-lofi-muted); }
    .menu-item.active { background-color: var(--color-lofi-accent); color: var(--color-lofi-bg); }

    /* Markdown content */
    .lofi-md { font-family: var(--font-hand); line-height: 1.6; }
    .lofi-md table { width: 100%; border-collapse: collapse; border: 2px solid var(--color-lofi-border); margin: 1rem 0; }
    .lofi-md th, .lofi-md td { border: 1px solid var(--color-lofi-border); padding: 0.5rem 0.75rem; text-align: left; }
    .lofi-md th { background-color: var(--color-lofi-muted); font-weight: 700; }
    .lofi-md ul, .lofi-md ol { margin: 0.75rem 0; padding-left: 1.5rem; }
    .lofi-md ul { list-style-type: disc; }
    .lofi-md ol { list-style-type: decimal; }
    .lofi-md li { margin: 0.25rem 0; }
    .lofi-md hr { border: none; border-top: 2px solid var(--color-lofi-border); margin: 1.5rem 0; }
    .lofi-md a { color: var(--color-lofi-accent); text-decoration: underline; }
    .lofi-md code { background-color: var(--color-lofi-muted); padding: 0.125rem 0.25rem; border-radius: 3px; font-family: monospace; }
    .lofi-md pre { background-color: var(--color-lofi-muted); padding: 1rem; border-radius: var(--radius-lofi); overflow-x: auto; }
    .lofi-md blockquote { border-left: 4px solid var(--color-lofi-accent); padding-left: 1rem; color: var(--color-lofi-text-muted); font-style: italic; }
  `;
}
