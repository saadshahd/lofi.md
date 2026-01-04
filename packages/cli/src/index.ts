#!/usr/bin/env bun
import { parseArgs } from "util";
import { parse } from "@lofi/language";
import { generate } from "@lofi/html";
import { watch } from "fs";
import { resolve, dirname } from "path";
import type { ServerWebSocket } from "bun";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    output: { type: "string", short: "o" },
    serve: { type: "boolean", short: "s" },
    watch: { type: "boolean", short: "w" },
    port: { type: "string", short: "p", default: "3000" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

if (values.help || positionals.length === 0) {
  console.log(`lofi - LLM-first wireframe DSL

Usage:
  lofi <input.lofi>              Output HTML to stdout
  lofi <input.lofi> -o out.html  Output HTML to file
  lofi <input.lofi> --serve      Start dev server with hot reload
  lofi <input.lofi> --watch      Watch and regenerate on changes

Options:
  -o, --output <file>   Write output to file instead of stdout
  -s, --serve           Start dev server with hot reload
  -w, --watch           Watch for changes and regenerate
  -p, --port <port>     Server port (default: 3000)
  -h, --help            Show this help message`);
  process.exit(0);
}

const inputPath = resolve(positionals[0]);

async function generateHtml(): Promise<string> {
  const source = await Bun.file(inputPath).text();
  const doc = await parse(source);
  return generate(doc);
}

async function writeOutput(html: string, outputPath?: string) {
  if (outputPath) {
    await Bun.write(resolve(outputPath), wrapHtml(html));
    console.error(`Wrote ${outputPath}`);
  } else {
    console.log(html);
  }
}

function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>lofi preview</title>
  <link rel="stylesheet" href="https://unpkg.com/@lofi/html/dist/lofi.css">
</head>
<body class="bg-lofi-bg p-8 font-hand">
  ${content}
</body>
</html>`;
}

function wrapHtmlWithReload(content: string, port: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>lofi preview</title>
  <style id="lofi-css"></style>
</head>
<body class="bg-lofi-bg p-8 font-hand">
  ${content}
  <script>
    (async () => {
      const css = await fetch('/lofi.css').then(r => r.text());
      document.getElementById('lofi-css').textContent = css;
    })();
    const ws = new WebSocket('ws://localhost:${port}/ws');
    ws.onmessage = (e) => {
      if (e.data === 'reload') location.reload();
    };
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  </script>
</body>
</html>`;
}

if (values.serve) {
  const port = parseInt(values.port || "3000", 10);
  const clients = new Set<ServerWebSocket<unknown>>();

  const cssPath = resolve(
    dirname(import.meta.url.replace("file://", "")),
    "../../html/src/lofi.css",
  );

  const server = Bun.serve({
    port,
    async fetch(req, server) {
      const url = new URL(req.url);

      if (url.pathname === "/ws") {
        const upgraded = server.upgrade(req);
        if (upgraded) return undefined;
        return new Response("WebSocket upgrade failed", { status: 400 });
      }

      if (url.pathname === "/lofi.css") {
        const css = await Bun.file(cssPath).text();
        return new Response(css, {
          headers: { "Content-Type": "text/css" },
        });
      }

      try {
        const html = await generateHtml();
        return new Response(wrapHtmlWithReload(html, port), {
          headers: { "Content-Type": "text/html" },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(
          `<pre style="color:red;font-family:monospace;white-space:pre-wrap">${message}</pre>`,
          { headers: { "Content-Type": "text/html" }, status: 500 },
        );
      }
    },
    websocket: {
      open(ws) {
        clients.add(ws);
      },
      close(ws) {
        clients.delete(ws);
      },
      message() {},
    },
  });

  console.error(`Server running at http://localhost:${port}`);
  console.error(`Watching ${inputPath}`);

  watch(inputPath, () => {
    console.error("Change detected, reloading...");
    for (const client of clients) {
      client.send("reload");
    }
  });
} else if (values.watch) {
  const outputPath = values.output;

  async function rebuild() {
    try {
      const html = await generateHtml();
      await writeOutput(html, outputPath);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  }

  await rebuild();
  console.error(`Watching ${inputPath}...`);

  watch(inputPath, async () => {
    console.error("Change detected, rebuilding...");
    await rebuild();
  });
} else {
  try {
    const html = await generateHtml();
    await writeOutput(html, values.output);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
