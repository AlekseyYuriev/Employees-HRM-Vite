import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllDepartmentNames } from "../../src/services/departments";
import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import type { IDepartmentNamesData } from "../../src/types/pages/users/profile";

// Mock Apollo Client and dependencies
vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("@/graphql/departments/getAllDepartmentNames.query.gql", () => ({
  __esModule: true,
  default: "mockedQuery",
}));

describe("getAllDepartmentNames", () => {
  const mockDepartments: IDepartmentNamesData[] = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "Marketing" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return department names on success", async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { departments: mockDepartments },
    });

    const result = await getAllDepartmentNames();
    expect(result).toEqual(mockDepartments);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: "mockedQuery",
    });
  });

  it("should throw detailed error on failure", async () => {
    const mockError = new Error("Network error");
    (apolloClient.query as any).mockRejectedValue(mockError);

    await expect(getAllDepartmentNames()).rejects.toThrow(
      "Mocked: Network error"
    );
    expect(getDetailedError).toHaveBeenCalledWith(mockError);
  });
});
