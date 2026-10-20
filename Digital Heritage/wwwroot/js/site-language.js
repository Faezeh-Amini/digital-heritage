window.siteLanguage = {
  get: () => localStorage.getItem("digital-heritage-language"),
  apply: (language) => {
    localStorage.setItem("digital-heritage-language", language);
    document.documentElement.lang = language === "ku" ? "ckb" : language;
    document.documentElement.dir = language === "ku" ? "rtl" : "ltr";
    window.dispatchEvent(new CustomEvent("digital-heritage-language-change", { detail: { language } }));
  }
};

