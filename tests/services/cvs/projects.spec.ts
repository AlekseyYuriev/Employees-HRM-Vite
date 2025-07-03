import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCvProjectsById,
  createCvProject,
  deleteCvProject,
} from "../../../src/services/cvs/projects";
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

describe("projects.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCvProjectsById", () => {
    it("should fetch projects by CV id successfully", async () => {
      const mockData = { projects: [{ id: 1, name: "Project A" }] };
      (apolloClient.query as any).mockResolvedValue({ data: { cv: mockData } });

      const result = await getCvProjectsById("123");
      expect(result).toEqual(mockData);
      expect(checkCvId).toHaveBeenCalledWith("123");
      expect(apolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { cvId: 123 },
        })
      );
    });

    it("should throw detailed error on failure", async () => {
      const error = new Error("Query failed");
      (apolloClient.query as any).mockRejectedValue(error);

      await expect(getCvProjectsById("123")).rejects.toThrow(error);
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("createCvProject", () => {
    it("should create a new CV project successfully", async () => {
      const input = { cvId: 123, name: "New Project" };
      const mockData = { id: 1, name: "New Project" };
      (apolloClient.mutate as any).mockResolvedValue({
        data: { addCvProject: mockData },
      });

      const result = await createCvProject(input);
      expect(result).toEqual(mockData);
      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { project: input },
        })
      );
    });

    it("should throw detailed error on failure", async () => {
      const error = new Error("Mutation failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(createCvProject({ cvId: 123, name: "X" })).rejects.toThrow(
        error
      );
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteCvProject", () => {
    it("should delete a CV project successfully", async () => {
      const input = { projectId: 456 };
      const mockData = { success: true };
      (apolloClient.mutate as any).mockResolvedValue({
        data: { removeCvProject: mockData },
      });

      const result = await deleteCvProject(input);
      expect(result).toEqual(mockData);
      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { project: input },
        })
      );
    });

    it("should throw detailed error on failure", async () => {
      const error = new Error("Mutation failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(deleteCvProject({ projectId: 456 })).rejects.toThrow(error);
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });
});
