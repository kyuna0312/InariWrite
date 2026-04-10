import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown.js";

describe("parseMarkdown", () => {
  it("returns a root node", () => {
    const tree = parseMarkdown("");
    expect(tree.type).toBe("root");
    expect(Array.isArray(tree.children)).toBe(true);
  });

  it("parses GFM strikethrough as delete", () => {
    const tree = parseMarkdown("~~x~~");
    const p = tree.children[0];
    expect(p?.type).toBe("paragraph");
    if (p?.type === "paragraph") {
      expect(p.children[0]?.type).toBe("delete");
    }
  });

  it("parses a heading", () => {
    const tree = parseMarkdown("# Hello");
    expect(tree.children.length).toBe(1);
    const heading = tree.children[0];
    expect(heading?.type).toBe("heading");
    if (heading?.type === "heading") {
      expect(heading.depth).toBe(1);
      expect(heading.children[0]?.type).toBe("text");
      if (heading.children[0]?.type === "text") {
        expect(heading.children[0].value).toBe("Hello");
      }
    }
  });
});
