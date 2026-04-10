import { defineMarkdownPlugin, type MarkdownPlugin } from "@inariwrite/core";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * Replaces `:inari:` in text nodes with a fox emoji (demo remark plugin).
 */
export function remarkInariSample() {
  return (tree: Root) => {
    visit(tree, "text", (node) => {
      if (node.value.includes(":inari:")) {
        node.value = node.value.replaceAll(":inari:", "🦊");
      }
    });
  };
}

/** Ready-to-use plugin bundle for `markdownToHtml` / `parseMarkdown` `plugins` option. */
export const sampleMarkdownPlugin: MarkdownPlugin = defineMarkdownPlugin({
  name: "@inariwrite/plugin-sample",
  remarkPlugins: [remarkInariSample],
});

export type { MarkdownPlugin } from "@inariwrite/core";
