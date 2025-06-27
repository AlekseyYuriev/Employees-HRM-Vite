import { afterEach, describe, expect, it, vi } from "vitest";
import { appTheme, getThemeValue } from "../../src/utils/theme";

const localStorageKey = "theme";

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
    })),
  });
};

describe("theme util", () => {
  describe("getThemeValue", () => {
    it("should return 'light'", () => {
      expect(getThemeValue("Light")).toBe("light");
    });

    it("should return 'dark'", () => {
      expect(getThemeValue("Dark")).toBe("dark");
    });

    it("should return 'light'", () => {
      mockMatchMedia(false);

      expect(getThemeValue("Device settings")).toBe("light");
    });

    it("should return 'dark'", () => {
      mockMatchMedia(true);

      expect(getThemeValue("Device settings")).toBe("dark");
    });
  });

  describe("appTheme", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    afterEach(() => {
      localStorage.clear();
      getItemSpy.mockClear();
    });

    it("should return localTheme if it's valid", () => {
      localStorage.setItem(localStorageKey, "Light");
      expect(appTheme()).toBe("Light");
    });

    it("should return localTheme if it's valid", () => {
      localStorage.setItem(localStorageKey, "Device settings");
      expect(appTheme()).toBe("Device settings");
    });

    it("should return localTheme if it's valid", () => {
      expect(appTheme()).toBe("Dark");
    });
  });
});
