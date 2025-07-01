import { setActivePinia, createPinia } from "pinia";
import { useThemeStore } from "../../src/store/theme";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("theme store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });
    vi.clearAllMocks();
  });

  it('should initialize with default theme "Dark" if localStorage is empty', () => {
    (localStorage.getItem as any).mockReturnValueOnce(null);
    const store = useThemeStore();
    expect(store.currTheme).toBe("Dark");
  });

  it("should initialize with theme from localStorage if valid", () => {
    (localStorage.getItem as any).mockReturnValueOnce("Light");
    const store = useThemeStore();
    expect(store.currTheme).toBe("Light");
  });

  it("should fallback to default theme if localStorage has invalid value", () => {
    (localStorage.getItem as any).mockReturnValueOnce("NotATheme");
    const store = useThemeStore();
    expect(store.currTheme).toBe("Dark");
  });

  it("currTheme should be reactive", () => {
    (localStorage.getItem as any).mockReturnValueOnce("Dark");
    const store = useThemeStore();
    store.currTheme = "Light";
    expect(store.currTheme).toBe("Light");
  });
});
