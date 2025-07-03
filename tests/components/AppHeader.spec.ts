import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { createI18n } from "vue-i18n";
import { createPiniaTestingPlugin, vuetify } from "../setup";
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

describe("AppHeader", () => {
  it("should render template with class toolbar", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: false };
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });
    expect(wrapper.find(".app-header__buttons").exists()).toBeTruthy();
    expect(wrapper.find(".app-header").exists()).toBeTruthy();
  });

  it("should render template with class app-header", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
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
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });
    expect(wrapper.find(".empty-header").exists()).toBeTruthy();
  });

  it("renders first letter of fullName as initials", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };

    const pinia = createPiniaTestingPlugin({
      authStore: {
        user: { fullName: "John Doe", email: "john@example.com" },
      },
    });

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, vuetify, i18n],
      },
    });

    expect(wrapper.find(".toolbar__name").text()).toBe("J");
  });

  it("renders first letter of email if fullName missing", () => {
    routeMock.value.meta = { notFound: false, requiresAuth: true };

    const pinia = createPiniaTestingPlugin({
      authStore: {
        user: { fullName: "", email: "alice@example.com" },
      },
    });

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, vuetify, i18n],
      },
    });

    expect(wrapper.find(".toolbar__name").text()).toBe("A");
  });
});
