import type { Root } from "mdast";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Processor } from "unified";
import type { MarkdownHtmlOptions, MarkdownParseOptions } from "./plugins/types.js";

function useRemarkExtensions(
  processor: Processor,
  plugins: NonNullable<MarkdownHtmlOptions["plugins"]>,
): Processor {
  let p: Processor = processor;
  for (const bundle of plugins) {
    for (const plug of bundle.remarkPlugins ?? []) {
      p = p.use(plug as never) as unknown as Processor;
    }
  }
  return p;
}

function useRehypeExtensions(
  processor: Processor,
  plugins: NonNullable<MarkdownHtmlOptions["plugins"]>,
): Processor {
  let p: Processor = processor;
  for (const bundle of plugins) {
    for (const plug of bundle.rehypePlugins ?? []) {
      p = p.use(plug as never) as unknown as Processor;
    }
  }
  return p;
}

/**
 * Parse Markdown into an mdast tree (CommonMark + GFM via remark-gfm).
 * Runs remark transformers (`runSync`) so plugins in `plugins` apply.
 */
export function parseMarkdown(markdown: string, options?: MarkdownParseOptions): Root {
  const plugins = options?.plugins ?? [];
  let chain = unified().use(remarkParse).use(remarkGfm) as unknown as Processor;
  chain = useRemarkExtensions(chain, plugins);
  const tree = chain.parse(markdown);
  return chain.runSync(tree) as Root;
}

/**
 * Render GitHub-flavored Markdown to a sanitized HTML string for preview.
 */
export async function markdownToHtml(
  markdown: string,
  options?: MarkdownHtmlOptions,
): Promise<string> {
  const plugins = options?.plugins ?? [];
  let chain = unified().use(remarkParse).use(remarkGfm) as unknown as Processor;
  chain = useRemarkExtensions(chain, plugins);
  chain = chain.use(remarkRehype) as unknown as Processor;
  chain = useRehypeExtensions(chain, plugins);
  const file = await chain.use(rehypeSanitize).use(rehypeStringify).process(markdown);
  return String(file);
}
