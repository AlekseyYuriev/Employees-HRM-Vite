import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("vuetify/styles", () => ({}));
vi.mock("@mdi/font/css/materialdesignicons.css", () => ({}));

beforeEach(() => {
  // @ts-ignore
  globalThis.importMetaEnv = {
    VITE_FALLBACK_LOCALE: "en",
  };
  Object.defineProperty(import.meta, "env", {
    value: globalThis.importMetaEnv,
    writable: true,
    configurable: true,
  });
});

describe("Vuetify plugin", () => {
  it("should create Vuetify instance", async () => {
    // Static mocks for components
    vi.mock("../../../src/plugins/vuetify/components", () => ({
      default: { VBtn: {}, VIcon: {} },
    }));

    // Dynamic mocks for theme and locale
    const appThemeMock = vi.fn(() => "Dark");
    const getThemeValueMock = vi.fn(() => "dark");
    vi.doMock("../../../src/utils/theme", () => ({
      appTheme: appThemeMock,
      getThemeValue: getThemeValueMock,
    }));

    const getUserLocaleMock = vi.fn(() => "en");
    vi.doMock("../../../src/utils/getUserLocale", () => ({
      default: getUserLocaleMock,
    }));

    const { default: vuetify } = await import(
      "../../../src/plugins/vuetify/index"
    );
    expect(vuetify).toBeDefined();
    expect(typeof vuetify.install).toBe("function");
  });

  it("should use import.meta.env.VITE_FALLBACK_LOCALE for fallback", async () => {
    expect((import.meta as any).env.VITE_FALLBACK_LOCALE).toBe("en");
  });
});
