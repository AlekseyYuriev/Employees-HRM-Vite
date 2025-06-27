import { afterEach, describe, expect, it, vi } from "vitest";
import getUserLocale from "../../src/utils/getUserLocale";

const defaultLocale = process.env.VITE_DEFAULT_LOCALE;
const localStorageKey = "language";
const userOrBrowserLangSupported = "de";

describe("getUserLocale util", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
  });

  it("should return default locale", () => {
    const locale = getUserLocale();

    expect(locale).toBe(defaultLocale);
  });

  it("should return user preference locale if it is supported", () => {
    localStorage.setItem(localStorageKey, userOrBrowserLangSupported);

    expect(getUserLocale()).toStrictEqual(userOrBrowserLangSupported);
    expect(getItemSpy).toHaveBeenCalledWith(localStorageKey);
  });

  it("should return default locale if user preference locale is not supported", () => {
    const userLangNotSupported = "fr";
    localStorage.setItem(localStorageKey, userLangNotSupported);

    expect(getUserLocale()).toStrictEqual(defaultLocale);
    expect(getItemSpy).toHaveBeenCalledWith(localStorageKey);
  });

  it("should return browser lang if it is supported", () => {
    vi.stubGlobal("navigator", {
      language: "de-DE",
    });

    expect(getUserLocale()).toStrictEqual(userOrBrowserLangSupported);
    vi.restoreAllMocks();
  });

  it("should return default locale if browser lang is not supported", () => {
    vi.stubGlobal("navigator", {
      language: "fr-FR",
    });

    expect(getUserLocale()).toStrictEqual(defaultLocale);
    vi.restoreAllMocks();
  });
});
