import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia, storeToRefs } from "pinia";
import { useBreadCrumbsStore } from "../../src/store/breadCrumbs";

describe("breadCrumbs store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should have newEnityName as null by default", () => {
    const store = useBreadCrumbsStore();
    const { newEnityName } = storeToRefs(store);
    expect(newEnityName.value).toBeNull();
  });

  it("should update newEnityName reactively", () => {
    const store = useBreadCrumbsStore();
    const { newEnityName } = storeToRefs(store);
    newEnityName.value = "Test Entity";
    expect(store.newEnityName).toBe("Test Entity");
    // Also check reactivity
    store.newEnityName = "Another Entity";
    expect(newEnityName.value).toBe("Another Entity");
  });
});
