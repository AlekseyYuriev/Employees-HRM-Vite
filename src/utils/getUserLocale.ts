export default function getUserLocale() {
  const supportedLocales = import.meta.env.VITE_SUPPORTED_LOCALES.split(",");

  const userLang = localStorage.getItem("language");

  const browserLang = window.navigator.language.split("-")[0];

  if (userLang && supportedLocales.includes(userLang)) {
    return userLang;
  } else if (browserLang && supportedLocales.includes(browserLang)) {
    return browserLang;
  } else {
    return import.meta.env.VITE_DEFAULT_LOCALE;
  }
}
