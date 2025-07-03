import { mount, flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/store/authStore";
import AuthForm from "../../src/components/AuthForm.vue";
import { i18n, vuetify } from "../setup"; // Your existing setup
import { ref } from "vue";

const routerPushMock = vi.fn();
const routeMock = ref({
  fullPath: "/sign-in",
  meta: {
    notFound: false,
    requiresAuth: false,
  },
});

vi.mock("vue-router", () => ({
  useRoute: () => ({
    fullPath: routeMock.value.fullPath,
    meta: routeMock.value.meta,
  }),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

const signInProps = {
  title: "Welcome back",
  subtitleText: "Hello again! Sign in to continue.",
  buttonText: "sign in",
  linkText: "i don't have an account",
};

const signUpProps = {
  title: "Register now",
  subtitleText: "Welcome! Sign up to continue.",
  buttonText: "sign up",
  linkText: "i have an account",
};

describe("AuthForm", () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
    vi.clearAllMocks(); // Reset mocks between tests
  });

  it("renders auth form with sign-in content", () => {
    const wrapper = mount(AuthForm, {
      props: signInProps,
      global: {
        plugins: [vuetify, i18n],
        stubs: { "router-link": { template: "<a><slot /></a>" } },
      },
    });

    expect(wrapper.find(".auth__title").text()).toBe("Welcome back");
    expect(wrapper.find(".auth__button").text()).toBe("sign in");
    expect(wrapper.find(".auth__link").text()).toBe("i don't have an account");
  });

  it("submits login form successfully", async () => {
    routeMock.value.fullPath = "/sign-in";
    const loginMock = vi.fn().mockResolvedValue(undefined);
    authStore.loginUser = loginMock;

    const wrapper = mount(AuthForm, {
      props: signInProps,
      global: {
        plugins: [vuetify, i18n],
        stubs: { "router-link": true },
      },
    });

    // Fill in valid input values
    await wrapper.find('input[type="text"]').setValue("test@example.com");
    await wrapper.find('input[type="password"]').setValue("123456");

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(loginMock).toHaveBeenCalledWith("test@example.com", "123456");
    expect(routerPushMock).toHaveBeenCalledWith("/");
    expect(localStorage.getItem("wasAuthorized")).toBe("true");
  });

  it("submits register form successfully", async () => {
    routeMock.value.fullPath = "/sign-up";
    const registerMock = vi.fn().mockResolvedValue(undefined);
    authStore.registerUser = registerMock;

    const wrapper = mount(AuthForm, {
      props: signUpProps,
      global: {
        plugins: [vuetify, i18n],
        stubs: { "router-link": true },
      },
    });

    await wrapper.find('input[type="text"]').setValue("newuser@example.com");
    await wrapper.find('input[type="password"]').setValue("123456");

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(registerMock).toHaveBeenCalledWith("newuser@example.com", "123456");
    expect(routerPushMock).toHaveBeenCalledWith("/");
  });

  it("displays server error on login failure", async () => {
    routeMock.value.fullPath = "/sign-in";
    const errorMock = vi
      .fn()
      .mockRejectedValue(new Error("INVALID_CREDENTIALS"));
    authStore.loginUser = errorMock;

    const wrapper = mount(AuthForm, {
      props: signInProps,
      global: {
        plugins: [vuetify, i18n],
        stubs: { "router-link": true },
      },
    });

    await wrapper.find('input[type="text"]').setValue("fail@example.com");
    await wrapper.find('input[type="password"]').setValue("wrongpass");

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    const errorText = wrapper.find(".auth__form-error-text");
    expect(errorText.exists()).toBe(true);
    expect(errorText.text()).toContain("Email or password is invalid");
  });

  it("toggles password visibility when clicking the eye icon", async () => {
    const wrapper = mount(AuthForm, {
      props: signInProps,
      global: {
        plugins: [vuetify, i18n],
        stubs: { "router-link": true },
      },
    });

    const passwordField = wrapper.findAllComponents({ name: "VTextField" })[1];

    // Initial state should be password
    expect(passwordField.props("type")).toBe("password");

    // Simulate clicking the "append-inner" icon (eye icon)
    await passwordField.vm.$emit("click:append-inner");

    // The type should now be "text"
    expect(passwordField.props("type")).toBe("text");

    // Click again to toggle back
    await passwordField.vm.$emit("click:append-inner");

    expect(passwordField.props("type")).toBe("password");
  });
});
