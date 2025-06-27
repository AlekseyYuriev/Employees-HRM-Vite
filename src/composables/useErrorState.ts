import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import { handleLogout } from "@/services/auth";

import { UNAUTHORIZED_ERROR } from "@/constants/errorMessage";

interface UseErrorStateType {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  errorMessageKey: Ref<string>;
  setErrorValuesToDefault: () => void;
  setErrorValues: (error: unknown) => void;
}

export default function useErrorState(): UseErrorStateType {
  const { t } = useI18n({ useScope: "global" });
  const isLoading = ref(true);
  const isError = ref(false);
  const errorMessageKey = ref("UNEXPECTED_ERROR");

  function setErrorValuesToDefault() {
    isError.value = false;
    errorMessageKey.value = t("errors.UNEXPECTED_ERROR");
  }

  function setErrorValues(error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      if (error.cause === UNAUTHORIZED_ERROR) {
        handleLogout();
        return;
      }

      errorMessageKey.value = error.message;
    }
  }

  return {
    isLoading,
    isError,
    errorMessageKey,
    setErrorValuesToDefault,
    setErrorValues,
  };
}
