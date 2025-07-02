import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllProjects,
  getAllProjectsData,
} from "../../src/services/projects";
import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import type { IProjectsTableServerData } from "../../src/types/pages/projectsTable";
import type { IProjectsServerData } from "../../src/types/pages/cvs/projects";

// Mocks
vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("@/graphql/projects/getAllProjects.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllProjectsQuery",
}));

vi.mock("@/graphql/projects/getAllProjectsCvData.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllProjectsCvDataQuery",
}));

describe("projects service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllProjects", () => {
    const mockProjects: IProjectsTableServerData[] = [
      {
        id: 1,
        name: "CRM System",
        internal_name: "Project",
        domain: "https://crm.com",
        start_date: "2021-01-01",
        end_date: "2021-01-01",
        team_size: 1,
        description: "Internal CRM tool",
      },
      {
        id: 2,
        name: "E-commerce Platform",
        internal_name: "Project",
        domain: "https://ecommerce.com",
        start_date: "2021-01-01",
        end_date: "2021-01-01",
        team_size: 1,
        description: "Online store",
      },
    ];

    it("should return all projects on success", async () => {
      (apolloClient.query as any).mockResolvedValue({
        data: { projects: mockProjects },
      });

      const result = await getAllProjects();
      expect(result).toEqual(mockProjects);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: "mockedGetAllProjectsQuery",
      });
    });

    it("should throw detailed error on failure", async () => {
      const mockError = new Error("Server error");
      (apolloClient.query as any).mockRejectedValue(mockError);

      await expect(getAllProjects()).rejects.toThrow("Mocked: Server error");
      expect(getDetailedError).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getAllProjectsData", () => {
    const mockProjectsData: IProjectsServerData[] = [
      {
        id: "1",
        name: "CRM System",
        start_date: "2021-01-01",
        end_date: "2021-01-01",
      },
      {
        id: "2",
        name: "E-commerce Platform",
        start_date: "2021-01-01",
        end_date: "2021-01-01",
      },
    ];

    it("should return all project CV data on success", async () => {
      (apolloClient.query as any).mockResolvedValue({
        data: { projects: mockProjectsData },
      });

      const result = await getAllProjectsData();
      expect(result).toEqual(mockProjectsData);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: "mockedGetAllProjectsCvDataQuery",
      });
    });

    it("should throw detailed error on failure", async () => {
      const mockError = new Error("CV data unavailable");
      (apolloClient.query as any).mockRejectedValue(mockError);

      await expect(getAllProjectsData()).rejects.toThrow(
        "Mocked: CV data unavailable"
      );
      expect(getDetailedError).toHaveBeenCalledWith(mockError);
    });
  });
});
