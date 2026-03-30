import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ko from "./locales/ko.json";
import en from "./locales/en.json";

const resources = {
  ko: { translation: ko },
  en: { translation: en },
};

if (!i18n.isInitialized) {
  // Always initialize with "ko" so SSR and client hydration match
  i18n.use(initReactI18next).init({
    resources,
    lng: "ko",
    fallbackLng: "ko",
    interpolation: { escapeValue: false },
  });
}

/**
 * Call this from a useEffect to switch to the user's preferred language
 * AFTER hydration is complete. This avoids SSR/client mismatch.
 */
export function detectAndApplyLanguage() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("i18nextLng");
  const detected = stored || navigator.language?.split("-")[0];
  if (detected && detected !== i18n.language && resources[detected as keyof typeof resources]) {
    i18n.changeLanguage(detected);
  }
}

export default i18n;
