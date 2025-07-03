import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserCvsNamesById } from "../../../src/services/users/cvs";
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

describe("cvs.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserCvsNamesById - success", async () => {
    const mockCvs = [
      { id: 1, name: "CV 1" },
      { id: 2, name: "CV 2" },
    ];
    (apolloClient.query as any).mockResolvedValue({
      data: { user: { cvs: mockCvs } },
    });

    const result = await getUserCvsNamesById("1");
    expect(result).toEqual(mockCvs);
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { userId: 1 },
      })
    );
  });

  it("getUserCvsNamesById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getUserCvsNamesById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
