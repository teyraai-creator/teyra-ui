import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ru from './locales/ru.json'
import en from './locales/en.json'
import de from './locales/de.json'

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  de: { translation: de }
}

let savedLang: "en"|"ru"|"de"|null = null;
try { const l = localStorage.getItem("lang"); if (l === "en" || l === "ru" || l === "de") savedLang = l; } catch {}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
