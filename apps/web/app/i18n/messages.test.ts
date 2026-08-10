import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, locales, normalizeLocale } from "./config";
import { dictionaries, translate, type MessageKey } from "./messages";

describe("i18n dictionaries", () => {
  it("supports zh and en locales", () => {
    expect(locales).toEqual(["zh", "en"]);
    expect(defaultLocale).toBe("zh");
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("nope")).toBe("zh");
  });

  it("keeps zh/en key parity", () => {
    const zhKeys = Object.keys(dictionaries.zh).sort();
    const enKeys = Object.keys(dictionaries.en).sort();
    expect(enKeys).toEqual(zhKeys);
  });

  it("translates main-path keys", () => {
    expect(translate("zh", "home.title2")).toContain("CA");
    expect(translate("en", "home.title2")).toMatch(/check the CA/i);
    expect(translate("zh", "nav.scanNow")).toBe("立即安检");
    expect(translate("en", "nav.scanNow")).toBe("Scan now");
    expect(translate("en", "mode.mock.badge")).toBe("MOCK");
    expect(translate("zh", "home.alertMock")).toBe("V0 MOCK");
  });

  it("covers wallet scan + revoke safety copy", () => {
    expect(translate("zh", "walletScan.step.spenders")).toMatch(/Spender|授权/);
    expect(translate("en", "walletScan.step.spenders")).toMatch(/spender/i);
    expect(translate("zh", "revoke.safeOnlyRevoke")).toMatch(/撤销|Revoke/);
    expect(translate("en", "revoke.safeNoTransfer")).toMatch(/not transfer|assets/i);
    expect(translate("zh", "revoke.safeGas")).toMatch(/不垫付|Gas/);
    expect(translate("en", "revoke.safeGas")).toMatch(/does not sponsor|gas/i);
  });

  it("falls back when key missing for a locale object", () => {
    const key = "brand.name" as MessageKey;
    expect(translate("zh", key)).toBe("ChainVigil");
    expect(translate("en", key)).toBe("ChainVigil");
  });
});
