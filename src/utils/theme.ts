import { ITheme, isTheme } from "@/types/theme";

export const appTheme = (): ITheme => {
  const localTheme = localStorage.getItem("theme");
  return isTheme(localTheme) ? localTheme : "Dark";
};

export function getThemeValue(theme: ITheme): "light" | "dark" {
  switch (theme) {
    case "Light":
      return "light";
    case "Dark":
      return "dark";
    case "Device settings":
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else {
        return "light";
      }
  }
}
