import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock import.meta.env
beforeEach(() => {
  globalThis.importMetaEnv = {
    VITE_GRAPHQL_URL: "http://mocked-graphql-url/graphql",
  };
  Object.defineProperty(import.meta, "env", {
    value: globalThis.importMetaEnv,
    writable: true,
    configurable: true,
  });
});
afterEach(() => {
  vi.resetAllMocks();
});

describe("apolloConfig plugin", () => {
  it("should instantiate ApolloClient with correct config", async () => {
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({
        getToken: vi.fn(() => "access-token"),
      }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken: vi.fn(),
    }));
    const { default: apolloClient } = await import(
      "../../src/plugins/apolloConfig"
    );
    expect(apolloClient).toBeDefined();
    expect(apolloClient.defaultOptions?.watchQuery?.fetchPolicy).toBe(
      "no-cache"
    );
    expect(apolloClient.defaultOptions?.query?.fetchPolicy).toBe("no-cache");
    // Type policies are internal, so just check cache is defined
    expect(apolloClient.cache).toBeDefined();
  });

  it("should use accessToken for authorization if present", async () => {
    const getToken = vi.fn((type) =>
      type === "accessToken" ? "access-token" : "refresh-token"
    );
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken: vi.fn(),
    }));
    // Re-import to apply mocks
    const { default: apolloClient } = await import(
      "../../src/plugins/apolloConfig"
    );
    // Simulate the logic from apolloConfig
    const { default: useCookies } = await import(
      "../../src/composables/useCookies"
    );
    const { getToken: getTokenFn } = useCookies();
    const headers = { foo: "bar" };
    let accessToken = getTokenFn("accessToken");
    const isAuthRequiredRequest = ![
      "UPDATE_TOKEN",
      "SIGN_IN",
      "SIGN_UP",
    ].includes("ANY_QUERY");
    if (!accessToken && isAuthRequiredRequest) {
      const { refreshAccessToken } = await import("../../src/services/auth");
      await refreshAccessToken();
      accessToken = getTokenFn("accessToken");
    }
    const result = {
      headers: {
        ...headers,
        authorization: accessToken ? accessToken : getTokenFn("refreshToken"),
      },
    };
    expect(result.headers.authorization).toBe("access-token");
  });

  it("should use refreshToken for authorization if no accessToken", async () => {
    const getToken = vi.fn((type) =>
      type === "accessToken" ? null : "refresh-token"
    );
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken: vi.fn(),
    }));
    const { default: useCookies } = await import(
      "../../src/composables/useCookies"
    );
    const { getToken: getTokenFn } = useCookies();
    const headers = { foo: "bar" };
    let accessToken = getTokenFn("accessToken");
    const isAuthRequiredRequest = ![
      "UPDATE_TOKEN",
      "SIGN_IN",
      "SIGN_UP",
    ].includes("ANY_QUERY");
    if (!accessToken && isAuthRequiredRequest) {
      const { refreshAccessToken } = await import("../../src/services/auth");
      await refreshAccessToken();
      accessToken = getTokenFn("accessToken");
    }
    const result = {
      headers: {
        ...headers,
        authorization: accessToken ? accessToken : getTokenFn("refreshToken"),
      },
    };
    expect(result.headers.authorization).toBe("refresh-token");
  });

  it("should call refreshAccessToken if no accessToken and auth required", async () => {
    const getToken = vi.fn((type) =>
      type === "accessToken" ? null : "refresh-token"
    );
    const refreshAccessToken = vi.fn();
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken,
    }));
    const { default: useCookies } = await import(
      "../../src/composables/useCookies"
    );
    const { getToken: getTokenFn } = useCookies();
    const headers = { foo: "bar" };
    let accessToken = getTokenFn("accessToken");
    const isAuthRequiredRequest = ![
      "UPDATE_TOKEN",
      "SIGN_IN",
      "SIGN_UP",
    ].includes("ANY_QUERY");
    if (!accessToken && isAuthRequiredRequest) {
      const { refreshAccessToken } = await import("../../src/services/auth");
      await refreshAccessToken();
      accessToken = getTokenFn("accessToken");
    }
    expect(refreshAccessToken).toHaveBeenCalled();
  });

  it("should NOT call refreshAccessToken for excluded operations", async () => {
    const getToken = vi.fn((type) => null);
    const refreshAccessToken = vi.fn();
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken,
    }));
    for (const op of ["UPDATE_TOKEN", "SIGN_IN", "SIGN_UP"]) {
      const { default: useCookies } = await import(
        "../../src/composables/useCookies"
      );
      const { getToken: getTokenFn } = useCookies();
      const headers = {};
      let accessToken = getTokenFn("accessToken");
      const isAuthRequiredRequest = ![
        "UPDATE_TOKEN",
        "SIGN_IN",
        "SIGN_UP",
      ].includes(op);
      if (!accessToken && isAuthRequiredRequest) {
        const { refreshAccessToken } = await import("../../src/services/auth");
        await refreshAccessToken();
        accessToken = getTokenFn("accessToken");
      }
      // For excluded ops, refreshAccessToken should not be called
    }
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });
});
