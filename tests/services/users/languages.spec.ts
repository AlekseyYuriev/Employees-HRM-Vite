import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserLanguagesById,
  createUserLanguage,
  updateUserLanguage,
  deleteUserLanguages,
} from "../../../src/services/users/languages";
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

describe("languages.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserLanguagesById - success", async () => {
    const mockLanguages = [{ id: 1, name: "English" }];
    (apolloClient.query as any).mockResolvedValue({
      data: { user: { profile: { languages: mockLanguages } } },
    });

    const result = await getUserLanguagesById("1");
    expect(result).toEqual(mockLanguages);
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalled();
  });

  it("getUserLanguagesById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getUserLanguagesById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("createUserLanguage - success", async () => {
    const input = { name: "Spanish", level: "Fluent" };
    const mockLanguages = [{ id: 2, name: "Spanish" }];
    (apolloClient.mutate as any).mockResolvedValue({
      data: { addProfileLanguage: { languages: mockLanguages } },
    });

    const result = await createUserLanguage(input);
    expect(result).toEqual(mockLanguages);
    expect(apolloClient.mutate).toHaveBeenCalled();
  });

  it("createUserLanguage - error", async () => {
    const error = new Error("Create failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(createUserLanguage({ name: "x", level: "x" })).rejects.toThrow(
      "Create failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("updateUserLanguage - success", async () => {
    const input = { name: "German", level: "Basic" };
    const mockLanguages = [{ id: 3, name: "German" }];
    (apolloClient.mutate as any).mockResolvedValue({
      data: { updateProfileLanguage: { languages: mockLanguages } },
    });

    const result = await updateUserLanguage(input);
    expect(result).toEqual(mockLanguages);
    expect(apolloClient.mutate).toHaveBeenCalled();
  });

  it("updateUserLanguage - error", async () => {
    const error = new Error("Update failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(updateUserLanguage({ name: "x", level: "x" })).rejects.toThrow(
      "Update failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("deleteUserLanguages - success", async () => {
    const input = { ids: [1, 2] };
    const mockLanguages = [];
    (apolloClient.mutate as any).mockResolvedValue({
      data: { deleteProfileLanguage: { languages: mockLanguages } },
    });

    const result = await deleteUserLanguages(input);
    expect(result).toEqual(mockLanguages);
    expect(apolloClient.mutate).toHaveBeenCalled();
  });

  it("deleteUserLanguages - error", async () => {
    const error = new Error("Delete failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(deleteUserLanguages({ ids: [1] })).rejects.toThrow(
      "Delete failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
