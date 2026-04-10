import { describe, expect, it } from "vitest";
import { markdownToHtmlDocument } from "./document.js";

describe("markdownToHtmlDocument", () => {
  it("wraps content in a full HTML document", async () => {
    const html = await markdownToHtmlDocument("# Hello", { title: "Doc" });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Doc</title>");
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain(".markdown-body");
  });

  it("escapes title for HTML", async () => {
    const html = await markdownToHtmlDocument("", { title: 'Evil <script>' });
    expect(html).toContain("Evil &lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});
