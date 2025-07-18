import { storeToRefs } from "pinia";
import apolloClient from "@/plugins/apolloConfig";

import { useAuthStore } from "@/store/authStore";

import useCookies from "@/composables/useCookies";
import useToast from "@/composables/useToast";

import { getDetailedError } from "@/utils/handleErrors";
import { handleUnauthorizedMessage } from "@/utils/handleNoLangMessage";

import loginQuery from "@/graphql/auth/login.query.gql";
import signupMutation from "@/graphql/auth/signUp.mutation.gql";
import updateAccessTokenMutation from "@/graphql/auth/updateAccessToken.mutation.gql";
import { IAuthServerData } from "@/types/authData";

export const login = async (email: string, password: string) => {
  try {
    const response = (await apolloClient.query({
      query: loginQuery,
      variables: { auth: { email, password } },
    })) as { data: { login: IAuthServerData } };

    await apolloClient.resetStore();

    return response.data.login;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: signupMutation,
      variables: { auth: { email, password } },
    })) as { data: { login: IAuthServerData } };

    await apolloClient.resetStore();

    return response.data.login;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateAccessToken = async () => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateAccessTokenMutation,
    })) as { data: { updateToken: { access_token: string } } };

    return response.data.updateToken.access_token;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const refreshAccessToken = async () => {
  const { getToken, setToken } = useCookies();

  if (!getToken("refreshToken")) {
    throw new Error("Unauthorized");
  }

  const newAccessToken = await updateAccessToken();

  setToken("accessToken", newAccessToken);
};

export const handleLogout = () => {
  const authStore = useAuthStore();
  const { wasAuthErrorToastShown } = storeToRefs(authStore);

  if (authStore.wasAuthErrorToastShown) return;

  const toastMessage = handleUnauthorizedMessage();

  const { setErrorToast } = useToast();
  setErrorToast(toastMessage);

  authStore.logout();

  wasAuthErrorToastShown.value = true;
};
