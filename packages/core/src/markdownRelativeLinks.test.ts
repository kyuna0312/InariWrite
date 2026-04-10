import { describe, expect, it } from "vitest";
import {
  listRelativeMarkdownFileLinks,
  relativeMarkdownFilePathPart,
} from "./markdownRelativeLinks.js";

describe("relativeMarkdownFilePathPart", () => {
  it("accepts relative markdown paths", () => {
    expect(relativeMarkdownFilePathPart("./a.md")).toBe("./a.md");
    expect(relativeMarkdownFilePathPart("docs/x.markdown")).toBe("docs/x.markdown");
  });

  it("strips hash and query before suffix check", () => {
    expect(relativeMarkdownFilePathPart("./b.md#h")).toBe("./b.md");
    expect(relativeMarkdownFilePathPart("c.md?q=1")).toBe("c.md");
  });

  it("rejects non-file or absolute URLs", () => {
    expect(relativeMarkdownFilePathPart("#only")).toBeNull();
    expect(relativeMarkdownFilePathPart("https://a/b.md")).toBeNull();
    expect(relativeMarkdownFilePathPart("//a/b.md")).toBeNull();
    expect(relativeMarkdownFilePathPart("mailto:x@y")).toBeNull();
    expect(relativeMarkdownFilePathPart("page.html")).toBeNull();
  });
});

describe("listRelativeMarkdownFileLinks", () => {
  it("collects relative .md links from markdown", () => {
    const md = `
See [ok](./exists.md) and [bad](../missing/nope.md#x).
Also [web](https://ex.com/doc.md) and [fragment](#h).
`;
    const occ = listRelativeMarkdownFileLinks(md);
    const paths = occ.map((o) => o.pathPart);
    expect(paths).toContain("./exists.md");
    expect(paths).toContain("../missing/nope.md");
    expect(paths.some((p) => p.includes("https"))).toBe(false);
  });

  it("includes line numbers when present", () => {
    const md = "[x](./a.md)\n\n[y](./b.md)\n";
    const occ = listRelativeMarkdownFileLinks(md);
    expect(occ.length).toBeGreaterThanOrEqual(2);
    expect(occ.every((o) => typeof o.line === "number")).toBe(true);
  });
});
