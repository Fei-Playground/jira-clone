// Accepts our app-level Locale ("en" | "zh") and maps it to the matching
// Intl locale tag. Defaults to "en-US" to preserve prior behavior when no
// locale is passed (e.g. call sites that haven't been updated yet).
const INTL_LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  zh: "zh-CN",
};

export const formatDateTime = (timestamp: number, locale?: string): string => {
  const intlLocale = (locale && INTL_LOCALE_MAP[locale]) || "en-US";
  const date = new Date(timestamp).toLocaleDateString(intlLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(timestamp).toLocaleTimeString(intlLocale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${time} · ${date}`;
};
