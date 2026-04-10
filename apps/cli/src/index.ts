#!/usr/bin/env node
import { markdownToHtmlDocument } from "@inariwrite/core";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cac } from "cac";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MTIME_PATH = "/__inariwrite/mtime";

function readVersion(): string {
  const path = join(__dirname, "..", "package.json");
  const raw = readFileSync(path, "utf8");
  const pkg = JSON.parse(raw) as { version?: string };
  return pkg.version ?? "0.0.0";
}

function getMtimeMs(filePath: string): number {
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return -1;
  }
}

function injectPreviewWatchScript(html: string): string {
  if (!html.includes("</body>")) {
    return html;
  }
  const script = `<script>(function(){var p=null;function t(){fetch("${MTIME_PATH}",{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){var m=d.m;if(p===null){p=m;return;}if(m!==p)location.reload();}).catch(function(){});}setInterval(t,500);t();})();</script>`;
  return html.replace("</body>", `${script}</body>`);
}

const cli = cac("inariwrite");

cli.version(readVersion());

cli
  .command("preview <file>", "Serve Markdown as HTML (refreshed from disk each request)")
  .option("-p, --port <port>", "Port number", { default: 4173 })
  .option("-H, --host <host>", "Listen host", { default: "127.0.0.1" })
  .option("-w, --watch", "Reload the browser when the file changes on disk")
  .action(
    async (
      file: string,
      options: { port?: string | number; host?: string; watch?: boolean },
    ) => {
      const filePath = resolve(process.cwd(), file);
      const title = basename(filePath);
      const port = Number(options.port ?? 4173);
      const host = String(options.host ?? "127.0.0.1");
      const watch = Boolean(options.watch);

      const server = createServer(async (req, res) => {
        const rawUrl = req.url?.split("?")[0] ?? "/";

        if (rawUrl === MTIME_PATH) {
          if (!watch) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
          }
          const m = getMtimeMs(filePath);
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          });
          res.end(JSON.stringify({ m }));
          return;
        }

        if (rawUrl !== "/" && rawUrl !== "/index.html") {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }

        try {
          const md = readFileSync(filePath, "utf8");
          let html = await markdownToHtmlDocument(md, { title });
          if (watch) {
            html = injectPreviewWatchScript(html);
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(message);
        }
      });

      server.listen(port, host, () => {
        process.stderr.write(`InariWrite preview at http://${host}:${port}\n`);
        process.stderr.write(`Source: ${filePath}\n`);
        if (watch) {
          process.stderr.write(
            `Watch: open the page in a browser; it reloads when the file changes (${MTIME_PATH}).\n`,
          );
        }
      });
    },
  );

cli
  .command("build <file>", "Write index.html from a Markdown file")
  .option("-o, --out <dir>", "Output directory", { default: "dist-md" })
  .action(async (file: string, options: { out?: string }) => {
    const filePath = resolve(process.cwd(), file);
    const outDir = resolve(process.cwd(), options.out ?? "dist-md");
    const title = basename(filePath);
    const md = readFileSync(filePath, "utf8");
    const html = await markdownToHtmlDocument(md, { title });
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, "index.html");
    writeFileSync(outFile, html, "utf8");
    process.stderr.write(`Wrote ${outFile}\n`);
  });

cli.help();

cli.parse();
