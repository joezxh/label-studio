import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "zh-CN", label: "简体中文", short: "中" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const LANGUAGE_STORAGE_KEY = "ls-language";

function isSupported(code: string | null): code is LanguageCode {
  return code === "en" || code === "zh-CN";
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupported(stored)) return stored;
  const nav = window.navigator?.language?.toLowerCase() ?? "";
  if (nav.startsWith("zh")) return "zh-CN";
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: LanguageCode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

const resources = {
  en: { translation: en },
  "zh-CN": { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "zh-CN"],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export const i18nInstance = i18n;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<LanguageCode>(getStoredLanguage());

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLangState(lang);
    setStoredLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => useContext(LanguageContext);

/** Primary translation hook. Mirrors react-i18next's useTranslation. */
export const useAppTranslation = useTranslation;

export default i18n;
