import { describe, it, expect } from "vitest";
import type { ErrorObject } from "@vuelidate/core";

import { handleValidationErrors } from "../../src/utils/handleValidationErrors";

describe("handleValidationErrors util", () => {
  it("converts an array of ErrorObjects to a record of validation messages", () => {
    const errors: ErrorObject[] = [
      {
        $property: "email",
        $message: "Email is required",
        $propertyPath: "email",
        $validator: "required",
        $params: { type: "required" },
        $pending: false,
        $response: true,
        $uid: "email-required",
      },
      {
        $property: "password",
        $message: "Password is required",
        $propertyPath: "password",
        $validator: "required",
        $params: { type: "required" },
        $pending: false,
        $response: true,
        $uid: "password-required",
      },
    ];

    const expected = {
      email: "Email is required",
      password: "Password is required",
    };

    const result = handleValidationErrors<typeof expected>(errors);
    expect(result).toEqual(expected);
  });

  it("returns an empty object when the errors array is empty", () => {
    const errors: ErrorObject[] = [];

    const expected = {};

    const result = handleValidationErrors<typeof expected>(errors);
    expect(result).toEqual(expected);
  });

  it("handles errors with duplicate properties (last one wins)", () => {
    const errors: ErrorObject[] = [
      {
        $property: "password",
        $message: "Password is required",
        $propertyPath: "password",
        $validator: "required",
        $params: { type: "required" },
        $pending: false,
        $response: true,
        $uid: "password-required",
      },
      {
        $property: "password",
        $message: "Password should contain at least 6 characters",
        $propertyPath: "password",
        $validator: "minLength",
        $params: { min: 6, type: "minLength" },
        $pending: false,
        $response: true,
        $uid: "password-minLength",
      },
    ];

    const expected = {
      password: "Password should contain at least 6 characters",
    };

    const result = handleValidationErrors<typeof expected>(errors);
    expect(result).toEqual(expected);
  });
});
