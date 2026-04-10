const STORAGE_KEY = "inariwrite-theme";

export type Theme = "light" | "dark";

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    //
  }
  return "light";
}

function syncDomTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    //
  }
  syncDomTheme(theme);
}

export function applyTheme(theme: Theme): void {
  syncDomTheme(theme);
}
