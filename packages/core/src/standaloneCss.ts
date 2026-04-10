/** Minimal styles for CLI `preview` / `build` HTML output (light theme). */
export const STANDALONE_MARKDOWN_CSS = `
:root { color-scheme: light; }
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 1.5rem clamp(1rem, 4vw, 2.5rem);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.65;
  color: #0f172a;
  background: #f8fafc;
  max-width: 52rem;
}
header { margin-bottom: 1.25rem; }
header h1 { margin: 0; font-size: 1.25rem; font-weight: 700; }
header p { margin: 0.25rem 0 0; font-size: 0.8125rem; color: #64748b; }
.markdown-body { font-size: 0.9375rem; }
.markdown-body :first-child { margin-top: 0; }
.markdown-body :last-child { margin-bottom: 0; }
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  line-height: 1.25;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}
.markdown-body h1 { font-size: 1.5rem; }
.markdown-body h2 { font-size: 1.25rem; }
.markdown-body h3 { font-size: 1.1rem; }
.markdown-body p { margin: 0.75em 0; }
.markdown-body a { color: #2563eb; }
.markdown-body code {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.875em;
  padding: 0.15em 0.35em;
  border-radius: 0.25rem;
  background: #f1f5f9;
}
.markdown-body pre {
  margin: 1em 0;
  padding: 0.75rem 1rem;
  overflow: auto;
  border-radius: 0.375rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}
.markdown-body pre code { padding: 0; background: none; }
.markdown-body ul, .markdown-body ol { margin: 0.75em 0; padding-left: 1.5rem; }
.markdown-body blockquote {
  margin: 1em 0;
  padding-left: 1rem;
  border-left: 3px solid #e2e8f0;
  color: #64748b;
}
.markdown-body table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.875rem; }
.markdown-body th, .markdown-body td { border: 1px solid #e2e8f0; padding: 0.4rem 0.6rem; text-align: left; }
.markdown-body th { background: #f8fafc; }
.markdown-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5em 0; }
.markdown-body img { max-width: 100%; height: auto; }
`.trim();
