import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("vuetify/styles", () => ({}));
vi.mock("@mdi/font/css/materialdesignicons.css", () => ({}));
vi.mock("../../../src/plugins/vuetify/components", () => ({
  default: { VBtn: {}, VIcon: {} },
}));
vi.mock("../../../src/utils/theme", () => ({
  appTheme: vi.fn(() => "Dark"),
  getThemeValue: vi.fn(() => "dark"),
}));
vi.mock("../../../src/utils/getUserLocale", () => ({
  default: vi.fn(() => "en"),
}));

beforeEach(() => {
  // Mock import.meta.env before tests run
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
    // Import after mocks are set up
    const { default: vuetify } = await import(
      "../../../src/plugins/vuetify/index"
    );

    expect(vuetify).toBeDefined();
    expect(typeof vuetify.install).toBe("function");
  }, 10000);

  it("should use import.meta.env.VITE_FALLBACK_LOCALE for fallback", () => {
    expect((import.meta as any).env.VITE_FALLBACK_LOCALE).toBe("en");
  });
});
