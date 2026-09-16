import { createCookieSessionStorage } from "react-router";
import { Locale, isValidLocale, DEFAULT_LOCALE } from "@app/locales";
import { SESSION_SECRET } from "./shared";

const LOCALE_SESSION_KEY = "locale";

const localeStorage = createCookieSessionStorage({
  cookie: {
    name: "locale_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// Recommends Chinese when the browser's Accept-Language header includes "zh",
// otherwise falls back to the default locale.
const detectLocaleFromHeader = (acceptLanguage: string | null): Locale => {
  if (acceptLanguage && acceptLanguage.toLowerCase().includes("zh")) {
    return Locale.ZH;
  }
  return DEFAULT_LOCALE;
};

export const getLocaleSession = async (request: Request) => {
  const session = await localeStorage.getSession(request.headers.get("Cookie"));

  return {
    getLocale: (): Locale | undefined => {
      const locale = session.get(LOCALE_SESSION_KEY) as Locale | undefined;
      return isValidLocale(locale) ? locale : undefined;
    },
    getLocaleOrDetect: (): Locale => {
      const locale = session.get(LOCALE_SESSION_KEY) as Locale | undefined;
      if (isValidLocale(locale)) return locale;
      return detectLocaleFromHeader(request.headers.get("Accept-Language"));
    },
    setLocale: (locale: Locale) => {
      if (isValidLocale(locale)) session.set(LOCALE_SESSION_KEY, locale);
    },
    commit: () => localeStorage.commitSession(session, { expires: new Date("2088-10-18") }),
  };
};
