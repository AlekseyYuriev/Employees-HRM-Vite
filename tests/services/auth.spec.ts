import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  login,
  register,
  updateAccessToken,
  refreshAccessToken,
} from "../../src/services/auth";

import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import useCookies from "../../src/composables/useCookies";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
    mutate: vi.fn(),
    resetStore: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("pinia");
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/composables/useCookies", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/composables/useToast", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/utils/handleNoLangMessage", () => ({
  handleUnauthorizedMessage: vi.fn(() => "Unauthorized toast message"),
}));

vi.mock("@/graphql/auth/login.query.gql", () => ({
  __esModule: true,
  default: "mockedLoginQuery",
}));

vi.mock("@/graphql/auth/signUp.mutation.gql", () => ({
  __esModule: true,
  default: "mockedSignupMutation",
}));

vi.mock("@/graphql/auth/updateAccessToken.mutation.gql", () => ({
  __esModule: true,
  default: "mockedUpdateAccessTokenMutation",
}));

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    const mockLoginData = {
      id: "1",
      email: "test@example.com",
      access_token: "access",
      refresh_token: "refresh",
    };

    it("should login successfully", async () => {
      (apolloClient.query as any).mockResolvedValue({
        data: { login: mockLoginData },
      });

      const result = await login("test@example.com", "1234");
      expect(result).toEqual(mockLoginData);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: "mockedLoginQuery",
        variables: { auth: { email: "test@example.com", password: "1234" } },
      });
      expect(apolloClient.resetStore).toHaveBeenCalled();
    });

    it("should throw detailed error on login failure", async () => {
      const error = new Error("Login failed");
      (apolloClient.query as any).mockRejectedValue(error);

      await expect(login("fail@example.com", "wrong")).rejects.toThrow(
        "Mocked: Login failed"
      );
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("register", () => {
    const mockRegisterData = {
      id: "2",
      email: "new@example.com",
      access_token: "access2",
      refresh_token: "refresh2",
    };

    it("should register successfully", async () => {
      (apolloClient.mutate as any).mockResolvedValue({
        data: { login: mockRegisterData },
      });

      const result = await register("new@example.com", "password");
      expect(result).toEqual(mockRegisterData);
      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: "mockedSignupMutation",
        variables: { auth: { email: "new@example.com", password: "password" } },
      });
      expect(apolloClient.resetStore).toHaveBeenCalled();
    });

    it("should throw detailed error on register failure", async () => {
      const error = new Error("Signup failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(register("new@example.com", "fail")).rejects.toThrow(
        "Mocked: Signup failed"
      );
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("updateAccessToken", () => {
    it("should return new access token", async () => {
      (apolloClient.mutate as any).mockResolvedValue({
        data: { updateToken: { access_token: "new-token" } },
      });

      const token = await updateAccessToken();
      expect(token).toBe("new-token");
      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: "mockedUpdateAccessTokenMutation",
      });
    });

    it("should throw error on updateAccessToken failure", async () => {
      const error = new Error("Token refresh failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(updateAccessToken()).rejects.toThrow(
        "Mocked: Token refresh failed"
      );
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("refreshAccessToken", () => {
    it("should throw if no refreshToken exists", async () => {
      (useCookies as any).mockReturnValue({
        getToken: () => undefined,
        setToken: vi.fn(),
      });

      await expect(refreshAccessToken()).rejects.toThrow("Unauthorized");
    });
  });
});
