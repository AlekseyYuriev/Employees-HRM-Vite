import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { describe, expect, it, vi } from "vitest";
import { createPiniaTestingPlugin, i18n, vuetify } from "../setup";
import BreadCrumbs from "../../src/components/BreadCrumbs.vue";
import { useBreadCrumbsStore } from "../../src/store/breadCrumbs";

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/users", name: "Users", component: { render: () => null } },
    {
      path: "/users/:id",
      name: "UserDetail",
      component: { render: () => null },
    },
    { path: "/cvs/:id", name: "CvDetail", component: { render: () => null } },
    {
      path: "/users/:id/:tab",
      name: "UserTab",
      component: { render: () => null },
    },
  ],
});

vi.mock("@/services/users/users", () => ({
  getUserNameDataById: vi.fn().mockResolvedValue({
    email: "test@example.com",
    profile: {
      full_name: "John Doe",
    },
  }),
}));

vi.mock("@/services/cvs/cvs", () => ({
  getCvNameDataById: vi.fn().mockResolvedValue({
    name: "CV 1",
  }),
}));

describe("BreadCrumbs", () => {
  it("renders home breadcrumb", async () => {
    mockRouter.push("/users");
    await mockRouter.isReady();

    const wrapper = mount(BreadCrumbs, {
      global: {
        plugins: [createPiniaTestingPlugin, mockRouter, i18n, vuetify],
      },
    });

    expect(wrapper.text()).toContain("Home");
  });

  it("renders breadcrumbs for user profile", async () => {
    mockRouter.push("/users/123");
    await mockRouter.isReady();

    const wrapper = mount(BreadCrumbs, {
      global: {
        plugins: [createPiniaTestingPlugin, mockRouter, i18n, vuetify],
      },
    });

    // ensures we wait for the DOM to update after async form submission
    await flushPromises();
    expect(wrapper.text()).toContain("John Doe");
  });

  it("renders breadcrumbs for CV page", async () => {
    mockRouter.push("/cvs/456");
    await mockRouter.isReady();

    const wrapper = mount(BreadCrumbs, {
      global: {
        plugins: [createPiniaTestingPlugin, mockRouter, i18n, vuetify],
      },
    });

    await flushPromises();
    expect(wrapper.text()).toContain("CV 1");
  });

  it("updates entity name reactively", async () => {
    const wrapper = mount(BreadCrumbs, {
      global: {
        plugins: [createPiniaTestingPlugin, mockRouter, i18n, vuetify],
      },
    });

    const breadCrumbsStore = useBreadCrumbsStore();
    breadCrumbsStore.newEnityName = "Overwritten Name";

    await flushPromises();
    expect(wrapper.text()).toContain("Overwritten Name");
  });
});
