import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import { defineMarkdownPlugin } from "./plugins/define.js";
import { markdownToHtml, parseMarkdown } from "./markdown.js";

function walkNodes(node: unknown, visitText: (value: { value: string }) => void): void {
  if (!node || typeof node !== "object") return;
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === "text" && typeof n.value === "string") {
    visitText(n as { value: string });
  }
  if (Array.isArray(n.children)) {
    for (const child of n.children) walkNodes(child, visitText);
  }
}

function remarkPingPong() {
  return (tree: Root) => {
    walkNodes(tree, (t) => {
      if (t.value === "ping") t.value = "pong";
    });
  };
}

const pingPongPlugin = defineMarkdownPlugin({
  name: "test/ping-pong",
  remarkPlugins: [remarkPingPong],
});

describe("MarkdownPlugin pipeline", () => {
  it("runs remark plugins in parseMarkdown", () => {
    const tree = parseMarkdown("ping", { plugins: [pingPongPlugin] });
    expect(JSON.stringify(tree)).toContain("pong");
  });

  it("runs remark plugins in markdownToHtml", async () => {
    const html = await markdownToHtml("ping", { plugins: [pingPongPlugin] });
    expect(html).toContain("pong");
  });
});
