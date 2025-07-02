import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllPositionNames } from "../../src/services/positions";
import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import type { IPositionNamesData } from "../../src/types/pages/users/profile";

vi.mock("../../src/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("@/graphql/positions/getAllPositionNames.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllPositionNamesQuery",
}));

describe("getAllPositionNames", () => {
  const mockPositions: IPositionNamesData[] = [
    { id: "1", name: "Frontend Developer" },
    { id: "2", name: "Backend Developer" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return position names on success", async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { positions: mockPositions },
    });

    const result = await getAllPositionNames();
    expect(result).toEqual(mockPositions);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: "mockedGetAllPositionNamesQuery",
    });
  });

  it("should throw detailed error on failure", async () => {
    const mockError = new Error("GraphQL error");
    (apolloClient.query as any).mockRejectedValue(mockError);

    await expect(getAllPositionNames()).rejects.toThrow(
      "Mocked: GraphQL error"
    );
    expect(getDetailedError).toHaveBeenCalledWith(mockError);
  });
});
