import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia, storeToRefs } from "pinia";
import { useScrollbarWidth } from "../../src/store/scrollbarWidth";

describe("useScrollbarWidth store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with scrollbarWidth as undefined", () => {
    const { scrollbarWidth } = storeToRefs(useScrollbarWidth());
    expect(scrollbarWidth.value).toBeUndefined();
  });

  it("should be reactive when scrollbarWidth changes", () => {
    const store = useScrollbarWidth();
    const { scrollbarWidth } = storeToRefs(store);
    expect(scrollbarWidth.value).toBeUndefined();
    store.scrollbarWidth = "16px";
    expect(scrollbarWidth.value).toBe("16px");
    store.scrollbarWidth = undefined;
    expect(scrollbarWidth.value).toBeUndefined();
  });

  it("should allow multiple store instances to share state (singleton)", () => {
    const storeA = useScrollbarWidth();
    const storeB = useScrollbarWidth();
    storeA.scrollbarWidth = "8px";
    expect(storeB.scrollbarWidth).toBe("8px");
    storeB.scrollbarWidth = undefined;
    expect(storeA.scrollbarWidth).toBeUndefined();
  });
});
