import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useAuthStore } from "../../src/store/authStore";
import AppHeader from "../../src/components/AppHeader.vue";

const routeMock = ref({
  fullPath: "/",
  meta: {
    notFound: false,
    requiresAuth: true,
  },
});

vi.mock("vue-router", () => ({
  useRoute: () => ({
    fullPath: routeMock.value.fullPath,
    meta: routeMock.value.meta,
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      appHeader: {
        btnLogin: "btnLogin",
        btnSignup: "btnSignup",
      },
      navigation: {
        Home: "Home",
        Employees: "Employees",
        Projects: "Projects",
        CVs: "CVs",
        Departments: "Departments",
        Positions: "Positions",
        Skills: "Skills",
        Languages: "Languages",
      },
    },
  },
  globalInjection: true,
});

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("AppHeader", () => {
  it("should render template with class toolbar", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: false };
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), vuetify, i18n],
      },
    });
    expect(wrapper.find(".app-header__buttons").exists()).toBeTruthy();
    expect(wrapper.find(".app-header").exists()).toBeTruthy();
  });

  it("should render template with class app-header", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), vuetify, i18n],
      },
    });
    expect(wrapper.find(".toolbar").exists()).toBeTruthy();
    expect(wrapper.find(".v-app-bar-nav-icon").exists()).toBeTruthy();
    expect(wrapper.find(".toolbar__select-lang").exists()).toBeTruthy();
  });

  it("should render template with class empty-header", () => {
    routeMock.value.meta = { notFound: true, requiresAuth: false };
    routeMock.value.fullPath = "/not-existing-page";
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), vuetify, i18n],
      },
    });
    expect(wrapper.find(".empty-header").exists()).toBeTruthy();
  });

  it("renders first letter of fullName as initials", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), vuetify, i18n],
      },
    });

    const authStore = useAuthStore();
    authStore.user = { fullName: "John Doe", email: "john@example.com" };

    // Vue does not reactively update after mounting when you assign like this
    // So you must force an update:
    wrapper.vm.$forceUpdate();

    // Or better, mount only after setting user
    // So we can remount:
    wrapper.unmount();

    const wrapper2 = mount(AppHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authStore: {
                user: { fullName: "John Doe", email: "john@example.com" },
              },
            },
            createSpy: vi.fn,
          }),
          vuetify,
          i18n,
        ],
      },
    });

    expect(wrapper2.find(".toolbar__name").text()).toBe("J");
  });

  it("renders first letter of email if fullName missing", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authStore: {
                user: { fullName: "", email: "alice@example.com" },
              },
            },
            createSpy: vi.fn,
          }),
          vuetify,
          i18n,
        ],
      },
    });

    expect(wrapper.find(".toolbar__name").text()).toBe("A");
  });
});
