import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { ROUTES } from "../../src/constants/router";

const mockGetToken = vi.fn();
const mockSetErrorToast = vi.fn();
const mockHandleUnauthorizedMessage = vi.fn(() => "Your session has expired.");

vi.mock("@/composables/useCookies", () => ({
  default: () => ({
    getToken: mockGetToken,
  }),
}));

vi.mock("@/composables/useToast", () => ({
  default: () => ({
    setErrorToast: mockSetErrorToast,
  }),
}));

vi.mock("@/utils/handleNoLangMessage", () => ({
  handleUnauthorizedMessage: mockHandleUnauthorizedMessage,
}));

vi.mock("@/router/pages", () => ({
  default: {
    SignInPage: { template: "<div>Sign In</div>" },
    SignUpPage: { template: "<div>Sign Up</div>" },
    SettingsPage: { template: "<div>Settings</div>" },
    UsersPage: { template: "<div>Users</div>" },
  },
}));

describe("Vue Router", () => {
  let router: any;

  beforeEach(async () => {
    window.scrollTo = vi.fn();

    // Dynamically import the router to apply mocks
    const routerModule = await import("../../src/router/index");
    router = routerModule.default;

    // Reset mocks and localStorage before each test
    vi.clearAllMocks();
    localStorage.clear();

    // Set a starting route
    await router.push(ROUTES.MAIN.PATH);
    await router.isReady();
  });

  it("should create the router instance", () => {
    expect(router).toBeDefined();
  });

  it("should have the correct number of routes configured", () => {
    const expectedRouteCount = 14;
    expect(router.options.routes).toHaveLength(expectedRouteCount);
  });

  it("should allow access to a protected route if user is authenticated", async () => {
    mockGetToken.mockReturnValue("fake-token");
    await router.push(ROUTES.SETTINGS.PATH);
    await router.isReady();
    expect(router.currentRoute.value.path).toBe(ROUTES.SETTINGS.PATH);
  });

  it("should redirect to sign-in page if user is unauthenticated and tries to access a protected route", async () => {
    mockGetToken.mockReturnValue(null);
    await router.push(ROUTES.SETTINGS.PATH);
    await router.isReady();
    expect(router.currentRoute.value.path).toBe(ROUTES.SIGN_IN.PATH);
  });

  it("should redirect an authenticated user to the main page if they try to access a public page", async () => {
    mockGetToken.mockReturnValue("fake-token");
    await router.push(ROUTES.SIGN_UP.PATH);
    await router.isReady();
    expect(router.currentRoute.value.path).toBe(ROUTES.USERS.PATH);
  });

  it("should allow an unauthenticated user to access the sign-in page", async () => {
    mockGetToken.mockReturnValue(null);
    await router.push(ROUTES.SIGN_IN.PATH);
    await router.isReady();
    expect(router.currentRoute.value.path).toBe(ROUTES.SIGN_IN.PATH);
  });
});
