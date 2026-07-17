export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const localeCookieName = "cv_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "zh" || value === "en";
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}
