import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { sampleMarkdownPlugin } from "@inariwrite/plugin-sample";
import { checkMarkdownRelativeLinks, formatCheckReport } from "./check.js";

const plugins = [sampleMarkdownPlugin];

describe("checkMarkdownRelativeLinks", () => {
  it("returns no broken links when targets exist", () => {
    const root = mkdtempSync(join(tmpdir(), "inari-check-"));
    const target = join(root, "other.md");
    writeFileSync(target, "# OK\n");
    const main = join(root, "index.md");
    writeFileSync(main, "Link [o](./other.md)\n");
    const { broken } = checkMarkdownRelativeLinks(main, plugins);
    expect(broken).toEqual([]);
  });

  it("reports missing relative .md targets", () => {
    const root = mkdtempSync(join(tmpdir(), "inari-check-"));
    const main = join(root, "index.md");
    writeFileSync(main, "See [x](./missing.md).\n");
    const { broken } = checkMarkdownRelativeLinks(main, plugins);
    expect(broken.length).toBe(1);
    expect(broken[0].href).toBe("./missing.md");
    expect(broken[0].resolved).toBe(join(root, "missing.md"));
  });

  it("resolves links relative to nested markdown path", () => {
    const root = mkdtempSync(join(tmpdir(), "inari-check-"));
    mkdirSync(join(root, "docs"));
    writeFileSync(join(root, "docs", "a.md"), "[b](../nested/b.md)\n");
    const { broken } = checkMarkdownRelativeLinks(join(root, "docs", "a.md"), plugins);
    expect(broken.length).toBe(1);
    expect(broken[0].resolved).toBe(join(root, "nested", "b.md"));
  });

  it("formatCheckReport lists paths", () => {
    const main = join(tmpdir(), "fmt-check.md");
    const text = formatCheckReport(main, {
      broken: [{ href: "./nope.md", resolved: "/abs/nope.md", line: 2 }],
    });
    expect(text).toContain("nope.md");
    expect(text).toContain(":2");
  });
});
