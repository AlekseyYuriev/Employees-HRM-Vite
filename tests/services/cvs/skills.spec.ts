import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCvSkillsById,
  createCvSkill,
  updateCvSkill,
  deleteCvSkills,
} from "../../../src/services/cvs/skills";
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

describe("skills.ts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCvSkillsById", () => {
    it("fetches CV skills successfully", async () => {
      const mockData = { skills: [{ id: 1, name: "JavaScript" }] };
      (apolloClient.query as any).mockResolvedValue({ data: { cv: mockData } });

      const result = await getCvSkillsById("42");

      expect(result).toEqual(mockData);
      expect(checkCvId).toHaveBeenCalledWith("42");
      expect(apolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { cvId: 42 },
        })
      );
    });

    it("throws detailed error on failure", async () => {
      const error = new Error("Query failed");
      (apolloClient.query as any).mockRejectedValue(error);

      await expect(getCvSkillsById("42")).rejects.toThrow(error);
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("createCvSkill", () => {
    it("creates a CV skill successfully", async () => {
      const input = { cvId: 42, name: "Vue.js" };
      const mockData = { id: 1, name: "Vue.js" };
      (apolloClient.mutate as any).mockResolvedValue({
        data: { addCvSkill: mockData },
      });

      const result = await createCvSkill(input);

      expect(result).toEqual(mockData);
      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skill: input },
        })
      );
    });

    it("throws detailed error on failure", async () => {
      const error = new Error("Mutation failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(createCvSkill({ cvId: 42, name: "X" })).rejects.toThrow(
        error
      );
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("updateCvSkill", () => {
    it("updates a CV skill successfully", async () => {
      const input = { id: 1, name: "React" };
      const mockData = { id: 1, name: "React" };
      (apolloClient.mutate as any).mockResolvedValue({
        data: { updateCvSkill: mockData },
      });

      const result = await updateCvSkill(input);

      expect(result).toEqual(mockData);
      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skill: input },
        })
      );
    });

    it("throws detailed error on failure", async () => {
      const error = new Error("Mutation failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(updateCvSkill({ id: 1, name: "X" })).rejects.toThrow(error);
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteCvSkills", () => {
    it("deletes CV skills successfully", async () => {
      const input = { skillIds: [1, 2, 3] };
      const mockData = { success: true };
      (apolloClient.mutate as any).mockResolvedValue({
        data: { deleteCvSkill: mockData },
      });

      const result = await deleteCvSkills(input);

      expect(result).toEqual(mockData);
      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skills: input },
        })
      );
    });

    it("throws detailed error on failure", async () => {
      const error = new Error("Mutation failed");
      (apolloClient.mutate as any).mockRejectedValue(error);

      await expect(deleteCvSkills({ skillIds: [1] })).rejects.toThrow(error);
      expect(getDetailedError).toHaveBeenCalledWith(error);
    });
  });
});
