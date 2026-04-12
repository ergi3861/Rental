// ═══════════════════════════════════════════════════════════════
// AppContext.jsx — Vendos në: src/context/AppContext.jsx
// Menaxhon gjuhën dhe valutën për të gjithë app-in
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

// ── Currency rates (relative to EUR) ──────────────────────────
const CURRENCY_CONFIG = {
  EUR: { symbol: '€', rate: 1, label: 'Euro', code: 'EUR' },
  ALL: { symbol: 'L', rate: 110, label: 'Lekë', code: 'ALL' },
  GBP: { symbol: '£', rate: 0.86, label: 'GBP', code: 'GBP' },
  USD: { symbol: '$', rate: 1.08, label: 'Dollar', code: 'USD' },
};

// ── Language config ────────────────────────────────────────────
const LANGUAGE_CONFIG = {
  sq: { label: 'Shqip', countryCode: 'AL', flag: '🇦🇱' },
  en: { label: 'EN', countryCode: 'GB', flag: '🇬🇧' },
  it: { label: 'IT', countryCode: 'IT', flag: '🇮🇹' },
  fr: { label: 'FR', countryCode: 'FR', flag: '🇫🇷' },
};

// ── Context ────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Lexo nga localStorage ose default
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'sq');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'EUR');

  // Ndrysho gjuhën
  const changeLang = useCallback((newLang) => {
    if (!translations[newLang]) return;
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  // Ndrysho valutën
  const changeCurrency = useCallback((newCurrency) => {
    if (!CURRENCY_CONFIG[newCurrency]) return;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  }, []);

  // Konverto çmimin
  const convertPrice = useCallback(
    (eurPrice) => {
      if (!eurPrice || isNaN(eurPrice)) return null;
      const cfg = CURRENCY_CONFIG[currency];
      return Math.round(parseFloat(eurPrice) * cfg.rate);
    },
    [currency]
  );

  // Formo çmimin me simbolin
  const formatPrice = useCallback(
    (eurPrice, opts = {}) => {
      if (!eurPrice || isNaN(eurPrice)) return '—';
      const cfg = CURRENCY_CONFIG[currency];
      const converted = parseFloat(eurPrice) * cfg.rate;
      const formatted =
        currency === 'ALL'
          ? Math.round(converted).toLocaleString()
          : converted.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
      const suffix = opts.perDay ? translations[lang]?.carDetail?.perDay || '/ditë' : '';
      return `${cfg.symbol}${formatted}${suffix}`;
    },
    [currency, lang]
  );

  // Merr tekstin e përkthyer — t("nav.home")
  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let val = translations[lang];
      for (const k of keys) {
        if (val === undefined) break;
        val = val[k];
      }
      // Fallback tek shqip nëse mungon
      if (val === undefined) {
        let fallback = translations['sq'];
        for (const k of keys) {
          if (fallback === undefined) break;
          fallback = fallback[k];
        }
        return fallback || key;
      }
      return val;
    },
    [lang]
  );

  const value = {
    lang,
    currency,
    changeLang,
    changeCurrency,
    convertPrice,
    formatPrice,
    t,
    currencyConfig: CURRENCY_CONFIG[currency],
    languageConfig: LANGUAGE_CONFIG,
    currencyOptions: CURRENCY_CONFIG,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hooks ──────────────────────────────────────────────────────
export function useApp() {
  return useContext(AppContext);
}
export function useT() {
  return useContext(AppContext).t;
}
export function useCurrency() {
  const { currency, changeCurrency, formatPrice, convertPrice, currencyConfig, currencyOptions } =
    useContext(AppContext);
  return { currency, changeCurrency, formatPrice, convertPrice, currencyConfig, currencyOptions };
}
export function useLang() {
  const { lang, changeLang, languageConfig } = useContext(AppContext);
  return { lang, changeLang, languageConfig };
}

export default AppContext;
