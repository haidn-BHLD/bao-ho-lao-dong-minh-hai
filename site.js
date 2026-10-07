(() => {
  const root = document.body?.dataset.root || "";
  const menu = document.querySelector("[data-site-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const productsToggle = document.querySelector("[data-products-menu-toggle]");
  const categoriesHost = document.querySelector("[data-menu-categories]");
  let siteData = null;

  const esc = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const joinRoot = (path="") => `${root}${String(path).replace(/^\.\//,"")}`;
  const categoryHref = (category) => category.path ? joinRoot(category.path) : `${joinRoot("danh-muc/")}?category=${encodeURIComponent(category.key)}`;

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle?.addEventListener("click", () => setMenu(menu?.hidden ?? true));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", e => {
    if (!menu || !toggle || menu.hidden) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  productsToggle?.addEventListener("click", () => {
    const expanded = productsToggle.getAttribute("aria-expanded") === "true";
    productsToggle.setAttribute("aria-expanded", String(!expanded));
    categoriesHost?.classList.toggle("is-collapsed", expanded);
  });

  async function loadMenuCategories() {
    if (!categoriesHost) return;
    try {
      const res = await fetch(joinRoot("data/categories.json"), {cache:"no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const categories = Array.isArray(data) ? data : (data.categories || []);
      categoriesHost.innerHTML = `<a href="${joinRoot("san-pham/")}">Tất cả sản phẩm</a>` + categories.map(c => `<a href="${esc(categoryHref(c))}">${esc(c.name || c.filter || c.key)}</a>`).join("");
      categoriesHost.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    } catch (err) {
      categoriesHost.innerHTML = `<a href="${joinRoot("san-pham/")}">Xem sản phẩm</a>`;
    }
  }

  function setText(selector, value) {
    if (value == null || value === "") return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  }

  function applySiteData(data) {
    siteData = data || {};
    const hero = siteData.hero || {};
    const about = siteData.about || {};
    const contact = siteData.contact || {};

    setText("[data-hero-eyebrow]", hero.eyebrow);
    setText("[data-hero-title]", hero.title);
    setText("[data-hero-description]", hero.description);
    const primary = document.querySelector("[data-hero-primary]");
    if (primary && hero.primary_cta_label) primary.textContent = hero.primary_cta_label;
    if (primary && hero.primary_cta_url) primary.href = joinRoot(hero.primary_cta_url);

    setText("[data-about-eyebrow]", about.eyebrow);
    setText("[data-about-title]", about.title);
    setText("[data-about-description]", about.description);

    setText("[data-contact-title]", contact.title);
    setText("[data-contact-description]", contact.description);
    setText("[data-phone-display]", contact.phone_display || contact.phone);
    setText("[data-email]", contact.email);
    setText("[data-address]", contact.address);

    document.querySelectorAll("[data-phone-link]").forEach(el => {
      if (contact.phone) el.setAttribute("href", `tel:${contact.phone.replace(/\s+/g,"")}`);
      if (el.classList.contains("nav-cta") && contact.phone_display) el.textContent = `Gọi ${contact.phone_display}`;
    });
    document.querySelectorAll("[data-email-link]").forEach(el => { if (contact.email) el.setAttribute("href", `mailto:${contact.email}`); });
    document.querySelectorAll("[data-map-link]").forEach(el => { if (contact.map_url) el.setAttribute("href", contact.map_url); });

    renderCompanyHighlights(about.highlights || []);
    renderCompanyGallery(about.images || []);
    renderFloatingContact(contact);
  }

  function renderCompanyHighlights(items) {
    const host = document.querySelector("[data-company-highlights]");
    if (!host) return;
    const list = (Array.isArray(items) ? items : []).filter(x => x && (x.title || x.description));
    if (!list.length) return;
    host.innerHTML = list.map(item => `<div class="company-fact"><strong>${esc(item.title || "Thông tin")}</strong><span>${esc(item.description || "")}</span></div>`).join("");
  }

  function renderCompanyGallery(images) {
    const section = document.querySelector("[data-company-gallery-section]");
    const host = document.querySelector("[data-company-gallery]");
    if (!section || !host) return;
    const valid = (Array.isArray(images) ? images : []).filter(x => x && x.image);
    if (!valid.length) { section.hidden = true; host.innerHTML = ""; return; }
    host.innerHTML = valid.map((item, i) => `
      <figure class="company-gallery-card">
        <img src="${esc(joinRoot(item.image))}" alt="${esc(item.alt || `Hình ảnh Minh Hải ${i+1}`)}" loading="lazy">
        ${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ""}
      </figure>`).join("");
    section.hidden = false;
  }

  function renderFloatingContact(contact) {
    if (!document.body.classList.contains("show-contact-dock")) return;
    let dock = document.querySelector("[data-contact-dock]");
    if (!dock) {
      dock = document.createElement("aside");
      dock.className = "floating-contact-dock";
      dock.dataset.contactDock = "";
      dock.setAttribute("aria-label", "Liên hệ nhanh");
      document.body.appendChild(dock);
    }
    const phone = contact.phone || "0915418416";
    const email = contact.email || "haidn@baoholaodongminhhaitn.com";
    const mapUrl = contact.map_url || "https://www.google.com/maps/search/?api=1&query=Minh%20H%E1%BA%A3i%20Th%C3%A1i%20Nguy%C3%AAn";
    dock.innerHTML = `
      <a class="floating-contact-button phone" href="tel:${esc(phone.replace(/\s+/g,""))}" aria-label="Gọi điện" title="Gọi điện"><span>☎</span><small>Gọi</small></a>
      <a class="floating-contact-button email" href="mailto:${esc(email)}" aria-label="Gửi email" title="Gửi email"><span>✉</span><small>Email</small></a>
      <a class="floating-contact-button map" href="${esc(mapUrl)}" target="_blank" rel="noopener" aria-label="Xem địa chỉ" title="Xem địa chỉ"><span>⌖</span><small>Địa chỉ</small></a>`;
  }

  async function copyText(text, button) {
    if (!text) return;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
      } catch (_) {}
    }
    if (button) {
      const old = button.textContent;
      button.textContent = ok ? "Đã sao chép" : "Không sao chép được";
      setTimeout(() => { button.textContent = old; }, 1600);
    }
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-copy-contact]");
    if (!btn) return;
    const contact = siteData?.contact || {};
    const value = btn.dataset.copyContact === "email" ? contact.email : (contact.phone_display || contact.phone);
    copyText(value, btn);
  });

  async function loadSiteData() {
    try {
      const res = await fetch(joinRoot("data/site.json"), {cache:"no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      applySiteData(await res.json());
    } catch (e) {
      applySiteData({contact:{phone:"0915418416",phone_display:"0915 418 416",email:"haidn@baoholaodongminhhaitn.com"}});
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  loadMenuCategories();
  loadSiteData();
})();
