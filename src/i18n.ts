import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

// Берём сохранённый язык или по умолчанию "ru"
const saved = (typeof window !== "undefined" && localStorage.getItem("teyra_lang")) || "ru";
const initialLang = ["ru", "en", "de"].includes(saved) ? saved : "ru";

// console.log("i18n: Initializing with language:", initialLang);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      de: { translation: de },
    },
    lng: initialLang,
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  .then(() => {
    // console.log("i18n: Initialization completed, current language:", i18n.language);
  })
  .catch((error) => {
    console.error("i18n: Initialization failed:", error);
  });

// Вспомогательная функция — можно вызывать на маршрутах
export function applyLangFromStorage() {
  const v = localStorage.getItem("teyra_lang");
  // console.log("applyLangFromStorage: current language:", i18n.language, "stored language:", v);
  if (v && i18n.language !== v) {
    // console.log("applyLangFromStorage: changing language to:", v);
    i18n.changeLanguage(v).catch(console.error);
  }
}

// Функция для принудительного изменения языка
export function changeLanguage(lang: string) {
  // console.log("changeLanguage: changing to:", lang);
  localStorage.setItem("teyra_lang", lang);
  return i18n.changeLanguage(lang);
}

export default i18n;