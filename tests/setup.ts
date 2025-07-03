import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import { createI18n } from "vue-i18n";
import en from "../src/plugins/i18n/locales/en.json";
import ResizeObserver from "resize-observer-polyfill";

// Vuetify instance
export const vuetify = createVuetify({
  components,
  directives,
});

// Polyfill ResizeObserver globally
global.ResizeObserver = ResizeObserver;

// I18n instance
export const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en,
  },
  globalInjection: true,
});

// Create a globally reusable Testing Pinia instance with spy
export function createPiniaTestingPlugin(initialState = {}) {
  return createTestingPinia({
    initialState,
    createSpy: vi.fn,
    stubActions: false,
  });
}
