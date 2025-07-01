import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../../src/store/authStore";
import { setActivePinia, createPinia } from "pinia";

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
});
