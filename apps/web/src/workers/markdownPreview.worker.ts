/// <reference lib="webworker" />

import { markdownToHtml } from "@inariwrite/core";
import { sampleMarkdownPlugin } from "@inariwrite/plugin-sample";

const plugins = [sampleMarkdownPlugin];

type InMessage = { id: number; markdown: string };
type OutMessage =
  | { id: number; ok: true; html: string }
  | { id: number; ok: false; error: string };

self.onmessage = async (ev: MessageEvent<InMessage>) => {
  const { id, markdown } = ev.data;
  try {
    const html = await markdownToHtml(markdown, { plugins });
    const out: OutMessage = { id, ok: true, html };
    self.postMessage(out);
  } catch (e) {
    const out: OutMessage = {
      id,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
    self.postMessage(out);
  }
};
