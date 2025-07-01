import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useLangStore } from "../../src/store/lang";
import { ref } from "vue";
import fs from "fs";
import path from "path";

const mockSetLocaleMessage = vi.fn();
const mockT = vi.fn((key) => key);
const mockLocale = ref("en");
const mockAvailableLocales = ["en"];
const mockVuetifyCurrentLocale = ref("en");
const mockSetErrorToast = vi.fn();

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: mockT,
    locale: mockLocale,
    availableLocales: mockAvailableLocales,
    setLocaleMessage: mockSetLocaleMessage,
  }),
}));
vi.mock("vuetify", () => ({
  useLocale: () => ({ current: mockVuetifyCurrentLocale }),
}));
vi.mock("@/composables/useToast", () => ({
  default: () => ({ setErrorToast: mockSetErrorToast }),
}));
vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: (e: Error) => ({ message: "MOCKED_ERROR" }),
}));
vi.mock("@/utils/handleNoLangMessage", () => ({
  handleLangLoadErrorMessage: () => "LANG_LOAD_ERROR",
}));

const getMessages = (locale: string) => {
  const jsonPath = path.resolve(
    __dirname,
    `../../src/plugins/i18n/locales/${locale}.json`
  );
  return { default: JSON.parse(fs.readFileSync(jsonPath, "utf-8")) };
};

const importMessages = {
  en: getMessages("en"),
  de: getMessages("de"),
  ru: getMessages("ru"),
};

const dynamicImportMock = vi.fn((path: string) => {
  if (path.includes("en")) return Promise.resolve(importMessages.en);
  if (path.includes("de")) return Promise.resolve(importMessages.de);
  if (path.includes("ru")) return Promise.resolve(importMessages.ru);
  return Promise.reject(new Error("not found"));
});
vi.stubGlobal("import", dynamicImportMock);

describe("useLangStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    mockLocale.value = "en";
    mockVuetifyCurrentLocale.value = "en";
    mockAvailableLocales.length = 0;
    mockAvailableLocales.push("en");
    localStorage.clear();
    document.body.innerHTML = '<html lang="en"></html>';
  });

  it("currLang returns correct language name", () => {
    const store = useLangStore();

    mockLocale.value = "en";
    expect(store.currLang).toBe("English");

    mockLocale.value = "de";
    expect(store.currLang).toBe("Deutsch");

    mockLocale.value = "ru";
    expect(store.currLang).toBe("Русский");
  });

  it("loadLocaleMessages loads and sets locale if not present", async () => {
    mockAvailableLocales.length = 0;
    const store = useLangStore();

    await store.loadLocaleMessages("Deutsch");
    expect(mockSetLocaleMessage).toHaveBeenCalledWith(
      "de",
      importMessages.de.default
    );
  });

  it("loadLocaleMessages does not set locale if already present", async () => {
    mockAvailableLocales.push("de");
    const store = useLangStore();

    await store.loadLocaleMessages("Deutsch");
    expect(mockSetLocaleMessage).not.toHaveBeenCalled();
  });

  it("loadInitialLocale sets locale message", async () => {
    const store = useLangStore();
    await store.loadInitialLocale("en");
    expect(mockSetLocaleMessage).toHaveBeenCalledWith(
      "en",
      importMessages.en.default
    );
  });

  it("loadInitialLocale handles error and shows toast", async () => {
    dynamicImportMock.mockRejectedValueOnce(new Error("fail"));

    const store = useLangStore();
    await store.loadInitialLocale("notfound");
    expect(mockSetErrorToast).toHaveBeenCalledWith("LANG_LOAD_ERROR");
  });

  it("changeCurrLanguage sets correct locale, vuetify, localStorage, and html lang", async () => {
    const store = useLangStore();

    await store.changeCurrLanguage("Deutsch");
    expect(mockLocale.value).toBe("de");
    expect(mockVuetifyCurrentLocale.value).toBe("de");
    expect(localStorage.getItem("language")).toBe("de");
    expect(document.querySelector("html")?.getAttribute("lang")).toBe("de");
  });
});
