import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCvDetailsDataById,
  updateCv,
} from "../../../src/services/cvs/details";
import apolloClient from "../../../src/plugins/apolloConfig";
import { checkCvId, getDetailedError } from "../../../src/utils/handleErrors";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  checkCvId: vi.fn(),
  getDetailedError: vi.fn((e) => e),
}));

describe("details.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCvDetailsDataById - success", async () => {
    const mockDetails = { id: 1, name: "CV Details" };
    (apolloClient.query as any).mockResolvedValue({
      data: { cv: mockDetails },
    });

    const result = await getCvDetailsDataById("1");
    expect(result).toEqual(mockDetails);
    expect(checkCvId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { cvId: 1 },
      })
    );
  });

  it("getCvDetailsDataById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getCvDetailsDataById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("updateCv - success", async () => {
    const inputCv = { id: 1, name: "Updated CV" };
    const mockResponse = { id: 1, name: "Updated CV" };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { updateCv: mockResponse },
    });

    const result = await updateCv(inputCv);
    expect(result).toEqual(mockResponse);
    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { cv: inputCv },
      })
    );
  });

  it("updateCv - error", async () => {
    const inputCv = { id: 1, name: "Updated CV" };
    const error = new Error("Mutation failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(updateCv(inputCv)).rejects.toThrow("Mutation failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
