import { describe, it, vi, expect, beforeEach } from "vitest";
import * as users from "../../../src/services/users/users";
import apolloClient from "../../../src/plugins/apolloConfig";
import { checkUserId, getDetailedError } from "../../../src/utils/handleErrors";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  checkUserId: vi.fn(),
  getDetailedError: vi.fn((e) => e),
}));

describe("users API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllUsers returns users list", async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { users: [{ id: 1, name: "User One" }] },
    });

    const result = await users.getAllUsers();
    expect(result).toEqual([{ id: 1, name: "User One" }]);
  });

  it("getUserAuthDataById calls checkUserId and returns user auth data", async () => {
    (checkUserId as any).mockImplementation(() => {});
    (apolloClient.query as any).mockResolvedValue({
      data: { user: { id: 1, email: "test@example.com" } },
    });

    const result = await users.getUserAuthDataById("1");
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(result).toEqual({ id: 1, email: "test@example.com" });
  });

  it("getUserNameDataById calls checkUserId and returns user name data", async () => {
    (checkUserId as any).mockImplementation(() => {});
    (apolloClient.query as any).mockResolvedValue({
      data: { user: { id: 1, fullname: "User One" } },
    });

    const result = await users.getUserNameDataById("1");
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(result).toEqual({ id: 1, fullname: "User One" });
  });
});
