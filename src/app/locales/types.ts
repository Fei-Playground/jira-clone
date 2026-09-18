export enum Locale {
  EN = "en",
  ZH = "zh",
}

export const locales: Array<Locale> = Object.values(Locale);

export const DEFAULT_LOCALE: Locale = Locale.EN;

export const isValidLocale = (locale: unknown): locale is Locale => {
  return locales.includes(locale as Locale);
};

// Native display name for each locale, shown in the language switcher.
export const localeMeta: Record<Locale, { label: string; nativeLabel: string }> = {
  [Locale.EN]: { label: "English", nativeLabel: "English" },
  [Locale.ZH]: { label: "Chinese", nativeLabel: "简体中文" },
};

// Recursively derives every dot-path key of an object, e.g. "header.about".
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${DeepKeys<T[K]>}` : K;
    }[keyof T & string]
  : never;

export type Translation = typeof import("./en").en;
export type TranslationKey = DeepKeys<Translation>;
