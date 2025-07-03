import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

// Vuetify instance
export const vuetify = createVuetify({
  components,
  directives,
});

// Polyfill ResizeObserver globally
import ResizeObserver from "resize-observer-polyfill";
global.ResizeObserver = ResizeObserver;

// Create a globally reusable Testing Pinia instance with spy
export function createPiniaTestingPlugin(initialState = {}) {
  return createTestingPinia({
    initialState,
    createSpy: vi.fn,
    stubActions: false,
  });
}
