import { Locale, Translation } from "./types";
import { en } from "./en";
import { zh } from "./zh";

export * from "./types";

export const dictionaries: Record<Locale, Translation> = {
  [Locale.EN]: en,
  [Locale.ZH]: zh,
};
