import { en, mn } from "@inariwrite/i18n";
import { useMarkdownPreview } from "./hooks/useMarkdownPreview.js";
import { persistLocale, readInitialLang } from "./i18n/init.js";
import { persistTheme, readStoredTheme, type Theme } from "./theme/storage.js";
import { lazy, Suspense, useCallback, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

const MarkdownEditor = lazy(async () => {
  const m = await import("./MarkdownEditor.js");
  return { default: m.MarkdownEditor };
});

const btnBase =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:outline-blue-400";

const btnSecondary =
  "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600";

const btnPrimary =
  "border-transparent bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700";

const selectStyles =
  "min-h-11 min-w-[7.5rem] max-w-full touch-manipulation rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:outline-blue-400";

export function EditorWorkspace() {
  const { t, i18n } = useTranslation();
  const [markdown, setMarkdown] = useState<string>(() => {
    const lng = readInitialLang();
    return lng === "en" ? en["welcome.doc"] : mn["welcome.doc"];
  });
  const [filename, setFilename] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { html, error } = useMarkdownPreview(markdown);

  const onOpenClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setMarkdown(text);
      setFilename(file.name);
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const onSaveClick = useCallback(() => {
    const name = filename?.endsWith(".md") ? filename : `${filename ?? "document"}.md`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, [filename, markdown]);

  const onThemeChange = useCallback((next: Theme) => {
    setTheme(next);
    persistTheme(next);
  }, []);

  const onLanguageChange = useCallback((lng: "mn" | "en") => {
    persistLocale(lng);
  }, []);

  const displayName = filename ?? t("status.unnamed");

  return (
    <div className="relative flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        className="skip-link absolute left-4 top-4 z-50 -translate-y-[220%] rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-150 focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-blue-500"
        href="#main-content"
      >
        {t("a11y.skipToContent")}
      </a>

      <header
        className="flex flex-col gap-4 border-b border-slate-200/90 bg-white/90 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-3 sm:pb-3 sm:pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-6"
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-lg font-bold tracking-tight sm:text-xl">{t("app.title")}</span>
          <span className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t("app.tagline")}
          </span>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            className="sr-only"
            aria-label={t("toolbar.open")}
            onChange={onFileChange}
          />
          <button type="button" className={`${btnBase} ${btnSecondary}`} onClick={onOpenClick}>
            {t("toolbar.open")}
          </button>
          <button type="button" className={`${btnBase} ${btnPrimary}`} onClick={onSaveClick}>
            {t("toolbar.save")}
          </button>
          <span
            className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block dark:bg-slate-600"
            aria-hidden
          />

          <label
            className="text-xs font-medium text-slate-500 dark:text-slate-400"
            htmlFor="theme-select"
          >
            {t("toolbar.themeLight")}/{t("toolbar.themeDark")}
          </label>
          <select
            id="theme-select"
            className={selectStyles}
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            aria-label={`${t("toolbar.themeLight")}, ${t("toolbar.themeDark")}`}
          >
            <option value="light">{t("toolbar.themeLight")}</option>
            <option value="dark">{t("toolbar.themeDark")}</option>
          </select>

          <label
            className="text-xs font-medium text-slate-500 dark:text-slate-400"
            htmlFor="lang-select"
          >
            {t("toolbar.language")}
          </label>
          <select
            id="lang-select"
            className={selectStyles}
            value={i18n.language.startsWith("mn") ? "mn" : "en"}
            onChange={(e) => onLanguageChange(e.target.value as "mn" | "en")}
            aria-label={t("toolbar.language")}
          >
            <option value="mn">{t("lang.mn")}</option>
            <option value="en">{t("lang.en")}</option>
          </select>
        </div>
      </header>

      <main
        id="main-content"
        className="main-content flex min-h-0 flex-1 flex-col outline-none focus:outline-none"
        tabIndex={-1}
      >
        <div
          className="border-b border-slate-200 bg-slate-100/90 px-4 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 sm:px-5 lg:px-6"
          role="status"
        >
          <span>
            {t("status.filename")}: <strong className="font-semibold text-slate-800 dark:text-slate-200">{displayName}</strong>
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(38vh,1fr)_minmax(38vh,1fr)] gap-px bg-slate-200 dark:bg-slate-800 lg:grid-cols-2 lg:grid-rows-1">
          <section
            className="flex min-h-0 min-w-0 flex-col bg-white dark:bg-slate-950"
            aria-labelledby="editor-heading"
          >
            <h2
              id="editor-heading"
              className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              {t("editor.label")}
            </h2>
            <Suspense
              fallback={
                <div
                  className="editor-mount flex min-h-[12rem] flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400"
                  role="status"
                >
                  {t("editor.loading")}
                </div>
              }
            >
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                theme={theme}
                ariaLabel={t("editor.aria")}
              />
            </Suspense>
          </section>

          <section
            className="flex min-h-0 min-w-0 flex-col border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:border-l lg:border-t-0"
            aria-labelledby="preview-heading"
          >
            <h2
              id="preview-heading"
              className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              {t("preview.label")}
            </h2>
            {error ? (
              <div
                className="border-b border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/35"
                role="alert"
              >
                <p className="m-0 text-sm font-medium text-red-700 dark:text-red-300">{t(error)}</p>
              </div>
            ) : null}
            {!error && html ? (
              <div
                className="preview markdown-body min-h-0 flex-1 overflow-auto overscroll-contain p-4 sm:p-5"
                // Sanitized HTML from @inariwrite/core (unified + rehype-sanitize).
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
            {!error && !html ? (
              <p className="preview-placeholder m-0 p-4 text-sm text-slate-500 dark:text-slate-400 sm:p-5">
                {t("preview.empty")}
              </p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
