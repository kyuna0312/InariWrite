import { readFileSync } from "node:fs";

const ALLOWED_METHODS = new Set(["POST", "PUT", "PATCH"]);

export type PublishOptions = {
  url: string;
  method?: string;
  /** If set, sends `Authorization: Bearer <token>`. */
  token?: string;
};

/**
 * POST/PUT/PATCH raw Markdown bytes to a user-controlled URL (optional “cloud” hook).
 * Does not read or modify the Markdown pipeline—transport only.
 */
export async function publishMarkdownFile(
  absoluteFilePath: string,
  opts: PublishOptions,
): Promise<Response> {
  const method = (opts.method ?? "POST").toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    throw new Error(`Unsupported method "${method}"; use POST, PUT, or PATCH`);
  }
  let parsed: URL;
  try {
    parsed = new URL(opts.url);
  } catch {
    throw new Error("Invalid URL (--url)");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL must use http: or https:");
  }
  const body = readFileSync(absoluteFilePath, "utf8");
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "User-Agent": "inariwrite-cli/publish",
  });
  const t = opts.token?.trim();
  if (t) {
    headers.set("Authorization", `Bearer ${t}`);
  }
  return fetch(opts.url, { method, headers, body });
}
