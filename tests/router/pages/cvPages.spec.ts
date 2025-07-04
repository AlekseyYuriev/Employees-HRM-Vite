import { describe, it, expect } from "vitest";
import cvPages from "../../../src/router/pages/cvPages";

describe("router/pages/cvPages", () => {
  it("should export all CV-related pages", () => {
    expect(cvPages.CvsPage).toBeDefined();
    expect(cvPages.CvDetailsPage).toBeDefined();
    expect(cvPages.CvSkillsPage).toBeDefined();
    expect(cvPages.CvProjectsPage).toBeDefined();
    expect(cvPages.CvPreviewPage).toBeDefined();
  });
});
