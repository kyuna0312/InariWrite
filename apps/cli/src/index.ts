#!/usr/bin/env node
import { markdownToHtmlDocument } from "@inariwrite/core";
import type { MarkdownPlugin } from "@inariwrite/core";
import { sampleMarkdownPlugin } from "@inariwrite/plugin-sample";
import { checkMarkdownRelativeLinks, formatCheckReport } from "./check.js";
import { resolveCliMarkdownPlugins } from "./loadPlugins.js";
import { publishMarkdownFile } from "./publish.js";
import { mkdirSync, readFileSync, statSync, watch, writeFileSync } from "node:fs";
import type { ServerResponse } from "node:http";
import { createServer } from "node:http";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cac } from "cac";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MTIME_PATH = "/__inariwrite/mtime";
const EVENTS_PATH = "/__inariwrite/events";

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

function clampPollInterval(ms: unknown): number {
  const n = Number(ms);
  if (!Number.isFinite(n)) return 500;
  return Math.min(60_000, Math.max(100, Math.round(n)));
}

function injectPreviewWatchScript(
  html: string,
  pollIntervalMs: number,
  sseAvailable: boolean,
): string {
  if (!html.includes("</body>")) {
    return html;
  }
  const mt = JSON.stringify(MTIME_PATH);
  const ev = JSON.stringify(EVENTS_PATH);
  const script = `<script>(function(){var POLL_MS=${pollIntervalMs};var MTIME=${mt};var EVENTS=${ev};var USE_SSE=${sseAvailable};var timer=null;function poll(){var prev=null;function tick(){fetch(MTIME,{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){var x=d.m;if(prev===null){prev=x;return;}if(x!==prev)location.reload();}).catch(function(){});}timer=setInterval(tick,POLL_MS);tick();}if(!USE_SSE){poll();return;}var es=new EventSource(EVENTS);es.onmessage=function(){location.reload();};es.onerror=function(){try{es.close();}catch(z){}if(timer)return;poll();};})();</script>`;

  return html.replace("</body>", `${script}</body>`);
}

const cli = cac("inariwrite");

/** Same default plugins as the web preview (worker + fallback). */
const defaultMarkdownPlugins = [sampleMarkdownPlugin];

function exitErr(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

async function loadPluginsOrExit(opts: {
  config?: string;
  plugin?: string;
}): Promise<MarkdownPlugin[]> {
  try {
    return await resolveCliMarkdownPlugins({
      cwd: process.cwd(),
      base: defaultMarkdownPlugins,
      config: opts.config,
      pluginSpecs: opts.plugin,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    exitErr(`Error loading plugins: ${msg}`);
  }
}

cli.version(readVersion());

cli
  .command("preview <file>", "Serve Markdown as HTML (refreshed from disk each request)")
  .option("-p, --port <port>", "Port number", { default: 4173 })
  .option("-H, --host <host>", "Listen host", { default: "127.0.0.1" })
  .option("-w, --watch", "Reload the browser when the file changes on disk")
  .option(
    "--interval <ms>",
    "Polling interval (ms) when EventSource is unavailable; min 100, max 60000",
    { default: 500 },
  )
  .option("-c, --config <file>", "Path to inariwrite.config.{mjs,js,cjs}")
  .option(
    "--plugin <specs>",
    "Comma-separated MarkdownPlugin modules (npm package or ./file.mjs), after config",
  )
  .action(
    async (
      file: string,
      options: {
        port?: string | number;
        host?: string;
        watch?: boolean;
        interval?: string | number;
        config?: string;
        plugin?: string;
      },
    ) => {
      const plugins = await loadPluginsOrExit({
        config: options.config,
        plugin: options.plugin,
      });
      const filePath = resolve(process.cwd(), file);
      const title = basename(filePath);
      const port = Number(options.port ?? 4173);
      const host = String(options.host ?? "127.0.0.1");
      const watchMode = Boolean(options.watch);
      const pollIntervalMs = clampPollInterval(options.interval ?? 500);

      const sseClients = new Set<ServerResponse>();
      let lastKnownMtime = getMtimeMs(filePath);
      let debounceTimer: ReturnType<typeof setTimeout> | undefined;
      let fsWatchOk = false;

      function broadcastSse(): void {
        const payload = `data: {"r":1}\n\n`;
        for (const client of sseClients) {
          try {
            client.write(payload);
          } catch {
            sseClients.delete(client);
          }
        }
      }

      function scheduleMtimeCheck(): void {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          debounceTimer = undefined;
          const m = getMtimeMs(filePath);
          if (m !== lastKnownMtime) {
            lastKnownMtime = m;
            broadcastSse();
          }
        }, 100);
      }

      if (watchMode) {
        try {
          const watcher = watch(filePath, () => {
            scheduleMtimeCheck();
          });
          watcher.on("error", () => {
            /* ignore; client may fall back to polling */
          });
          fsWatchOk = true;
        } catch {
          process.stderr.write(
            "Warning: fs.watch failed; live reload uses HTTP polling only.\n",
          );
        }
      }

      const server = createServer((req, res) => {
        void (async () => {
          const rawUrl = req.url?.split("?")[0] ?? "/";

          if (rawUrl === EVENTS_PATH) {
            if (!watchMode) {
              res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
              res.end("Not found");
              return;
            }
            res.writeHead(200, {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
              "X-Accel-Buffering": "no",
            });
            sseClients.add(res);
            req.on("close", () => {
              sseClients.delete(res);
            });
            res.write(": connected\n\n");
            return;
          }

          if (rawUrl === MTIME_PATH) {
            if (!watchMode) {
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
            let html = await markdownToHtmlDocument(md, {
              title,
              plugins,
            });
            if (watchMode) {
              html = injectPreviewWatchScript(html, pollIntervalMs, fsWatchOk);
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(message);
          }
        })();
      });

      server.listen(port, host, () => {
        process.stderr.write(`InariWrite preview at http://${host}:${port}\n`);
        process.stderr.write(`Source: ${filePath}\n`);
        if (watchMode) {
          const transport = fsWatchOk ? `SSE ${EVENTS_PATH}` : "polling only";
          process.stderr.write(
            `Watch: ${transport}; poll fallback ${MTIME_PATH} every ${pollIntervalMs}ms (--interval).\n`,
          );
        }
      });
    },
  );

cli
  .command("check <file>", "Verify relative .md / .markdown links from a Markdown file")
  .option("-c, --config <file>", "Path to inariwrite.config.{mjs,js,cjs}")
  .option(
    "--plugin <specs>",
    "Comma-separated MarkdownPlugin modules (npm package or ./file.mjs), after config",
  )
  .action(async (file: string, options: { config?: string; plugin?: string }) => {
    const plugins = await loadPluginsOrExit({
      config: options.config,
      plugin: options.plugin,
    });
    const filePath = resolve(process.cwd(), file);
    const { broken } = checkMarkdownRelativeLinks(filePath, plugins);
    if (broken.length === 0) {
      process.stderr.write("OK: no broken relative Markdown links.\n");
      process.exit(0);
      return;
    }
    const report = formatCheckReport(filePath, { broken });
    process.stderr.write(`${report}\n`);
    process.exit(1);
  });

cli
  .command("publish <file>", "POST/PUT/PATCH raw Markdown to an HTTP(S) URL you control")
  .option("-u, --url <url>", "Target URL (http or https)")
  .option("-m, --method <method>", "POST, PUT, or PATCH", { default: "POST" })
  .option(
    "--token <token>",
    "Bearer token (avoid shell history: use env INARIWRITE_PUBLISH_TOKEN instead)",
  )
  .action(
    async (
      file: string,
      options: { url?: string; method?: string; token?: string },
    ) => {
      const url = options.url?.trim();
      if (!url) {
        exitErr("Missing --url (example: inariwrite publish note.md -u https://api.example.com/hooks/md)");
      }
      const filePath = resolve(process.cwd(), file);
      const token = options.token?.trim() || process.env.INARIWRITE_PUBLISH_TOKEN?.trim();
      try {
        const res = await publishMarkdownFile(filePath, {
          url,
          method: options.method,
          token,
        });
        const snippet = await res.text();
        if (!res.ok) {
          const extra = snippet ? `: ${snippet.slice(0, 500)}` : "";
          exitErr(`Publish failed: HTTP ${res.status} ${res.statusText}${extra}`);
        }
        process.stderr.write(`Published ${filePath} → ${url} (${res.status})\n`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        exitErr(`Publish failed: ${msg}`);
      }
    },
  );

cli
  .command("build <file>", "Write index.html from a Markdown file")
  .option("-o, --out <dir>", "Output directory", { default: "dist-md" })
  .option("-c, --config <file>", "Path to inariwrite.config.{mjs,js,cjs}")
  .option(
    "--plugin <specs>",
    "Comma-separated MarkdownPlugin modules (npm package or ./file.mjs), after config",
  )
  .action(async (file: string, options: { out?: string; config?: string; plugin?: string }) => {
    const plugins = await loadPluginsOrExit({
      config: options.config,
      plugin: options.plugin,
    });
    const filePath = resolve(process.cwd(), file);
    const outDir = resolve(process.cwd(), options.out ?? "dist-md");
    const title = basename(filePath);
    const md = readFileSync(filePath, "utf8");
    const html = await markdownToHtmlDocument(md, {
      title,
      plugins,
    });
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, "index.html");
    writeFileSync(outFile, html, "utf8");
    process.stderr.write(`Wrote ${outFile}\n`);
  });

cli.help();

cli.parse();
