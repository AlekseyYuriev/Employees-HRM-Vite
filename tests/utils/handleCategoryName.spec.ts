import { describe, expect, it } from "vitest";
import handleCategoryNames from "../../src/utils/handleCategoryName";

const categoryNameProgrammingLanguagesDE = "Programmiersprachen";
const categoryNameProgrammingLanguagesEN = "Programming languages";

const categoryNameProgrammingTechnologiesRU = "Технологии разработки";
const categoryNameProgrammingTechnologiesEN = "Programming technologies";

const categoryNameSourceControlSystemsDE = "Quellcodeverwaltungssysteme";
const categoryNameSourceControlSystemsEN = "Source control systems";

const categoryNameDatabaseManagementSystemEN = "Database management system";

const categoryNameOtherSkills = "Other skills";

const grade = "Middle";

describe("handleCategoryNames util", () => {
  it("should return correct programming language", () => {
    expect(handleCategoryNames(categoryNameProgrammingLanguagesDE)).toBe(
      categoryNameProgrammingLanguagesEN
    );
  });

  it("should return correct programming technologie", () => {
    expect(handleCategoryNames(categoryNameProgrammingTechnologiesRU)).toBe(
      categoryNameProgrammingTechnologiesEN
    );
  });

  it("should return correct source control system", () => {
    expect(handleCategoryNames(categoryNameSourceControlSystemsDE)).toBe(
      categoryNameSourceControlSystemsEN
    );
  });

  it("should return correct database management system", () => {
    expect(handleCategoryNames(categoryNameDatabaseManagementSystemEN)).toBe(
      categoryNameDatabaseManagementSystemEN
    );
  });

  it("should return 'Other skills' if argument is null", () => {
    expect(handleCategoryNames(null)).toBe(categoryNameOtherSkills);
  });

  it("should return 'Other skills' if category name is not supported", () => {
    expect(handleCategoryNames(grade)).toBe(categoryNameOtherSkills);
  });
});
