import { describe, expect, it } from "vitest";

import {
  checkUserId,
  checkCvId,
  getDetailedError,
} from "../../src/utils/handleErrors";

import {
  NOT_FOUND_USER,
  NOT_FOUND_CV,
  UNAUTHORIZED_ERROR,
} from "../../src/constants/errorMessage";

const randomBigInt = 2147483648n;

describe("handleErrors util", () => {
  it("check the result of the checkUserId method", () => {
    expect(() => checkUserId("23.4")).toThrow("user");
    expect(() => checkUserId("23.4")).toThrow(new Error(NOT_FOUND_USER));
    expect(() => checkUserId(randomBigInt.toString())).toThrow(
      new Error(NOT_FOUND_USER)
    );
    expect(checkUserId("7")).toBeUndefined();
  });

  it("check the result of the checkCvId method", () => {
    expect(() => checkCvId("23.4")).toThrow("CV");
    expect(() => checkCvId("23.4")).toThrow(new Error(NOT_FOUND_CV));
    expect(() => checkCvId(randomBigInt.toString())).toThrow(
      new Error(NOT_FOUND_CV)
    );
    expect(checkCvId("7")).toBeUndefined();
  });

  it("check the result of the getDetailedError method", () => {
    expect(getDetailedError(new Error("Invalid credentials"))).toStrictEqual(
      new Error("INVALID_CREDENTIALS")
    );
    expect(getDetailedError(new Error("Failed to fetch"))).toStrictEqual(
      new Error("NO_NETWORK_CONNECTION")
    );
    expect(getDetailedError(new Error("User already exists"))).toStrictEqual(
      new Error("EMAIL_DUPLICATE_ERROR")
    );
    expect(
      getDetailedError(
        new Error("Cannot return null for non-nullable field Query.user.")
      )
    ).toStrictEqual(new Error("NOT_FOUND_USER"));
    expect(
      getDetailedError(
        new Error("Cannot return null for non-nullable field Query.cv.")
      )
    ).toStrictEqual(new Error("NOT_FOUND_CV"));
    expect(getDetailedError(new Error(NOT_FOUND_USER))).toStrictEqual(
      new Error("NOT_FOUND_USER")
    );
    expect(getDetailedError(new Error(NOT_FOUND_CV))).toStrictEqual(
      new Error("NOT_FOUND_CV")
    );
    expect(getDetailedError(new Error("Bad Request Exception"))).toStrictEqual(
      new Error("BAD_INPUT_DATA")
    );
    expect(getDetailedError(new Error("Unauthorized"))).toStrictEqual(
      new Error("UNAUTHORIZED_ERROR", { cause: UNAUTHORIZED_ERROR })
    );
    expect(
      getDetailedError(new Error("Loading chunk en failed"))
    ).toStrictEqual(new Error("LANG_EN_LOADING_ERROR"));
    expect(
      getDetailedError(new Error("Loading chunk de failed"))
    ).toStrictEqual(new Error("LANG_DE_LOADING_ERROR"));
  });
  expect(getDetailedError(new Error("Loading chunk ru failed"))).toStrictEqual(
    new Error("LANG_RU_LOADING_ERROR")
  );
  expect(getDetailedError(new Error("Some error"))).toStrictEqual(
    new Error("UNEXPECTED_ERROR")
  );
  expect(getDetailedError(new Error())).toStrictEqual(
    new Error("UNEXPECTED_ERROR")
  );
});
