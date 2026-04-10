import type { Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";

/**
 * Parse Markdown into an mdast syntax tree (CommonMark via remark-parse).
 */
export function parseMarkdown(markdown: string): Root {
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdown);
  return tree as Root;
}
