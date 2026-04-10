import { markdownToHtml } from "./markdown.js";
import type { MarkdownPlugin } from "./plugins/types.js";
import { STANDALONE_MARKDOWN_CSS } from "./standaloneCss.js";

export type MarkdownDocumentOptions = {
  title?: string;
  subtitle?: string;
  plugins?: MarkdownPlugin[];
};

/**
 * Full HTML document with embedded styles for static hosting or `inariwrite preview`.
 */
export async function markdownToHtmlDocument(
  markdown: string,
  options?: MarkdownDocumentOptions,
): Promise<string> {
  const title = options?.title?.trim() || "InariWrite";
  const subtitle = options?.subtitle?.trim();
  const body = await markdownToHtml(markdown, { plugins: options?.plugins });
  const sub = subtitle
    ? `<p>${escapeHtml(subtitle)}</p>`
    : "<p>Rendered with InariWrite</p>";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>${STANDALONE_MARKDOWN_CSS}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    ${sub}
  </header>
  <main class="markdown-body">${body}</main>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
