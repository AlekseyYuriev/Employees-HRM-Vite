import { beforeEach, describe, expect, it, vi } from "vitest";

import { createPinia, setActivePinia } from "pinia";
import { toast, Id, type Content, ToastOptions } from "vue3-toastify";

import { useToastStore } from "../../src/store/toast";
import useToast from "../../src/composables/useToast";

// add const for toastId
const mockToastId: Id = "mock-toast-id";

vi.mock("vue3-toastify", () => ({
  toast: Object.assign(
    vi.fn(() => mockToastId),
    {
      remove: vi.fn(),
      POSITION: { BOTTOM_CENTER: "bottom-center" },
    }
  ),
}));

describe("useToast composable", () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("should have currToastId equal to null", () => {
    const { currToastId } = useToastStore();

    expect(currToastId).toBeNull();
  });

  it("check error toast", () => {
    const mockErrorMessage: Content = "Error message";
    const mockToastData: ToastOptions = {
      type: "error",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    };

    const toastStore = useToastStore();
    const { setErrorToast, removeCurrToast } = useToast();

    setErrorToast(mockErrorMessage);

    expect(toast).toHaveBeenCalledWith(mockErrorMessage, mockToastData);

    expect(toastStore.currToastId).toBe(mockToastId);

    removeCurrToast();

    expect(toast.remove).toHaveBeenCalledWith(mockToastId);
    expect(toastStore.currToastId).toBeNull();
  });
});
