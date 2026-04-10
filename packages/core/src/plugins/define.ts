import type { MarkdownPlugin } from "./types.js";

/** Typed helper for plugin authors (same as returning the object). */
export function defineMarkdownPlugin(plugin: MarkdownPlugin): MarkdownPlugin {
  return plugin;
}
