import type { Root } from "mdast";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Parse Markdown into an mdast tree (CommonMark + GFM via remark-gfm).
 */
export function parseMarkdown(markdown: string): Root {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  return tree as Root;
}

/**
 * Render GitHub-flavored Markdown to a sanitized HTML string for preview.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
