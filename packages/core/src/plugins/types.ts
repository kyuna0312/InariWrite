import type { Pluggable } from "unified";

/**
 * Bundles remark and/or rehype plugins for InariWrite pipelines.
 * Remark plugins run after `remark-gfm` and before `remark-rehype`.
 * Rehype plugins run after `remark-rehype` and before `rehype-sanitize`.
 *
 * Each `Pluggable` is passed to `processor.use(pluggable)` in order (supports `[plugin, options]` tuples).
 */
export type MarkdownPlugin = {
  name: string;
  remarkPlugins?: Pluggable[];
  rehypePlugins?: Pluggable[];
};

export type MarkdownHtmlOptions = {
  plugins?: MarkdownPlugin[];
};

export type MarkdownParseOptions = {
  plugins?: MarkdownPlugin[];
};
