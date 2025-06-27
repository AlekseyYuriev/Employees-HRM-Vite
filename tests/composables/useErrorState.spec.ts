import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import useErrorState from "../../src/composables/useErrorState";
import { handleLogout } from "../../src/services/auth";

import { UNAUTHORIZED_ERROR } from "../../src/constants/errorMessage";

const defaultErrorMessageKeyValue = "UNEXPECTED_ERROR";
const UNEXPECTED_ERROR = new Error("Unexpected error, please try again");
const RANDOM_ERROR = new Error("Random Error");
const UNAUTH_ERROR = new Error("UNAUTHORIZED_ERROR", {
  cause: UNAUTHORIZED_ERROR,
});

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => UNEXPECTED_ERROR.message,
    locale: ref("en"),
  }),
}));

vi.mock("@/services/auth", () => ({
  handleLogout: vi.fn(),
}));

describe("useErrorState composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { isLoading, isError, errorMessageKey } = useErrorState();

    expect(isLoading.value).toBe(true);
    expect(isError.value).toBe(false);
    expect(errorMessageKey.value).toBe(defaultErrorMessageKeyValue);
  });

  it("should change errorMessageKey value and return values to default", () => {
    const {
      isError,
      errorMessageKey,
      setErrorValues,
      setErrorValuesToDefault,
    } = useErrorState();

    setErrorValues(RANDOM_ERROR);

    expect(isError.value).toBe(true);
    expect(handleLogout).toHaveBeenCalledTimes(0);
    expect(errorMessageKey.value).toBe(RANDOM_ERROR.message);

    setErrorValuesToDefault();

    expect(isError.value).toBe(false);
    expect(errorMessageKey.value).toBe(UNEXPECTED_ERROR.message);
  });

  it("should call handleLogout method if Error cause is UNAUTHORIZED_ERROR", () => {
    const { isError, errorMessageKey, setErrorValues } = useErrorState();

    setErrorValues(UNAUTH_ERROR);

    expect(isError.value).toBe(true);
    expect(handleLogout).toHaveBeenCalled();
    expect(errorMessageKey.value).toBe(defaultErrorMessageKeyValue);
  });
});
