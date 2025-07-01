import { setActivePinia, createPinia } from "pinia";
import { useToastStore } from "../../src/store/toast";
import { describe, it, expect, beforeEach } from "vitest";
import { Id } from "vue3-toastify";

// add const for toastId
const mockToastId: Id = "mock-toast-id";

describe("toast store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize currToastId as null", () => {
    const store = useToastStore();
    expect(store.currToastId).toBeNull();
  });

  it("should allow setting currToastId to a value", () => {
    const store = useToastStore();
    store.currToastId = mockToastId;
    expect(store.currToastId).toBe(mockToastId);
  });

  it("should allow resetting currToastId to null", () => {
    const store = useToastStore();
    store.currToastId = mockToastId;
    expect(store.currToastId).toBe(mockToastId);
    store.currToastId = null;
    expect(store.currToastId).toBeNull();
  });
});
