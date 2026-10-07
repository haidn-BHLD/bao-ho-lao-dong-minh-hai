(() => {
  const STORAGE_KEY = "mh-theme";
  const root = document.documentElement;
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function updateControls(theme) {
    const isDark = theme === "dark";
    toggles.forEach((button) => {
      const icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
      button.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
      button.setAttribute("title", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
      button.setAttribute("aria-pressed", String(isDark));
    });
    if (themeMeta) themeMeta.setAttribute("content", isDark ? "#0d141b" : "#f7f8f7");
  }

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    root.dataset.theme = nextTheme;
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, nextTheme); } catch (error) {}
    }
    updateControls(nextTheme);
  }

  updateControls(currentTheme());

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });
})();
