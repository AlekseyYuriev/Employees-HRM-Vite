import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCvPreviewDataById,
  exportPDF,
} from "../../../src/services/cvs/preview";
import apolloClient from "../../../src/plugins/apolloConfig";
import { checkCvId, getDetailedError } from "../../../src/utils/handleErrors";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  checkCvId: vi.fn(),
  getDetailedError: vi.fn((e) => e),
}));

describe("preview.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCvPreviewDataById - success", async () => {
    const mockPreviewData = { id: 1, name: "CV Preview" };
    (apolloClient.query as any).mockResolvedValue({
      data: { cv: mockPreviewData },
    });

    const result = await getCvPreviewDataById("1");
    expect(result).toEqual(mockPreviewData);
    expect(checkCvId).toHaveBeenCalledWith("1");
    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { cvId: 1 },
      })
    );
  });

  it("getCvPreviewDataById - error", async () => {
    const error = new Error("Query failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(getCvPreviewDataById("1")).rejects.toThrow("Query failed");
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });

  it("exportPDF - success", async () => {
    const input = { id: 1, format: "A4" };
    (apolloClient.query as any).mockResolvedValue({
      data: { exportPdf: "url.pdf" },
    });

    const result = await exportPDF(input);
    expect(result).toBe("url.pdf");
    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { pdf: input },
      })
    );
  });

  it("exportPDF - error", async () => {
    const error = new Error("Export failed");
    (apolloClient.query as any).mockRejectedValue(error);

    await expect(exportPDF({ id: 1, format: "A4" })).rejects.toThrow(
      "Export failed"
    );
    expect(getDetailedError).toHaveBeenCalledWith(error);
  });
});
