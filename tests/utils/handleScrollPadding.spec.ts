import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia, storeToRefs } from "pinia";

import { useScrollbarWidth } from "../../src/store/scrollbarWidth";
import handleScrollPadding from "../../src/utils/handleScrollPadding";

describe("handleScrollPadding util", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it("documentElement style overflowY should be 'hidden' and scrollbarWidth should be undefined", () => {
    Object.defineProperty(document.body, "offsetHeight", {
      value: 500,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    const { scrollbarWidth } = storeToRefs(useScrollbarWidth());
    handleScrollPadding(true);

    expect(document.documentElement.style.overflowY).toBe("hidden");
    expect(scrollbarWidth.value).toBeUndefined();
  });

  it("documentElement style overflowY should be 'auto' scrollbarWidth should be undefined", () => {
    Object.defineProperty(document.body, "offsetHeight", {
      value: 1200,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    Object.defineProperty(document.body, "offsetWidth", {
      value: 1188,
      writable: true,
    });

    Object.defineProperty(window, "innerWidth", {
      value: 1200,
      writable: true,
    });

    const { scrollbarWidth } = storeToRefs(useScrollbarWidth());
    handleScrollPadding(false);

    expect(document.documentElement.style.overflowY).toBe("auto");
    expect(scrollbarWidth.value).toBeUndefined();
  });

  it("documentElement style overflowY should be 'hidden' and scrollbarWidth should be correct value", () => {
    Object.defineProperty(document.body, "offsetHeight", {
      value: 1200,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    Object.defineProperty(document.body, "offsetWidth", {
      value: 1188,
      writable: true,
    });

    Object.defineProperty(window, "innerWidth", {
      value: 1200,
      writable: true,
    });

    const { scrollbarWidth } = storeToRefs(useScrollbarWidth());
    handleScrollPadding(true);

    expect(document.documentElement.style.overflowY).toBe("hidden");
    expect(scrollbarWidth.value).toBe("12px");
  });
});
