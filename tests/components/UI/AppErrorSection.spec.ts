import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { i18n, vuetify } from "../../setup";
import AppErrorSection from "../../../src/components/UI/AppErrorSection.vue";

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: { render: () => null } },
    { path: "/users", name: "Users", component: { render: () => null } },
  ],
});

function mountComponent(errorMessageKey: string) {
  return mount(AppErrorSection, {
    props: {
      errorMessageKey,
    },
    global: {
      plugins: [i18n, vuetify, mockRouter],
    },
  });
}

describe("AppErrorSection.vue", () => {
  it("renders not found error message and a router button", async () => {
    const wrapper = mountComponent("NOT_FOUND_USER");

    expect(wrapper.text()).toContain(
      "The user with specified ID does not exist"
    );

    const button = wrapper.find(".error-wrapper__back-to-main-btn");
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(mockRouter.currentRoute.value.path).toBe("/");

    const tryReload = wrapper.find(".error-wrapper__try-to-reload-label");
    expect(tryReload.exists()).toBe(false);
  });

  it("renders general error and a reload suggestion", () => {
    const wrapper = mountComponent("UNAUTHORIZED_ERROR");

    expect(wrapper.text()).toContain("Unauthorized");

    const button = wrapper.find(".error-wrapper__back-to-main-btn");
    expect(button.exists()).toBe(false);

    const tryReload = wrapper.find(".error-wrapper__try-to-reload-label");
    expect(tryReload.exists()).toBe(true);
    expect(tryReload.text()).toContain("Please try to reload the page");
  });
});
