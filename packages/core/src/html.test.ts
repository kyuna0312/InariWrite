import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./markdown.js";

describe("markdownToHtml", () => {
  it("renders headings and emphasis", async () => {
    const html = await markdownToHtml("# Hi\n\n**bold**");
    expect(html).toContain("<h1>");
    expect(html).toContain("Hi");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("renders GFM strikethrough", async () => {
    const html = await markdownToHtml("~~gone~~");
    expect(html.toLowerCase()).toContain("gone");
    expect(html).toMatch(/<del>|<s>/i);
  });

  it("renders GFM tables", async () => {
    const md = "| a | b |\n|---|---|\n| 1 | 2 |";
    const html = await markdownToHtml(md);
    expect(html).toContain("<table");
    expect(html).toContain("<td");
  });
});
