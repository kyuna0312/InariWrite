import { markdownToHtml } from "@inariwrite/core";
import { describe, expect, it } from "vitest";
import { sampleMarkdownPlugin } from "./index.js";

describe("@inariwrite/plugin-sample", () => {
  it("replaces :inari: in output HTML", async () => {
    const html = await markdownToHtml("Hello :inari:", {
      plugins: [sampleMarkdownPlugin],
    });
    expect(html).toContain("🦊");
    expect(html).not.toContain(":inari:");
  });
});
