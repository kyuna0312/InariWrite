import {
  listRelativeMarkdownFileLinks,
  type MarkdownPlugin,
} from "@inariwrite/core";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type CheckResult = {
  broken: Array<{ href: string; resolved: string; line: number | undefined }>;
};

export function checkMarkdownRelativeLinks(
  markdownFilePath: string,
  plugins: MarkdownPlugin[],
): CheckResult {
  const absMd = resolve(markdownFilePath);
  const markdown = readFileSync(absMd, "utf8");
  const baseDir = dirname(absMd);
  const occ = listRelativeMarkdownFileLinks(markdown, { plugins });
  const broken: CheckResult["broken"] = [];
  for (const o of occ) {
    const resolvedPath = resolve(baseDir, o.pathPart);
    if (!existsSync(resolvedPath)) {
      broken.push({ href: o.href, resolved: resolvedPath, line: o.line });
    }
  }
  return { broken };
}

export function formatCheckReport(
  markdownFilePath: string,
  result: CheckResult,
): string {
  if (result.broken.length === 0) return "";
  const lines = result.broken.map((b) => {
    const loc = b.line != null ? `${markdownFilePath}:${b.line}` : markdownFilePath;
    return `${loc}  broken link ${JSON.stringify(b.href)} -> ${b.resolved}`;
  });
  return lines.join("\n");
}
