import { describe, it, expect } from "vitest";
import pagesIndex from "../../../src/router/pages/index";
import usersPages from "../../../src/router/pages/userPages";
import cvsPages from "../../../src/router/pages/cvPages";

describe("router/pages/index", () => {
  it("should export all main pages", () => {
    expect(pagesIndex.SignInPage).toBeDefined();
    expect(pagesIndex.SignUpPage).toBeDefined();
    expect(pagesIndex.SettingsPage).toBeDefined();
    expect(pagesIndex.ProjectsPage).toBeDefined();
    expect(pagesIndex.DepartmentsPage).toBeDefined();
    expect(pagesIndex.PositionsPage).toBeDefined();
    expect(pagesIndex.SkillsPage).toBeDefined();
    expect(pagesIndex.LanguagesPage).toBeDefined();
    expect(pagesIndex.NotFoundPage).toBeDefined();
  });

  it("should spread all userPages exports", () => {
    Object.keys(usersPages).forEach((key) => {
      expect(pagesIndex[key]).toBe(usersPages[key]);
    });
  });

  it("should spread all cvsPages exports", () => {
    Object.keys(cvsPages).forEach((key) => {
      expect(pagesIndex[key]).toBe(cvsPages[key]);
    });
  });
});
