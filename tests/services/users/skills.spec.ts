// tests/services/skills.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import apolloClient from "../../../src/plugins/apolloConfig";
import {
  getUserSkillsById,
  createUserSkill,
  updateUserSkill,
  deleteUserSkills,
} from "../../../src/services/users/skills";
import {
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
} from "../../../src/types/pages/users/skills";
import { ISkill } from "../../../src/types/skillsStructures";
import { getDetailedError, checkUserId } from "../../../src/utils/handleErrors";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((e) => e),
  checkUserId: vi.fn(),
}));

describe("skills service", () => {
  const mockSkills: ISkill[] = [
    {
      name: "JavaScript",
      mastery: "Advanced",
      category: "Programming Languages",
    },
    {
      name: "TypeScript",
      mastery: "Intermediate",
      category: "Programming Languages",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserSkillsById returns skills for valid user id", async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { user: { profile: { skills: mockSkills } } },
    });

    const result = await getUserSkillsById("1");
    expect(checkUserId).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockSkills);
  });

  it("getUserSkillsById throws on error", async () => {
    (apolloClient.query as any).mockRejectedValue("error");

    await expect(getUserSkillsById("1")).rejects.toEqual("error");
    expect(getDetailedError).toHaveBeenCalledWith("error");
  });

  it("createUserSkill sends correct mutation and returns skills", async () => {
    const input: IAddOrUpdateProfileSkillInput = {
      userId: 1,
      name: "React",
      mastery: "Advanced",
      category: "Programming technologies",
    };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { addProfileSkill: { skills: mockSkills } },
    });

    const result = await createUserSkill(input);
    expect(result).toEqual(mockSkills);
  });

  it("updateUserSkill sends correct mutation and returns skills", async () => {
    const input: IAddOrUpdateProfileSkillInput = {
      userId: 1,
      name: "Vue",
      mastery: "Advanced",
      category: "Programming technologies",
    };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { updateProfileSkill: { skills: mockSkills } },
    });

    const result = await updateUserSkill(input);
    expect(result).toEqual(mockSkills);
  });

  it("deleteUserSkills sends correct mutation and returns skills", async () => {
    const input: IDeleteProfileSkillInput = {
      userId: 1,
      name: ["JavaScript", "TypeScript"],
    };
    (apolloClient.mutate as any).mockResolvedValue({
      data: { deleteProfileSkill: { skills: mockSkills } },
    });

    const result = await deleteUserSkills(input);
    expect(result).toEqual(mockSkills);
  });

  it("createUserSkill throws on error", async () => {
    (apolloClient.mutate as any).mockRejectedValue("mutation error");
    const input: IAddOrUpdateProfileSkillInput = {
      userId: 1,
      name: "React",
      mastery: "Intermediate",
      category: "Programming technologies",
    };

    await expect(createUserSkill(input)).rejects.toEqual("mutation error");
    expect(getDetailedError).toHaveBeenCalledWith("mutation error");
  });
});
