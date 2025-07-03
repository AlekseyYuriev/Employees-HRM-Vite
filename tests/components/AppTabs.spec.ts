import { ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPiniaTestingPlugin, i18n, vuetify } from "../setup";
import { TAB_NAMES } from "../../src/constants/tabs";
import AppTabs from "../../src/components/AppTabs.vue";

const routeMock = ref({
  fullPath: "/users/273/profile",
  meta: {
    notFound: false,
    requiresAuth: true,
    hasTabs: TAB_NAMES.USER,
  },
});

// Add shared pushMock and routerMock
const pushMock = vi.fn();
const routerMock = {
  push: pushMock,
  currentRoute: ref({ params: { userId: 273, cvId: 273 } }),
};

vi.mock("vue-router", () => ({
  useRoute: () => ({
    fullPath: routeMock.value.fullPath,
    meta: routeMock.value.meta,
  }),
  useRouter: () => routerMock,
}));

describe("AppTabs", () => {
  it("should render template with user tabs", () => {
    const wrapper = mount(AppTabs, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });
    const tabTexts = wrapper.findAll(".v-tab").map((tab) => tab.text());
    expect(wrapper.find(".v-tabs").exists()).toBeTruthy();
    expect(wrapper.find(".v-tab").exists()).toBeTruthy();
    expect(tabTexts).toEqual(["Profile", "Skills", "Languages", "CVs"]);
  });

  it("should render template with CVs tabs", () => {
    routeMock.value.fullPath = "/users/273/cvs";
    routeMock.value.meta = {
      notFound: false,
      requiresAuth: true,
      hasTabs: TAB_NAMES.CV,
    };
    const wrapper = mount(AppTabs, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });
    const tabTexts = wrapper.findAll(".v-tab").map((tab) => tab.text());
    expect(wrapper.find(".v-tabs").exists()).toBeTruthy();
    expect(wrapper.find(".v-tab").exists()).toBeTruthy();
    expect(tabTexts).toEqual(["Details", "Skills", "Projects", "Preview"]);
  });

  it("should call router.push with correct user route when user tab clicked", async () => {
    pushMock.mockClear();
    // Set both userId and cvId param for user tab
    routerMock.currentRoute.value = { params: { userId: 273, cvId: 273 } };
    routeMock.value.fullPath = "/users/273/profile";
    routeMock.value.meta = {
      notFound: false,
      requiresAuth: true,
      hasTabs: TAB_NAMES.USER,
    };

    const wrapper = mount(AppTabs, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });

    // Find tab for "Skills" (second tab) and click it
    const skillsTab = wrapper
      .findAll(".v-tab")
      .find((tab) => tab.text() === "Skills");
    await skillsTab?.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/users/273/skills");
  });

  it("should call router.push with correct CV route when CV tab clicked", async () => {
    pushMock.mockClear();
    // Set both userId and cvId param for CV tab
    routerMock.currentRoute.value = { params: { userId: 273, cvId: 273 } };
    routeMock.value.fullPath = "/users/273/cvs";
    routeMock.value.meta = {
      notFound: false,
      requiresAuth: true,
      hasTabs: TAB_NAMES.CV,
    };

    const wrapper = mount(AppTabs, {
      global: {
        plugins: [createPiniaTestingPlugin, vuetify, i18n],
      },
    });

    // Find tab for "Projects" and click it
    const projectsTab = wrapper
      .findAll(".v-tab")
      .find((tab) => tab.text() === "Projects");
    await projectsTab?.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/cvs/273/projects");
  });

  describe("updateTabs logic", () => {
    it("should set userTabs correctly for each user tab route", () => {
      const userTabCases = [
        { path: "/users/273/profile", tab: "Profile", expected: "userProfile" },
        { path: "/users/273/skills", tab: "Skills", expected: "userSkills" },
        {
          path: "/users/273/languages",
          tab: "Languages",
          expected: "userLanguages",
        },
        { path: "/users/273/cvs", tab: "CVs", expected: "userCvs" },
      ];
      for (const { path, tab, expected } of userTabCases) {
        routeMock.value.fullPath = path;
        routeMock.value.meta = {
          notFound: false,
          requiresAuth: true,
          hasTabs: TAB_NAMES.USER,
        };
        routerMock.currentRoute.value = { params: { userId: 273, cvId: 273 } };
        const wrapper = mount(AppTabs, {
          global: {
            plugins: [createPiniaTestingPlugin, vuetify, i18n],
          },
        });
        // The selected tab should have the correct class
        const selected = wrapper.find(".v-tab--selected");
        expect(selected.exists()).toBeTruthy();
        expect(selected.text()).toBe(tab);
      }
    });

    it("should set cvsTabs correctly for each CV tab route", () => {
      const cvTabCases = [
        { path: "/cvs/273/details", tab: "Details", expected: "cvDetails" },
        { path: "/cvs/273/skills", tab: "Skills", expected: "cvSkills" },
        { path: "/cvs/273/projects", tab: "Projects", expected: "cvProjects" },
        { path: "/cvs/273/preview", tab: "Preview", expected: "cvPreview" },
      ];
      for (const { path, tab, expected } of cvTabCases) {
        routeMock.value.fullPath = path;
        routeMock.value.meta = {
          notFound: false,
          requiresAuth: true,
          hasTabs: TAB_NAMES.CV,
        };
        routerMock.currentRoute.value = { params: { userId: 273, cvId: 273 } };
        const wrapper = mount(AppTabs, {
          global: {
            plugins: [createPiniaTestingPlugin, vuetify, i18n],
          },
        });
        // The selected tab should have the correct class
        const selected = wrapper.find(".v-tab--selected");
        expect(selected.exists()).toBeTruthy();
        expect(selected.text()).toBe(tab);
      }
    });
  });
});
