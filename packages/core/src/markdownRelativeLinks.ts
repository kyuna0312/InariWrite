import type { MarkdownParseOptions } from "./plugins/types.js";
import { parseMarkdown } from "./markdown.js";

export type RelativeMdLinkOccurrence = {
  /** Raw `url` from the mdast link (may include hash/query). */
  href: string;
  /** Path segment used to resolve the file (hash and query stripped). */
  pathPart: string;
  /** 1-based line from the parser, if available. */
  line: number | undefined;
};

function walkAst(node: unknown, visit: (n: Record<string, unknown>) => void): void {
  if (!node || typeof node !== "object") return;
  const n = node as Record<string, unknown>;
  visit(n);
  const ch = n.children;
  if (Array.isArray(ch)) {
    for (const c of ch) walkAst(c, visit);
  }
}

/**
 * Returns true for URLs that should be treated as relative file paths
 * (not absolute URLs, fragments-only, or scheme-based).
 */
export function relativeMarkdownFilePathPart(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (trimmed.startsWith("//")) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/u.test(trimmed)) return null;
  const noHash = trimmed.split("#")[0] ?? "";
  const noQuery = noHash.split("?")[0] ?? "";
  const pathPart = noQuery.trim();
  if (!pathPart) return null;
  const lower = pathPart.toLowerCase();
  if (!lower.endsWith(".md") && !lower.endsWith(".markdown")) return null;
  return pathPart;
}

/**
 * Lists markdown `link` destinations that point to relative `.md` / `.markdown` files.
 * Uses the same remark pipeline as `parseMarkdown` (including plugins when provided).
 */
export function listRelativeMarkdownFileLinks(
  markdown: string,
  options?: MarkdownParseOptions,
): RelativeMdLinkOccurrence[] {
  const tree = parseMarkdown(markdown, options);
  const out: RelativeMdLinkOccurrence[] = [];
  walkAst(tree, (n) => {
    if (n.type !== "link") return;
    const url = n.url;
    if (typeof url !== "string") return;
    const pathPart = relativeMarkdownFilePathPart(url);
    if (!pathPart) return;
    const pos = n.position as { start?: { line?: number } } | undefined;
    const line = pos?.start?.line;
    out.push({ href: url, pathPart, line });
  });
  return out;
}
