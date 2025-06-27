import { beforeEach, describe, expect, it, vi } from "vitest";
import VueCookies from "vue-cookies";

import useCookies from "../../src/composables/useCookies";

vi.mock("vue-cookies", () => ({
  default: Object.assign(
    vi.fn(() => VueCookies),
    { get: vi.fn(), set: vi.fn(), remove: vi.fn() }
  ),
}));

const $cookies = VueCookies;

const mockTokenExpDate = {
  exp: Math.floor(Date.now() / 1000) + 600, // Expires in 10 minutes
};

const mockToken = `header.${btoa(JSON.stringify(mockTokenExpDate))}.signature`;

let cookies: ReturnType<typeof useCookies>;

describe("useCookies composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookies = useCookies();
  });

  it("should set the token with the correct expiration", () => {
    const expectedExpirationDate = new Date(mockTokenExpDate.exp * 1000 - 5000); // Expires 5 seconds earlier than mockToken
    cookies.setToken("accessToken", mockToken);
    expect($cookies.set).toHaveBeenCalledWith(
      "accessToken",
      `Bearer ${mockToken}`,
      expectedExpirationDate
    );
  });

  it("should return the token if it is valid", () => {
    vi.mocked($cookies.get).mockReturnValueOnce(mockToken);
    const accessToken = cookies.getToken("accessToken");
    expect(accessToken).toBe(mockToken);
    expect($cookies.get).toHaveBeenCalledWith("accessToken");

    vi.mocked($cookies.get).mockReturnValueOnce(mockToken);
    const refreshToken = cookies.getToken("refreshToken");
    expect(refreshToken).toBe(mockToken);
    expect($cookies.get).toHaveBeenCalledWith("refreshToken");

    expect($cookies.get).toBeCalledTimes(2);
  });

  it("should return null if no token exists", () => {
    const token = cookies.getToken("accessToken");
    expect(token).toBe(null);
    expect($cookies.get).toHaveBeenCalledWith("accessToken");
  });

  it("should return null if token is invalid", () => {
    const expiredTokenData = {
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    };
    const expiredToken = `header.${btoa(
      JSON.stringify(expiredTokenData)
    )}.signature`;
    vi.mocked($cookies.get).mockReturnValue(expiredToken);
    const token = cookies.getToken("accessToken");
    expect(token).toBeNull();
  });

  it("should remove token", () => {
    cookies.removeToken("accessToken");
    expect($cookies.remove).toHaveBeenCalledWith("accessToken");
    expect($cookies.remove).toHaveBeenCalledOnce();
  });
});
