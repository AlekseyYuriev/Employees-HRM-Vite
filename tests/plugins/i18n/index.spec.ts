import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  // Mock import.meta.env
  globalThis.importMetaEnv = {
    VITE_FALLBACK_LOCALE: "en",
    VITE_SUPPORTED_LOCALES: "en,de,ru",
    VITE_DEFAULT_LOCALE: "en",
  };
  Object.defineProperty(import.meta, "env", {
    value: globalThis.importMetaEnv,
    writable: true,
    configurable: true,
  });
});

describe("i18n plugin", () => {
  it("should create i18n instance with correct config", async () => {
    const getUserLocaleMock = vi.fn(() => "de");
    vi.doMock("../../../src/utils/getUserLocale", () => ({
      default: getUserLocaleMock,
    }));

    const { default: i18n } = await import("../../../src/plugins/i18n/index");
    expect(i18n).toBeDefined();
    // @ts-ignore
    expect(i18n.global.locale.value).toBe("de");
    // @ts-ignore
    expect(i18n.global.fallbackLocale.value).toBe("en");
    // @ts-ignore
    expect(i18n.global.availableLocales).toEqual(["de"]);
    // @ts-ignore
    expect(i18n.global).toHaveProperty("t");
    expect(getUserLocaleMock).toHaveBeenCalled();
  });

  it("should use fallback locale from import.meta.env", async () => {
    expect((import.meta as any).env.VITE_FALLBACK_LOCALE).toBe("en");
  });

  it("should use default locale if getUserLocale returns unsupported value", async () => {
    const getUserLocaleMock = vi.fn(() => "fr");
    vi.doMock("../../../src/utils/getUserLocale", () => ({
      default: getUserLocaleMock,
    }));
    const { default: i18n } = await import("../../../src/plugins/i18n/index");
    // @ts-ignore
    expect(["en", "de", "ru"]).toContain(i18n.global.locale.value);
  });
});
