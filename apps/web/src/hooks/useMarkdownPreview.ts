import { markdownToHtml } from "@inariwrite/core";
import { sampleMarkdownPlugin } from "@inariwrite/plugin-sample";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 120;
const PREVIEW_PLUGINS = [sampleMarkdownPlugin];

let requestCounter = 0;
let workerInstance: Worker | null = null;

function getPreviewWorker(): Worker | null {
  if (typeof Worker === "undefined") return null;
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("../workers/markdownPreview.worker.ts", import.meta.url),
      { type: "module" },
    );
  }
  return workerInstance;
}

export function useMarkdownPreview(markdown: string): { html: string; error: string | null } {
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let messageHandler: ((ev: MessageEvent) => void) | null = null;
    const worker = getPreviewWorker();

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      if (worker) {
        const id = ++requestCounter;
        messageHandler = (ev: MessageEvent<{ id: number; ok: boolean; html?: string }>) => {
          if (ev.data?.id !== id) return;
          if (cancelled) return;
          if (ev.data.ok && typeof ev.data.html === "string") {
            setHtml(ev.data.html);
            setError(null);
          } else {
            setHtml("");
            setError("preview.error");
          }
        };
        worker.addEventListener("message", messageHandler);
        worker.postMessage({ id, markdown });
      } else {
        void markdownToHtml(markdown, { plugins: PREVIEW_PLUGINS })
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
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (worker && messageHandler) {
        worker.removeEventListener("message", messageHandler);
      }
    };
  }, [markdown]);

  return { html, error };
}
