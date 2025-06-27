import { describe, expect, it, vi } from "vitest";

import {
  handleUnauthorizedMessage,
  handleLangLoadErrorMessage,
} from "../../src/utils/handleNoLangMessage";
import getUserLocale from "../../src/utils/getUserLocale";

vi.mock("@/utils/getUserLocale");

describe("handleNoLangMessage util", () => {
  it("should return correct Unauthorized Message for 'ru' locale", () => {
    vi.mocked(getUserLocale).mockReturnValue("ru");

    expect(handleUnauthorizedMessage()).toBe("Неавторизованный доступ");
    expect(handleLangLoadErrorMessage()).toBe(
      "Не удалось загрузить русскоязычные ресурсы"
    );
  });

  it("should return correct Unauthorized Message for 'de' locale", () => {
    vi.mocked(getUserLocale).mockReturnValue("de");

    expect(handleUnauthorizedMessage()).toBe("Nicht autorisiert");
    expect(handleLangLoadErrorMessage()).toBe(
      "Fehler beim Laden der deutschsprachigen Ressourcen"
    );
  });

  it("should return correct Unauthorized Message for 'en' locale", () => {
    vi.mocked(getUserLocale).mockReturnValue("en");

    expect(handleUnauthorizedMessage()).toBe("Unauthorized");
    expect(handleLangLoadErrorMessage()).toBe(
      "Failed to load english language resources"
    );
  });

  it("should return correct Unauthorized Message for any other locale", () => {
    vi.mocked(getUserLocale).mockReturnValue("fr");

    expect(handleUnauthorizedMessage()).toBe("Unauthorized");
    expect(handleLangLoadErrorMessage()).toBe(
      "Failed to load english language resources"
    );
  });
});
