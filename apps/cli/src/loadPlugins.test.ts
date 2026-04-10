import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  extractPluginsFromModule,
  loadConfigFilePlugins,
  importPluginModule,
  parseCommaSpecs,
} from "./loadPlugins.js";

describe("parseCommaSpecs", () => {
  it("splits and trims", () => {
    expect(parseCommaSpecs("a, b ,./c")).toEqual(["a", "b", "./c"]);
  });
});

describe("extractPluginsFromModule", () => {
  it("reads default markdownPlugins object", () => {
    const p = extractPluginsFromModule({
      default: { markdownPlugins: [{ name: "a", remarkPlugins: [] }] },
    });
    expect(p.map((x) => x.name)).toEqual(["a"]);
  });

  it("reads default plugin", () => {
    const p = extractPluginsFromModule({
      default: { name: "one", remarkPlugins: [] },
    });
    expect(p[0].name).toBe("one");
  });
});

describe("loadConfigFilePlugins", () => {
  it("loads markdownPlugins from inariwrite.config.mjs", async () => {
    const root = mkdtempSync(join(tmpdir(), "inari-cfg-"));
    writeFileSync(
      join(root, "inariwrite.config.mjs"),
      `export default { markdownPlugins: [{ name: "cfg/x", remarkPlugins: [] }] };`,
    );
    const p = await loadConfigFilePlugins(root);
    expect(p.map((x) => x.name)).toEqual(["cfg/x"]);
  });

  it("respects explicit --config path", async () => {
    const root = mkdtempSync(join(tmpdir(), "inari-cfg-"));
    mkdirSync(join(root, "sub"));
    const pth = join(root, "sub", "my.config.mjs");
    writeFileSync(
      pth,
      `export default { markdownPlugins: [{ name: "cfg/y", remarkPlugins: [] }] };`,
    );
    const p = await loadConfigFilePlugins(root, pth);
    expect(p.map((x) => x.name)).toEqual(["cfg/y"]);
  });
});

describe("importPluginModule", () => {
  it("loads fixture ESM plugin", async () => {
    const dir = fileURLToPath(new URL("../test-fixtures", import.meta.url));
    const p = await importPluginModule(dir, "./extraPlugin.mjs");
    expect(p.some((x) => x.name === "fixture/extra-cli-plugin")).toBe(true);
  });
});
