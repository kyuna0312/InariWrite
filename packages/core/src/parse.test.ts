import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./index.js";

describe("parseMarkdown", () => {
  it("returns a root node", () => {
    const tree = parseMarkdown("");
    expect(tree.type).toBe("root");
    expect(Array.isArray(tree.children)).toBe(true);
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
