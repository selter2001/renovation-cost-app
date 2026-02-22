import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import pl from "./locales/pl/common.json";
import en from "./locales/en/common.json";

export const resources = {
  pl: { common: pl },
  en: { common: en },
} as const;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pl",
    defaultNS: "common",
    supportedLngs: ["pl", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "renocost-lng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
