import { markdownToHtml } from "@inariwrite/core";
import { sampleMarkdownPlugin } from "@inariwrite/plugin-sample";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 120;
/** If the worker never responds (path/SW issues), fall back to the main thread. */
const WORKER_FALLBACK_MS = 3500;
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
    let settled = false;
    let messageHandler: ((ev: MessageEvent) => void) | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const worker = getPreviewWorker();

    const applyMainThread = () => {
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
    };

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      if (worker) {
        const id = ++requestCounter;
        messageHandler = (ev: MessageEvent<{ id: number; ok: boolean; html?: string }>) => {
          if (ev.data?.id !== id) return;
          if (cancelled || settled) return;
          settled = true;
          if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
          if (ev.data.ok && typeof ev.data.html === "string") {
            setHtml(ev.data.html);
            setError(null);
          } else {
            setHtml("");
            setError("preview.error");
          }
        };
        worker.addEventListener("message", messageHandler);
        fallbackTimer = window.setTimeout(() => {
          if (cancelled || settled) return;
          settled = true;
          if (worker && messageHandler) {
            worker.removeEventListener("message", messageHandler);
          }
          applyMainThread();
        }, WORKER_FALLBACK_MS);
        worker.postMessage({ id, markdown });
      } else {
        applyMainThread();
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (worker && messageHandler) {
        worker.removeEventListener("message", messageHandler);
      }
    };
  }, [markdown]);

  return { html, error };
}
