(function () {
  // Shared storage key with the Label Studio web app so the language choice
  // stays in sync between the UI and the documentation.
  const STORAGE_KEY = "ls-language";
  const ZH_PREFIX = "/zh-cn";

  function currentLang() {
    return window.localStorage.getItem(STORAGE_KEY) || "en";
  }

  function isZhPath(path) {
    return path === ZH_PREFIX || path.startsWith(ZH_PREFIX + "/");
  }

  // Toggle the current path to the mirrored language version.
  function mirroredPath(path, targetLang) {
    const clean = path.replace(/\/index\.html$/, "/");
    const withoutQuery = clean.split("?")[0];
    const query = clean.includes("?") ? "?" + clean.split("?")[1] : "";

    let next;
    if (targetLang === "zh-CN") {
      next = isZhPath(withoutQuery) ? withoutQuery : ZH_PREFIX + (withoutQuery === "/" ? "/" : withoutQuery);
    } else {
      next = isZhPath(withoutQuery)
        ? withoutQuery.slice(ZH_PREFIX.length) || "/"
        : withoutQuery;
    }
    return next + query;
  }

  function applyLanguage(lang) {
    window.localStorage.setItem(STORAGE_KEY, lang);
    const target = mirroredPath(window.location.pathname, lang);
    if (target !== window.location.pathname) {
      window.location.pathname = target;
    } else {
      updateButtons();
    }
  }

  function updateButtons() {
    const active = currentLang();
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      const lang = btn.getAttribute("data-lang-switch");
      const isActive = (lang === "zh-CN" ? "zh-CN" : "en") === active;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function wire() {
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang-switch");
        applyLanguage(lang === "zh-CN" ? "zh-CN" : "en");
      });
    });
    updateButtons();

    // Auto-sync: if the stored language is Chinese but the visitor is on an
    // English page, redirect them to the Chinese equivalent.
    const stored = currentLang();
    if (stored === "zh-CN" && !isZhPath(window.location.pathname)) {
      const target = mirroredPath(window.location.pathname, "zh-CN");
      if (target !== window.location.pathname) {
        window.location.pathname = target;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
