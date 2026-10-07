(() => {
  const root = document.body?.dataset.root || "";
  const menu = document.querySelector("[data-site-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const productsToggle = document.querySelector("[data-products-menu-toggle]");
  const categoriesHost = document.querySelector("[data-menu-categories]");

  function esc(value="") { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
  function categoryHref(category) {
    return category.path ? `${root}${category.path}` : `${root}danh-muc/?category=${encodeURIComponent(category.key)}`;
  }
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("menu-open", open);
  }
  toggle?.addEventListener("click", () => setMenu(menu?.hidden ?? true));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", e => {
    if (!menu || !toggle || menu.hidden) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  productsToggle?.addEventListener("click", () => {
    const open = productsToggle.getAttribute("aria-expanded") !== "false";
    productsToggle.setAttribute("aria-expanded", String(!open));
    categoriesHost?.classList.toggle("is-collapsed", open);
  });

  async function loadMenuCategories() {
    if (!categoriesHost) return;
    try {
      const res = await fetch(`${root}data/categories.json`, {cache:"no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const categories = Array.isArray(data) ? data : (data.categories || []);
      categoriesHost.innerHTML = categories.map(c => `<a href="${esc(categoryHref(c))}">${esc(c.name || c.filter || c.key)}</a>`).join("");
      categoriesHost.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    } catch (err) {
      categoriesHost.innerHTML = `<a href="${root}#san-pham">Xem danh mục sản phẩm</a>`;
    }
  }
  loadMenuCategories();
})();
