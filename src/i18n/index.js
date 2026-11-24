import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from '../locales/uk/translation.json';
import en from '../locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: {
        translation: uk,
      },
      en: {
        translation: en,
      },
    },
    lng: 'uk', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;