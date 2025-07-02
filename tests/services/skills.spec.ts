import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllSkills } from "../../src/services/skills";
import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import type { ISkillsData } from "../../src/types/skillsStructures";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("@/graphql/skills/getAllSkills.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllSkillsQuery",
}));

describe("getAllSkills", () => {
  const mockSkills: ISkillsData[] = [
    { id: 1, name: "JavaScript", category: "Programming languages" },
    { id: 2, name: "Vue.js", category: "Programming technologies" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return skills on success", async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { skills: mockSkills },
    });

    const result = await getAllSkills();
    expect(result).toEqual(mockSkills);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: "mockedGetAllSkillsQuery",
    });
  });

  it("should throw detailed error on failure", async () => {
    const mockError = new Error("GraphQL error");
    (apolloClient.query as any).mockRejectedValue(mockError);

    await expect(getAllSkills()).rejects.toThrow("Mocked: GraphQL error");
    expect(getDetailedError).toHaveBeenCalledWith(mockError);
  });
});
