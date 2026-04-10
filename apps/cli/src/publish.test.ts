import { writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { publishMarkdownFile } from "./publish.js";

describe("publishMarkdownFile", () => {
  it("sends Markdown body with PUT", async () => {
    const mdPath = join(tmpdir(), `inari-pub-${Date.now()}.md`);
    writeFileSync(mdPath, "# hello publish\n", "utf8");

    const server = createServer((req, res) => {
      expect(req.method).toBe("PUT");
      const chunks: Buffer[] = [];
      req.on("data", (c) => {
        chunks.push(c as Buffer);
      });
      req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        expect(raw).toContain("# hello publish");
        expect(req.headers["content-type"]).toMatch(/text\/markdown/iu);
        res.writeHead(204);
        res.end();
      });
    });

    await new Promise<void>((resolveListen, rejectListen) => {
      server.listen(0, "127.0.0.1", () => resolveListen());
      server.on("error", rejectListen);
    });
    const { port } = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/hook`;

    const res = await publishMarkdownFile(mdPath, { url, method: "PUT" });
    expect(res.status).toBe(204);

    await new Promise<void>((resolveClose, rejectClose) => {
      server.close((err) => (err ? rejectClose(err) : resolveClose()));
    });
  });

  it("rejects disallowed methods", async () => {
    const mdPath = join(tmpdir(), `inari-pub-${Date.now()}.md`);
    writeFileSync(mdPath, "x", "utf8");
    await expect(
      publishMarkdownFile(mdPath, { url: "https://example.com/x", method: "GET" }),
    ).rejects.toThrow(/Unsupported method/);
  });

  it("sets Bearer token when provided", async () => {
    const mdPath = join(tmpdir(), `inari-pub-${Date.now()}.md`);
    writeFileSync(mdPath, "body", "utf8");

    const server = createServer((req, res) => {
      expect(req.headers.authorization).toBe("Bearer secret-test-token");
      res.writeHead(200);
      res.end("ok");
    });

    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    const { port } = server.address() as AddressInfo;
    const res = await publishMarkdownFile(mdPath, {
      url: `http://127.0.0.1:${port}/`,
      method: "POST",
      token: "secret-test-token",
    });
    expect(res.ok).toBe(true);
    await new Promise<void>((r, rej) => server.close((e) => (e ? rej(e) : r())));
  });
});
