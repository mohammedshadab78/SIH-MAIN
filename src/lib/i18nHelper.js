// i18nHelper.js - Multilingual Helper Utility for GramSaksham
import { translations } from '../data/translations';

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'en', label: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'mr', label: 'मराठी', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', label: 'বাংলা', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'te', label: 'తెలుగు', nativeName: 'తెలుగు', speechCode: 'te-IN' }
];

// Safely get translation dictionary for a language (defaults to Hindi, fallback to English)
export function getTranslation(lang) {
  return translations[lang] || translations.hi || translations.en;
}

// Localize dataset items with multi-language fields
// Supports item.titleHi, item.titleMr, item.titleBn, item.titleTe, item.title
export function getLocalizedField(item, field, lang = 'hi') {
  if (!item) return '';
  
  if (lang === 'en') {
    return item[field] || item[`${field}En`] || item[`${field}Hi`] || '';
  }
  
  const capLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  const langKey = `${field}${capLang}`; // e.g. titleHi, titleMr, titleBn, titleTe
  
  if (item[langKey]) return item[langKey];
  if (item[`${field}Hi`]) return item[`${field}Hi`];
  return item[field] || '';
}
