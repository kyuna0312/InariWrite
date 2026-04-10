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
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        {t("a11y.skipToContent")}
      </a>
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">{t("app.title")}</span>
          <span className="brand-sub">{t("app.tagline")}</span>
        </div>
        <div className="toolbar">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            className="sr-only"
            aria-label={t("toolbar.open")}
            onChange={onFileChange}
          />
          <button type="button" className="btn" onClick={onOpenClick}>
            {t("toolbar.open")}
          </button>
          <button type="button" className="btn btn-primary" onClick={onSaveClick}>
            {t("toolbar.save")}
          </button>
          <span className="toolbar-sep" aria-hidden />
          <label className="toolbar-label" htmlFor="theme-select">
            {t("toolbar.themeLight")}/{t("toolbar.themeDark")}
          </label>
          <select
            id="theme-select"
            className="select"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            aria-label={`${t("toolbar.themeLight")}, ${t("toolbar.themeDark")}`}
          >
            <option value="light">{t("toolbar.themeLight")}</option>
            <option value="dark">{t("toolbar.themeDark")}</option>
          </select>
          <label className="toolbar-label" htmlFor="lang-select">
            {t("toolbar.language")}
          </label>
          <select
            id="lang-select"
            className="select"
            value={i18n.language.startsWith("mn") ? "mn" : "en"}
            onChange={(e) => onLanguageChange(e.target.value as "mn" | "en")}
            aria-label={t("toolbar.language")}
          >
            <option value="mn">{t("lang.mn")}</option>
            <option value="en">{t("lang.en")}</option>
          </select>
        </div>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        <div className="status-bar" role="status">
          <span className="status-text">
            {t("status.filename")}: <strong>{displayName}</strong>
          </span>
        </div>

        <div className="panes">
          <section className="pane pane-editor" aria-labelledby="editor-heading">
            <h2 id="editor-heading" className="pane-title">
              {t("editor.label")}
            </h2>
            <Suspense
              fallback={
                <div className="editor-mount editor-loading" role="status">
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
          <section className="pane pane-preview" aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="pane-title">
              {t("preview.label")}
            </h2>
            {error ? (
              <div className="preview-error-banner" role="alert">
                <p className="preview-error">{t(error)}</p>
              </div>
            ) : null}
            {!error && html ? (
              <div
                className="preview markdown-body"
                // Sanitized HTML from @inariwrite/core (unified + rehype-sanitize).
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
            {!error && !html ? <p className="preview-placeholder">{t("preview.empty")}</p> : null}
          </section>
        </div>
      </main>
    </div>
  );
}
