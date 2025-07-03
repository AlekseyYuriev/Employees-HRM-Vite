import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllCvs,
  getCvNameDataById,
  createCv,
  deleteCv,
} from "../../../src/services/cvs/cvs";
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

describe("cvs/cvs.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllCvs - success", async () => {
    const mockCvs = [{ id: 1, name: "CV1" }];
    (apolloClient.query as any).mockResolvedValue({ data: { cvs: mockCvs } });

    const result = await getAllCvs();
    expect(result).toEqual(mockCvs);
    expect(apolloClient.query).toHaveBeenCalled();
  });

  it("getAllCvs - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getAllCvs()).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("getCvNameDataById - success", async () => {
    const mockCv = { id: 1, name: "CV1" };
    (apolloClient.query as any).mockResolvedValue({ data: { cv: mockCv } });

    const result = await getCvNameDataById("1");
    expect(result).toEqual(mockCv);
    expect(checkCvId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalled();
  });

  it("getCvNameDataById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getCvNameDataById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("createCv - success", async () => {
    const input = { name: "CV1" };
    const mockResponse = { id: 1, name: "CV1" };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { createCv: mockResponse },
    });

    const result = await createCv(input);
    expect(result).toEqual(mockResponse);
    expect(apolloClient.mutate).toHaveBeenCalled();
  });

  it("createCv - error", async () => {
    const error = new Error("Create failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(createCv({ name: "Test" })).rejects.toThrow("Create failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("deleteCv - success", async () => {
    (apolloClient.mutate as any).mockResolvedValue({});
    await deleteCv({ id: 1 });
    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { cv: { id: 1 } },
      })
    );
  });

  it("deleteCv - error", async () => {
    const error = new Error("Delete failed");
    (apolloClient.mutate as any).mockRejectedValue(error);

    await expect(deleteCv({ id: 1 })).rejects.toThrow("Delete failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
