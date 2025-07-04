import { describe, it, expect, vi, beforeEach } from "vitest";

// Always reset modules and mocks before each test
beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("toastifyConfig plugin", () => {
  it("should export clearOnUrlChange as false", async () => {
    const toastifyConfig = (await import("../../src/plugins/toastifyConfig"))
      .default;
    expect(toastifyConfig.clearOnUrlChange).toBe(false);
  }, 10000);

  it("should use getThemeValue(appTheme()) for theme", async () => {
    const fakeTheme = "Light";
    const fakeThemeValue = "light";
    const themeUtils = await import("../../src/utils/theme");
    const appThemeSpy = vi
      .spyOn(themeUtils, "appTheme")
      .mockReturnValue(fakeTheme);
    const getThemeValueSpy = vi
      .spyOn(themeUtils, "getThemeValue")
      .mockReturnValue(fakeThemeValue as any);
    const toastifyConfig = (await import("../../src/plugins/toastifyConfig"))
      .default;
    expect(appThemeSpy).toHaveBeenCalled();
    expect(getThemeValueSpy).toHaveBeenCalledWith(fakeTheme);
    expect(toastifyConfig.theme).toBe(fakeThemeValue);
  });

  it("should handle all ITheme values for theme", async () => {
    const themes = ["Light", "Dark", "Device settings"] as const;
    const themeValues = {
      Light: "light",
      Dark: "dark",
      "Device settings": "dark",
    };
    for (const t of themes) {
      vi.resetModules();
      const themeUtils = await import("../../src/utils/theme");
      vi.spyOn(themeUtils, "appTheme").mockReturnValue(t);
      vi.spyOn(themeUtils, "getThemeValue").mockImplementation(
        (theme) => themeValues[theme as keyof typeof themeValues] as any
      );
      const toastifyConfig = (await import("../../src/plugins/toastifyConfig"))
        .default;
      expect(toastifyConfig.theme).toBe(themeValues[t]);
    }
  });
});
