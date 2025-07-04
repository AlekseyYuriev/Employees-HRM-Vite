import { describe, it, expect } from "vitest";
import userPages from "../../../src/router/pages/userPages";

describe("router/pages/userPages", () => {
  it("should export all user-related pages", () => {
    expect(userPages.UsersPage).toBeDefined();
    expect(userPages.UserProfilePage).toBeDefined();
    expect(userPages.UserSkillsPage).toBeDefined();
    expect(userPages.UserLanguagesPage).toBeDefined();
    expect(userPages.UserCvsPage).toBeDefined();
  });
});
