import { cookies } from "next/headers";
import { defaultLocale, localeCookieName, normalizeLocale, type Locale } from "./config";
import { translate, type MessageKey } from "./messages";

export async function getServerLocale(): Promise<Locale> {
  const jar = await cookies();
  return normalizeLocale(jar.get(localeCookieName)?.value ?? defaultLocale);
}

export async function getServerT() {
  const locale = await getServerLocale();
  return {
    locale,
    t: (key: MessageKey) => translate(locale, key),
  };
}
