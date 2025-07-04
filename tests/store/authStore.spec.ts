import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../../src/store/authStore";
import { setActivePinia, createPinia } from "pinia";
import * as useCookiesComposable from "../../src/composables/useCookies";
import * as useToastComposable from "../../src/composables/useToast";
import * as usersService from "../../src/services/users/users";

vi.mock("vue-i18n", () => ({ useI18n: () => ({ t: (x: string) => x }) }));
vi.mock("vue-router", () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock("@/composables/useCookies", () => ({
  default: () => ({
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    removeToken: vi.fn(),
  }),
}));

vi.mock("@/composables/useToast", () => ({
  default: () => ({ setErrorToast: vi.fn() }),
}));

vi.mock("@/services/auth", () => ({
  login: vi.fn(async () => ({
    user: {
      id: "1",
      email: "a@b.c",
      profile: {
        first_name: "A",
        last_name: "B",
        full_name: "A B",
        avatar: null,
      },
    },
    access_token: "token",
    refresh_token: "rtoken",
  })),
  register: vi.fn(async () => ({
    user: {
      id: "2",
      email: "c@d.e",
      profile: {
        first_name: "C",
        last_name: "D",
        full_name: "C D",
        avatar: null,
      },
    },
    access_token: "token2",
    refresh_token: "rtoken2",
  })),
  handleLogout: vi.fn(),
}));

vi.mock("@/services/users/users", () => ({ getUserAuthDataById: vi.fn() }));

Object.defineProperty(window, "localStorage", {
  value: {
    removeItem: vi.fn(),
    setItem: vi.fn(),
    getItem: vi.fn(),
  },
  writable: true,
});

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initial state is correct", () => {
    const store = useAuthStore();
    expect(store.user).toBe(null);
    expect(store.wasAuthErrorToastShown).toBe(false);
  });

  it("loginUser calls login and sets user", async () => {
    const store = useAuthStore();
    await store.loginUser("a@b.c", "pw");
    expect(store.user?.id).toBe("1");
    expect(store.user?.email).toBe("a@b.c");
  });

  it("registerUser calls register and sets user", async () => {
    const store = useAuthStore();
    await store.registerUser("c@d.e", "pw");
    expect(store.user?.id).toBe("2");
    expect(store.user?.email).toBe("c@d.e");
  });

  it("logout clears user and calls removeToken", () => {
    const store = useAuthStore();
    store.user = {
      id: "1",
      email: "a@b.c",
      firstName: "A",
      lastName: "B",
      fullName: "A B",
      avatar: null,
    };
    store.logout();
    expect(store.user).toBe(null);
  });

  it("fetchUserAuthData sets user from token", async () => {
    // Create a valid JWT with base64-encoded payload
    const payload = { sub: "123", exp: Math.floor(Date.now() / 1000) + 3600 };
    const base64Payload = btoa(JSON.stringify(payload));
    const mockToken = `header.${base64Payload}.signature`;

    // MOCK useCookies to return the mock token
    vi.spyOn(useCookiesComposable, "default").mockReturnValue({
      getToken: () => mockToken,
      setToken: vi.fn(),
      removeToken: vi.fn(),
    });

    // MOCK getUserAuthDataById to return mock user data
    const mockUser = {
      id: "123",
      email: "user@test.com",
      profile: {
        first_name: "Test",
        last_name: "User",
        full_name: "Test User",
        avatar: "avatar.png",
      },
    };
    vi.spyOn(usersService, "getUserAuthDataById").mockResolvedValue(mockUser);

    // Mock toast composable with all required methods
    vi.spyOn(useToastComposable, "default").mockReturnValue({
      setErrorToast: vi.fn(),
      removeCurrToast: vi.fn(),
    });

    const store = useAuthStore();
    await store.fetchUserAuthData();

    // Assert
    expect(store.user).toEqual({
      id: "123",
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      fullName: "Test User",
      avatar: "avatar.png",
    });
  });

  it("fetchUserAuthData returns early if token is missing", async () => {
    // Override the previous mock to return `null` again
    vi.spyOn(useCookiesComposable, "default").mockReturnValue({
      getToken: () => null,
      setToken: vi.fn(),
      removeToken: vi.fn(),
    });

    const store = useAuthStore();
    await store.fetchUserAuthData();
    expect(store.user).toBe(null); // nothing should change
  });
});
