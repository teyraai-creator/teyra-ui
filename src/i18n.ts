import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

// Берём сохранённый язык или по умолчанию "ru"
const saved = (typeof window !== "undefined" && localStorage.getItem("teyra_lang")) || "ru";
const initialLang = ["ru", "en", "de"].includes(saved) ? saved : "ru";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      de: { translation: de },
    },
    lng: initialLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Вспомогательная функция — можно вызывать на маршрутах
export function applyLangFromStorage() {
  const v = localStorage.getItem("teyra_lang");
  if (v && i18n.language !== v) {
    i18n.changeLanguage(v);
  }
}

export default i18n;