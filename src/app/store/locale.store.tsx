import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useFetcher } from "react-router";
import {
  Locale,
  DEFAULT_LOCALE,
  isValidLocale,
  dictionaries,
  TranslationKey,
} from "@app/locales";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

const getByPath = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, obj);

const interpolate = (
  template: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return template;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`{{${key}}}`, String(value)),
    template
  );
};

export const LocaleProvider = ({
  children,
  specifiedLocale,
}: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(
    isValidLocale(specifiedLocale) ? specifiedLocale : DEFAULT_LOCALE
  );

  const persistLocale = useFetcher();
  const persistLocaleRef = useRef(persistLocale);
  useEffect(() => {
    persistLocaleRef.current = persistLocale;
  }, [persistLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    persistLocaleRef.current.submit(
      { locale: newLocale },
      { action: "action/set-locale", method: "post" }
    );
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const value = getByPath(dictionaries[locale], key);
      if (typeof value === "string") return interpolate(value, params);

      // Fall back to English when the current locale is missing the key.
      const fallback = getByPath(dictionaries[DEFAULT_LOCALE], key);
      if (typeof fallback === "string") return interpolate(fallback, params);

      if (process.env.NODE_ENV !== "production") {
        console.warn(`Missing translation for key: "${key}"`);
      }
      return key;
    },
    [locale]
  );

  const value: LocaleContextType = { locale, setLocale, t };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

interface LocaleProviderProps {
  children: JSX.Element;
  specifiedLocale: Locale | undefined;
}

export const useTranslation = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LocaleProvider");
  }
  return context;
};
