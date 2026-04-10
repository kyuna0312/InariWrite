import { resources } from "@inariwrite/i18n";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const LANG_STORAGE_KEY = "inariwrite-lang";

export function readInitialLang(): "mn" | "en" {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v === "en" || v === "mn") return v;
  } catch {
    //
  }
  return "mn";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      mn: { translation: resources.mn.translation },
      en: { translation: resources.en.translation },
    },
    lng: readInitialLang(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
  document.documentElement.lang = i18n.language;
}

export function persistLocale(lng: "mn" | "en"): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lng);
  } catch {
    //
  }
  void i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
}

export { i18n };
