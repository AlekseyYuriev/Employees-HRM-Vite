import VueCookies from "vue-cookies";
import { ITokenData } from "@/types/authData";

interface UseCookiesType {
  getToken: (tokenType: "accessToken" | "refreshToken") => string | null;
  setToken: (
    tokenType: "accessToken" | "refreshToken",
    tokenValue: string
  ) => void;
  removeToken: (tokenType: "accessToken" | "refreshToken") => void;
}

export default function useCookies(): UseCookiesType {
  const $cookies: typeof VueCookies = VueCookies;

  function getToken(tokenType: "accessToken" | "refreshToken"): string | null {
    const token: string | null = $cookies.get(tokenType);

    const tokenData: ITokenData | null = token
      ? JSON.parse(atob(token.split(".")[1]))
      : null;

    const isTokenValid =
      tokenData && new Date(tokenData.exp * 1000) > new Date();

    return isTokenValid ? token : null;
  }

  function setToken(
    tokenType: "accessToken" | "refreshToken",
    tokenValue: string
  ) {
    const tokenData: ITokenData = JSON.parse(atob(tokenValue.split(".")[1]));

    const expirationDate = new Date(tokenData.exp * 1000 - 5000);

    $cookies.set(tokenType, `Bearer ${tokenValue}`, expirationDate);
  }

  function removeToken(tokenType: "accessToken" | "refreshToken") {
    $cookies.remove(tokenType);
  }

  return {
    getToken,
    setToken,
    removeToken,
  };
}
