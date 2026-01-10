import { createLofiLSPServices } from "@lofi.md/language";
import { startLanguageServer } from "langium/lsp";
import { NodeFileSystem } from "langium/node";
import { ProposedFeatures, createConnection } from "vscode-languageserver/node";

const connection = createConnection(ProposedFeatures.all);
const { shared } = createLofiLSPServices({ connection, ...NodeFileSystem });

startLanguageServer(shared);
