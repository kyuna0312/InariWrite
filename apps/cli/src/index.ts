#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cac } from "cac";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readVersion(): string {
  const path = join(__dirname, "..", "package.json");
  const raw = readFileSync(path, "utf8");
  const pkg = JSON.parse(raw) as { version?: string };
  return pkg.version ?? "0.0.0";
}

const cli = cac("inariwrite");

cli.version(readVersion());

cli.help();

cli.parse();
