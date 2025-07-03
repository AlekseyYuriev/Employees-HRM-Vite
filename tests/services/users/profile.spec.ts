import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserProfileById,
  updateUserData,
  updateUserAvatar,
  deleteUserAvatar,
} from "../../../src/services/users/profile";
import apolloClient from "../../../src/plugins/apolloConfig";
import { checkUserId, getDetailedError } from "../../../src/utils/handleErrors";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  checkUserId: vi.fn(),
  getDetailedError: vi.fn((e) => e),
}));

describe("profile.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserProfileById - success", async () => {
    const mockProfile = { id: 1, name: "User" };
    (apolloClient.query as any).mockResolvedValue({
      data: { user: mockProfile },
    });

    const result = await getUserProfileById("1");
    expect(result).toEqual(mockProfile);
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalled();
  });

  it("getUserProfileById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getUserProfileById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("updateUserData - success", async () => {
    const inputUser = { id: 1, email: "test@test.com" };
    const inputProfile = { phone: "123" };
    const mockResponse = { id: 1, email: "test@test.com" };

    (apolloClient.mutate as any)
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ data: { updateUser: mockResponse } });

    const result = await updateUserData(inputUser, inputProfile);
    expect(result).toEqual(mockResponse);
    expect(apolloClient.mutate).toHaveBeenCalledTimes(2);
  });

  it("updateUserData - error", async () => {
    const inputUser = { id: 1, email: "test@test.com" };
    const inputProfile = { phone: "123" };
    const error = new Error("Mutation failed");

    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(updateUserData(inputUser, inputProfile)).rejects.toThrow(
      "Mutation failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("updateUserAvatar - success", async () => {
    const inputAvatar = { file: "image.png" };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { uploadAvatar: "avatar_url" },
    });

    const result = await updateUserAvatar(inputAvatar);
    expect(result).toBe("avatar_url");
    expect(apolloClient.mutate).toHaveBeenCalled();
  });

  it("updateUserAvatar - error", async () => {
    const error = new Error("Upload failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(updateUserAvatar({ file: "x" })).rejects.toThrow(
      "Upload failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("deleteUserAvatar - success", async () => {
    (apolloClient.mutate as any).mockResolvedValue({});

    await deleteUserAvatar("1");
    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { avatar: { userId: 1 } },
      })
    );
  });

  it("deleteUserAvatar - error", async () => {
    const error = new Error("Delete failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(deleteUserAvatar("1")).rejects.toThrow("Delete failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
