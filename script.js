const CATEGORY_LABELS = {
  clothing: "QUẦN ÁO",
  footwear: "GIÀY BẢO HỘ",
  head: "BẢO VỆ ĐẦU",
  hand: "BẢO VỆ TAY",
  eye: "BẢO VỆ MẮT & MẶT",
  fall: "CHỐNG RƠI",
  respiratory: "BẢO VỆ HÔ HẤP"
};

const CATEGORY_VISUALS = {
  clothing: "visual-green",
  footwear: "visual-blue",
  head: "visual-orange",
  hand: "visual-red",
  eye: "visual-purple",
  fall: "visual-dark",
  respiratory: "visual-yellow"
};

const CATEGORY_GLYPHS = {
  clothing: "ÁO",
  footwear: "GIÀY",
  head: "MŨ",
  hand: "GĂNG",
  eye: "KÍNH",
  fall: "CHỐNG RƠI",
  respiratory: "KHẨU TRANG"
};

const FALLBACK_PRODUCTS = [
  {name:"Quần áo bảo hộ lao động",brand:"Minh Hải",category:"clothing",image:"",description:"Trang phục làm việc, đồng phục bảo hộ và các mẫu theo nhu cầu môi trường sử dụng."},
  {name:"Giày bảo hộ",brand:"Minh Hải",category:"footwear",image:"",description:"Các dòng giày phục vụ môi trường công trường, nhà xưởng và khu vực có yêu cầu bảo vệ bàn chân."},
  {name:"Mũ bảo hộ",brand:"Minh Hải",category:"head",image:"",description:"Mũ bảo hộ và phụ kiện hỗ trợ bảo vệ đầu trong các môi trường làm việc phù hợp."},
  {name:"Găng tay bảo hộ",brand:"Minh Hải",category:"hand",image:"",description:"Các loại găng tay theo tính chất công việc như cơ khí, thao tác vật liệu hoặc công trường."},
  {name:"Kính bảo hộ & thiết bị bảo vệ mặt",brand:"Minh Hải",category:"eye",image:"",description:"Nhóm sản phẩm hỗ trợ bảo vệ mắt và vùng mặt theo nhu cầu sử dụng thực tế."},
  {name:"Áo phản quang",brand:"Minh Hải",category:"clothing",image:"",description:"Trang phục/áo phản quang dành cho môi trường cần tăng khả năng nhận diện người lao động."},
  {name:"Thiết bị chống rơi",brand:"Minh Hải",category:"fall",image:"",description:"Dây đai và thiết bị hỗ trợ làm việc trên cao; cần chọn theo đúng điều kiện và tiêu chuẩn áp dụng."},
  {name:"Khẩu trang & mặt nạ",brand:"Minh Hải",category:"respiratory",image:"",description:"Nhóm sản phẩm bảo vệ hô hấp; lựa chọn cần căn cứ vào môi trường, tác nhân và yêu cầu sử dụng."}
];

let products = [];
let activeCategory = "all";
let activeBrand = "all";

document.getElementById("year").textContent = new Date().getFullYear();

function normalizeImagePath(path) {
  if (!path) return "";
  // Decap stores the relative path in products.json, which works on both
  // the GitHub Pages project path and the future custom domain.
  return path.replace(/^\.?\//, "");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function renderBrandFilter() {
  const select = document.getElementById("brand-filter");
  const brands = [...new Set(products.map(p => (p.brand || "").trim()).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, "vi"));
  select.innerHTML = '<option value="all">Tất cả hãng</option>' +
    brands.map(brand => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`).join("");
  select.value = brands.includes(activeBrand) ? activeBrand : "all";
  if (!brands.includes(activeBrand)) activeBrand = "all";
}

function productMatches(product) {
  const categoryMatch = activeCategory === "all" || product.category === activeCategory;
  const brandMatch = activeBrand === "all" || (product.brand || "") === activeBrand;
  return categoryMatch && brandMatch;
}

function productCard(product, index) {
  const image = normalizeImagePath(product.image);
  const category = CATEGORY_LABELS[product.category] || "BẢO HỘ LAO ĐỘNG";
  const visual = CATEGORY_VISUALS[product.category] || "visual-dark";
  const glyph = CATEGORY_GLYPHS[product.category] || "PPE";
  const safeName = escapeHtml(product.name || "Sản phẩm bảo hộ");
  const safeBrand = escapeHtml(product.brand || "Đang cập nhật");
  const safeDescription = escapeHtml(product.description || "Liên hệ Minh Hải để được tư vấn mẫu và thông tin chi tiết.");
  const media = image
    ? `<div class="product-image"><img src="${escapeHtml(image)}" alt="${safeName}" loading="lazy"></div>`
    : `<div class="product-image"><div class="product-visual ${visual}"><span>${glyph}</span></div></div>`;

  return `
    <article class="product-card" data-index="${index}" tabindex="0" role="button" aria-label="Xem ${safeName}">
      ${media}
      <div class="product-body">
        <span class="tag">${category}</span>
        <h3>${safeName}</h3>
        <div class="product-brand">Hãng: ${safeBrand}</div>
        <p>${safeDescription}</p>
        <span class="text-link">Xem mẫu & thông tin →</span>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const filtered = products
    .map((p, i) => ({p, i}))
    .filter(({p}) => productMatches(p));

  if (!filtered.length) {
    grid.className = "product-grid empty";
    grid.innerHTML = `<div class="no-results">Chưa có sản phẩm phù hợp với bộ lọc hiện tại.</div>`;
    return;
  }

  grid.className = "product-grid";
  grid.innerHTML = filtered.map(({p, i}) => productCard(p, i)).join("");

  grid.querySelectorAll(".product-card").forEach(card => {
    const index = Number(card.dataset.index);
    card.addEventListener("click", () => openProduct(products[index]));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProduct(products[index]);
      }
    });
  });
}

function openProduct(product) {
  const modal = document.getElementById("product-modal");
  const imageHost = document.getElementById("modal-product-media");
  const image = normalizeImagePath(product.image);
  const category = CATEGORY_LABELS[product.category] || "BẢO HỘ LAO ĐỘNG";
  const visual = CATEGORY_VISUALS[product.category] || "visual-dark";
  const glyph = CATEGORY_GLYPHS[product.category] || "PPE";

  imageHost.innerHTML = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}">`
    : `<div class="product-visual ${visual}"><span>${glyph}</span></div>`;

  document.getElementById("modal-product-tag").textContent = category;
  document.getElementById("modal-product-name").textContent = product.name || "Sản phẩm bảo hộ";
  document.getElementById("modal-product-brand").textContent = `Hãng: ${product.brand || "Đang cập nhật"}`;
  document.getElementById("modal-product-description").textContent =
    product.description || "Liên hệ Minh Hải để được tư vấn mẫu và thông tin chi tiết.";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  const modal = document.getElementById("product-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.filter;
    renderProducts();
  });
});

document.getElementById("brand-filter").addEventListener("change", (event) => {
  activeBrand = event.target.value;
  renderProducts();
});

document.getElementById("product-modal-close").addEventListener("click", closeProduct);
document.getElementById("product-modal").addEventListener("click", (event) => {
  if (event.target.id === "product-modal") closeProduct();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProduct();
});

async function loadProducts() {
  try {
    const response = await fetch("data/products.json", {cache: "no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    products = Array.isArray(payload) ? payload : (payload.products || []);
  } catch (error) {
    console.warn("Không thể tải data/products.json; dùng dữ liệu mẫu.", error);
    products = FALLBACK_PRODUCTS;
  }

  renderBrandFilter();
  renderProducts();
}

loadProducts();
