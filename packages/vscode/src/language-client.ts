import * as path from "node:path";
import type * as vscode from "vscode";
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

export function createLanguageClient(
  context: vscode.ExtensionContext,
): LanguageClient {
  const serverModule = context.asAbsolutePath(
    path.join("dist", "language-server", "main.js"),
  );

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6009"] },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "lofi" }],
    synchronize: {
      fileEvents: [
        // Watch for .lofi file changes
      ],
    },
  };

  client = new LanguageClient(
    "lofi",
    "lofi Language Server",
    serverOptions,
    clientOptions,
  );

  return client;
}

export function getLanguageClient(): LanguageClient | undefined {
  return client;
}

export async function stopLanguageClient(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}
