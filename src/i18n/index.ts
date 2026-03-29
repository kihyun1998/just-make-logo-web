import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ko from "./locales/ko.json";
import en from "./locales/en.json";

const resources = {
  ko: { translation: ko },
  en: { translation: en },
};

if (!i18n.isInitialized) {
  const instance = i18n.use(initReactI18next);

  if (typeof window !== "undefined") {
    instance.use(LanguageDetector);
  }

  instance.init({
    resources,
    lng: typeof window === "undefined" ? "ko" : undefined,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    ...(typeof window !== "undefined" && {
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    }),
  });
}

export default i18n;
