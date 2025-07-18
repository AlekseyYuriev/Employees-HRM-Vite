import {
  NOT_FOUND_CV,
  NOT_FOUND_USER,
  UNAUTHORIZED_ERROR,
} from "@/constants/errorMessage";

export function checkUserId(id: string) {
  if (!Number.isInteger(Number(id)) || BigInt(id) > 2147483647n) {
    throw new Error(NOT_FOUND_USER);
  }
}

export function checkCvId(id: string) {
  if (!Number.isInteger(Number(id)) || BigInt(id) > 2147483647n) {
    throw new Error(NOT_FOUND_CV);
  }
}

export function getDetailedError(error: unknown) {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid credentials":
        return new Error("INVALID_CREDENTIALS");
      case "Failed to fetch":
        return new Error("NO_NETWORK_CONNECTION");
      case "User already exists":
        return new Error("EMAIL_DUPLICATE_ERROR");
      case "Cannot return null for non-nullable field Query.user.":
        return new Error("NOT_FOUND_USER");
      case "Cannot return null for non-nullable field Query.cv.":
        return new Error("NOT_FOUND_CV");
      case NOT_FOUND_USER:
        return new Error("NOT_FOUND_USER");
      case NOT_FOUND_CV:
        return new Error("NOT_FOUND_CV");
      case "Bad Request Exception":
        return new Error("BAD_INPUT_DATA");
      case "Unauthorized":
        return new Error("UNAUTHORIZED_ERROR", { cause: UNAUTHORIZED_ERROR });
    }

    if (error.message.startsWith("Loading chunk en")) {
      return new Error("LANG_EN_LOADING_ERROR");
    } else if (error.message.startsWith("Loading chunk de")) {
      return new Error("LANG_DE_LOADING_ERROR");
    } else if (error.message.startsWith("Loading chunk ru")) {
      return new Error("LANG_RU_LOADING_ERROR");
    }
  }

  return new Error("UNEXPECTED_ERROR");
}
