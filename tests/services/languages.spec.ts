import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllLanguages,
  getAllLanguagesNames,
} from "../../src/services/languages";
import apolloClient from "../../src/plugins/apolloConfig";
import { getDetailedError } from "../../src/utils/handleErrors";
import type { ILanguagesTableServerData } from "../../src/types/pages/languagesTable";
import type { ILanguagesNamesData } from "../../src/types/pages/users/languages";

vi.mock("@/plugins/apolloConfig", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("@/utils/handleErrors", () => ({
  getDetailedError: vi.fn((error) => new Error("Mocked: " + error.message)),
}));

vi.mock("@/graphql/languages/getAllLanguages.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllLanguagesQuery",
}));

vi.mock("@/graphql/languages/getAllLanguagesNames.query.gql", () => ({
  __esModule: true,
  default: "mockedGetAllLanguagesNamesQuery",
}));

describe("languages service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllLanguages", () => {
    const mockLanguages: ILanguagesTableServerData[] = [
      { id: 1, name: "English", iso2: "EN", native_name: "English" },
      { id: 2, name: "German", iso2: "DE", native_name: "German" },
    ];

    it("should return all languages on success", async () => {
      (apolloClient.query as any).mockResolvedValue({
        data: { languages: mockLanguages },
      });

      const result = await getAllLanguages();
      expect(result).toEqual(mockLanguages);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: "mockedGetAllLanguagesQuery",
      });
    });

    it("should throw detailed error on failure", async () => {
      const mockError = new Error("API down");
      (apolloClient.query as any).mockRejectedValue(mockError);

      await expect(getAllLanguages()).rejects.toThrow("Mocked: API down");
      expect(getDetailedError).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getAllLanguagesNames", () => {
    const mockLanguageNames: ILanguagesNamesData[] = [
      { id: 1, name: "English" },
      { id: 2, name: "German" },
    ];

    it("should return all language names on success", async () => {
      (apolloClient.query as any).mockResolvedValue({
        data: { languages: mockLanguageNames },
      });

      const result = await getAllLanguagesNames();
      expect(result).toEqual(mockLanguageNames);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: "mockedGetAllLanguagesNamesQuery",
      });
    });

    it("should throw detailed error on failure", async () => {
      const mockError = new Error("Timeout");
      (apolloClient.query as any).mockRejectedValue(mockError);

      await expect(getAllLanguagesNames()).rejects.toThrow("Mocked: Timeout");
      expect(getDetailedError).toHaveBeenCalledWith(mockError);
    });
  });
});
