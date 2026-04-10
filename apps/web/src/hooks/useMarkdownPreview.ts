import { markdownToHtml } from "@inariwrite/core";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 120;

export function useMarkdownPreview(markdown: string): { html: string; error: string | null } {
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void markdownToHtml(markdown)
        .then((out: string) => {
          if (!cancelled) {
            setHtml(out);
            setError(null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHtml("");
            setError("preview.error");
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [markdown]);

  return { html, error };
}
