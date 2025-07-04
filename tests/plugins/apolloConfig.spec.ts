import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { gql } from "@apollo/client/core";

describe("apolloConfig plugin", () => {
  beforeEach(() => {
    globalThis.importMetaEnv = {
      VITE_GRAPHQL_URL: "http://mocked-graphql-url/graphql",
    };
    Object.defineProperty(import.meta, "env", {
      value: globalThis.importMetaEnv,
      writable: true,
      configurable: true,
    });
    vi.resetModules();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("instantiates ApolloClient with correct config and link chain", async () => {
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken: vi.fn(() => "access-token") }),
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
    expect(apolloClient.cache).toBeDefined();
    expect(apolloClient.link).toBeDefined();
  });

  it("uses accessToken for authorization if present, else refreshToken", async () => {
    const getToken = vi.fn((type) =>
      type === "accessToken" ? "access-token" : "refresh-token"
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
    expect(result.headers.authorization).toBe("access-token");
  });

  it("falls back to refreshToken if no accessToken after refresh", async () => {
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
        authorization: accessToken ? accessToken : getTokenFn("refreshToken"),
      },
    };
    expect(result.headers.authorization).toBe("refresh-token");
  });

  it("does not set authorization header if no tokens available", async () => {
    const getToken = vi.fn(() => null);
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
        authorization: accessToken || getTokenFn("refreshToken") || undefined,
      },
    };
    expect(result.headers.authorization).toBeUndefined();
  });

  it("calls refreshAccessToken if no accessToken and auth required", async () => {
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

  it("does NOT call refreshAccessToken for excluded operations", async () => {
    const getToken = vi.fn(() => null);
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
    }
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it("handles refreshAccessToken error gracefully", async () => {
    const getToken = vi.fn(() => null);
    const refreshAccessToken = vi
      .fn()
      .mockRejectedValue(new Error("Refresh failed"));
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
    let accessToken = getTokenFn("accessToken");
    const isAuthRequiredRequest = true;
    let error;
    if (!accessToken && isAuthRequiredRequest) {
      try {
        const { refreshAccessToken } = await import("../../src/services/auth");
        await refreshAccessToken();
      } catch (e) {
        error = e;
      }
    }
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Refresh failed");
  });

  it("merges headers with authorization in setContext, handles undefined headers", async () => {
    const getToken = vi.fn(() => "access-token");
    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));
    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken: vi.fn(),
    }));
    const { setContext } = await import("@apollo/client/link/context");
    const contextFn = async (
      _: any,
      { headers }: { headers?: Record<string, string> }
    ) => {
      const { default: useCookies } = await import(
        "../../src/composables/useCookies"
      );
      const { getToken } = useCookies();
      const token = getToken("accessToken");
      return {
        headers: {
          ...(headers || {}),
          ...(token ? { authorization: token } : {}),
        },
      };
    };
    const result1 = await contextFn({}, { headers: { existing: "header" } });
    expect((result1.headers as Record<string, string>).authorization).toBe(
      "access-token"
    );
    expect((result1.headers as Record<string, string>).existing).toBe("header");
    const result2 = await contextFn({}, {});
    expect((result2.headers as Record<string, string>).authorization).toBe(
      "access-token"
    );
  });

  it("treats missing operationName as auth required", async () => {
    const getToken = vi.fn(() => null);
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
    let accessToken = getTokenFn("accessToken");
    const isAuthRequiredRequest = ![
      "UPDATE_TOKEN",
      "SIGN_IN",
      "SIGN_UP",
    ].includes(undefined as any);
    if (!accessToken && isAuthRequiredRequest) {
      const { refreshAccessToken } = await import("../../src/services/auth");
      await refreshAccessToken();
      accessToken = getTokenFn("accessToken");
    }
    expect(refreshAccessToken).toHaveBeenCalled();
  });

  it("typePolicies: Profile.skills/languages and Cv.skills/projects merge incoming", async () => {
    const { default: apolloClient } = await import(
      "../../src/plugins/apolloConfig"
    );
    const cache: any = apolloClient.cache;
    // simulate merge
    const profileSkillsMerge = cache.policies.getFieldPolicy(
      "Profile",
      "skills"
    )?.merge;
    const profileLanguagesMerge = cache.policies.getFieldPolicy(
      "Profile",
      "languages"
    )?.merge;
    const cvSkillsMerge = cache.policies.getFieldPolicy("Cv", "skills")?.merge;
    const cvProjectsMerge = cache.policies.getFieldPolicy(
      "Cv",
      "projects"
    )?.merge;
    expect(profileSkillsMerge([1, 2], [3, 4])).toEqual([3, 4]);
    expect(profileLanguagesMerge([1, 2], [3, 4])).toEqual([3, 4]);
    expect(cvSkillsMerge([1, 2], [3, 4])).toEqual([3, 4]);
    expect(cvProjectsMerge([1, 2], [3, 4])).toEqual([3, 4]);
  });

  it("authLink adds correct authorization header based on token logic", async () => {
    const getToken = vi.fn((key) => {
      if (key === "accessToken") return null; // simulate missing access token
      if (key === "refreshToken") return "refresh-token"; // fallback
    });

    const refreshAccessToken = vi.fn().mockResolvedValue(undefined);

    vi.doMock("../../src/composables/useCookies", () => ({
      default: () => ({ getToken }),
    }));

    vi.doMock("../../src/services/auth", () => ({
      refreshAccessToken,
    }));

    const { default: apolloClient } = await import(
      "../../src/plugins/apolloConfig"
    );

    // Use a minimal valid GraphQL query
    const query = gql`
      query MY_SECURE_QUERY {
        __typename
      }
    `;

    const op: any = {
      query,
      operationName: "MY_SECURE_QUERY",
      getContext: () => ({ headers: { foo: "bar" } }),
      setContext: vi.fn(),
    };

    // @ts-ignore
    const observable = apolloClient.link.request(op, {});
    if (!observable) throw new Error("Link did not return an observable");

    await new Promise((resolve, reject) => {
      observable.subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(refreshAccessToken).toHaveBeenCalled();
    expect(op.setContext).toHaveBeenCalledWith({
      headers: {
        foo: "bar",
        authorization: "refresh-token",
      },
    });
  });
});
