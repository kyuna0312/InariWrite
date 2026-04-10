import type { MarkdownPlugin } from "@inariwrite/core";
import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CONFIG_CANDIDATES = [
  "inariwrite.config.mjs",
  "inariwrite.config.js",
  "inariwrite.config.cjs",
] as const;

function isMarkdownPlugin(x: unknown): x is MarkdownPlugin {
  return (
    typeof x === "object" &&
    x !== null &&
    "name" in x &&
    typeof (x as MarkdownPlugin).name === "string"
  );
}

export function extractPluginsFromModule(mod: Record<string, unknown>): MarkdownPlugin[] {
  const out: MarkdownPlugin[] = [];
  const def = mod.default;
  if (Array.isArray(def)) {
    for (const p of def) {
      if (isMarkdownPlugin(p)) out.push(p);
    }
    return out;
  }
  if (isMarkdownPlugin(def)) {
    out.push(def);
    return out;
  }
  if (def && typeof def === "object" && "markdownPlugins" in def) {
    const list = (def as { markdownPlugins?: unknown }).markdownPlugins;
    if (Array.isArray(list)) {
      for (const p of list) {
        if (isMarkdownPlugin(p)) out.push(p);
      }
    }
    return out;
  }
  const named = mod.markdownPlugins;
  if (Array.isArray(named)) {
    for (const p of named) {
      if (isMarkdownPlugin(p)) out.push(p);
    }
    return out;
  }
  for (const key of ["markdownPlugin", "plugin"] as const) {
    const p = mod[key];
    if (isMarkdownPlugin(p)) out.push(p);
  }
  return out;
}

function resolveConfigPath(cwd: string, explicit?: string): string | null {
  if (explicit?.trim()) {
    const abs = isAbsolute(explicit) ? explicit : resolve(cwd, explicit);
    if (!existsSync(abs)) {
      throw new Error(`Config not found: ${abs}`);
    }
    return abs;
  }
  for (const name of CONFIG_CANDIDATES) {
    const abs = resolve(cwd, name);
    if (existsSync(abs)) return abs;
  }
  return null;
}

export async function importPluginModule(
  cwd: string,
  spec: string,
): Promise<MarkdownPlugin[]> {
  const s = spec.trim();
  if (!s) return [];
  let href: string;
  if (s.startsWith("file:")) {
    href = s;
  } else if (isAbsolute(s)) {
    href = pathToFileURL(s).href;
  } else if (s.startsWith("./") || s.startsWith("../")) {
    href = pathToFileURL(resolve(cwd, s)).href;
  } else {
    href = s;
  }
  const mod = (await import(href)) as Record<string, unknown>;
  return extractPluginsFromModule(mod);
}

export async function loadConfigFilePlugins(
  cwd: string,
  explicitConfig?: string,
): Promise<MarkdownPlugin[]> {
  const path = resolveConfigPath(cwd, explicitConfig);
  if (!path) return [];
  const href = pathToFileURL(path).href;
  const mod = (await import(href)) as Record<string, unknown>;
  return extractPluginsFromModule(mod);
}

export function parseCommaSpecs(specs?: string): string[] {
  if (!specs?.trim()) return [];
  return specs
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function loadFlagPlugins(
  cwd: string,
  pluginSpecs?: string,
): Promise<MarkdownPlugin[]> {
  const parts = parseCommaSpecs(pluginSpecs);
  const out: MarkdownPlugin[] = [];
  for (const p of parts) {
    out.push(...(await importPluginModule(cwd, p)));
  }
  return out;
}

export async function resolveCliMarkdownPlugins(opts: {
  cwd: string;
  base: MarkdownPlugin[];
  config?: string;
  pluginSpecs?: string;
}): Promise<MarkdownPlugin[]> {
  const fromConfig = await loadConfigFilePlugins(opts.cwd, opts.config);
  const fromFlags = await loadFlagPlugins(opts.cwd, opts.pluginSpecs);
  return [...opts.base, ...fromConfig, ...fromFlags];
}
