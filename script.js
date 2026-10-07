(() => {
  const root = document.body?.dataset.root || "../";
  let categories = [], products = [], activeCategory = "all", activeBrand = "all", currentPage = 1;
  const PAGE_SIZE = 8;
  const esc = (v="") => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const joinRoot = (path="") => `${root}${String(path).replace(/^\.\//,"")}`;
  const normalizeImage = (path="") => path ? joinRoot(path.replace(/^\.\//,"")) : "";

  function slugify(value="") {
    return String(value).toLowerCase().replace(/đ/g,"d").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"") || "san-pham";
  }
  function shortHash(value="") { let h=2166136261; for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);} return (h>>>0).toString(36).slice(0,5); }
  function productSlug(p){ return (p.slug||"").trim() || `${slugify(p.name)}-${shortHash(`${p.name}|${p.brand}|${p.category}`)}`; }
  function productHref(p){ return `${joinRoot("san-pham/chi-tiet.html")}?sp=${encodeURIComponent(productSlug(p))}`; }
  function categoryMeta(key){ return categories.find(c=>c.key===key) || {name:"Bảo hộ lao động",glyph:"PPE",visual:"visual-dark"}; }
  function categoryHref(c){ return c.path ? joinRoot(c.path) : `${joinRoot("danh-muc/")}?category=${encodeURIComponent(c.key)}`; }

  function renderCategories(){
    const host = document.querySelector("[data-category-grid]");
    if (!host) return;
    host.innerHTML = categories.map(c => `<a class="seo-category-card" href="${esc(categoryHref(c))}"><strong>${esc(c.name||c.filter||c.key)}</strong><span>Xem danh mục →</span></a>`).join("");
  }

  function renderFilters(){
    const filters = document.getElementById("category-filters");
    if (!filters) return;
    filters.innerHTML = '<button class="filter active" data-filter="all">Tất cả</button>' + categories.map(c=>`<button class="filter" data-filter="${esc(c.key)}">${esc(c.filter||c.name||c.key)}</button>`).join("");
    filters.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
      activeCategory=btn.dataset.filter; currentPage=1;
      filters.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===btn));
      renderProducts(true);
    }));
  }

  function renderBrands(){
    const select=document.getElementById("brand-filter"); if(!select)return;
    const brands=[...new Set(products.map(p=>(p.brand||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"vi"));
    select.innerHTML='<option value="all">Tất cả thương hiệu</option>'+brands.map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join("");
    if(brands.includes(activeBrand)) select.value=activeBrand;
    select.onchange=e=>{activeBrand=e.target.value;currentPage=1;renderProducts(true);};
  }

  function card(p){
    const m=categoryMeta(p.category), img=normalizeImage(p.image), name=esc(p.name||"Sản phẩm bảo hộ"), brand=esc(p.brand||"Đang cập nhật"), desc=esc(p.description||"Xem thông tin chi tiết sản phẩm.");
    const media=img?`<div class="product-image"><img src="${esc(img)}" alt="${name}" loading="lazy"></div>`:`<div class="product-image"><div class="product-visual ${esc(m.visual||"visual-dark")}"><span>${esc(m.glyph||"PPE")}</span></div></div>`;
    return `<a class="product-card" href="${esc(productHref(p))}" aria-label="Xem chi tiết ${name}">${media}<div class="product-body"><span class="tag">${esc((m.name||"Bảo hộ lao động").toUpperCase())}</span><h3>${name}</h3><div class="product-brand">Thương hiệu: ${brand}</div><p>${desc}</p><span class="text-link">Xem chi tiết sản phẩm →</span></div></a>`;
  }

  function renderPagination(total){
    const nav=document.getElementById("product-pagination"); if(!nav)return;
    const pages=Math.max(1,Math.ceil(total/PAGE_SIZE)); currentPage=Math.min(currentPage,pages); nav.hidden=pages<=1;
    const nums=nav.querySelector("[data-page-numbers]");
    nums.innerHTML=Array.from({length:pages},(_,i)=>i+1).map(n=>`<button type="button" class="page-number${n===currentPage?' active':''}" data-page="${n}">${n}</button>`).join("");
    nav.querySelector("[data-page-prev]").disabled=currentPage===1; nav.querySelector("[data-page-next]").disabled=currentPage===pages;
    nav.querySelector("[data-page-status]").textContent=`Trang ${currentPage}/${pages}`;
    nums.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{currentPage=Number(b.dataset.page);renderProducts(true);});
    nav.querySelector("[data-page-prev]").onclick=()=>{if(currentPage>1){currentPage--;renderProducts(true)}};
    nav.querySelector("[data-page-next]").onclick=()=>{if(currentPage<pages){currentPage++;renderProducts(true)}};
  }

  function renderProducts(scroll=false){
    const grid=document.getElementById("product-grid"); if(!grid)return;
    const filtered=products.filter(p=>(activeCategory==="all"||p.category===activeCategory)&&(activeBrand==="all"||(p.brand||"")===activeBrand));
    if(!filtered.length){grid.className="product-grid empty";grid.innerHTML='<div class="no-results">Chưa có sản phẩm phù hợp.</div>';renderPagination(0);return;}
    const start=(currentPage-1)*PAGE_SIZE;
    grid.className="product-grid";grid.innerHTML=filtered.slice(start,start+PAGE_SIZE).map(card).join("");renderPagination(filtered.length);
    if(scroll) document.getElementById("product-grid")?.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function applyQuery(){
    const qs=new URLSearchParams(location.search); const c=qs.get("category"), b=qs.get("brand");
    if(c && categories.some(x=>x.key===c)) activeCategory=c;
    if(b) activeBrand=b;
  }

  async function load(){
    try{
      const [cr,pr]=await Promise.all([fetch(joinRoot("data/categories.json"),{cache:"no-store"}),fetch(joinRoot("data/products.json"),{cache:"no-store"})]);
      if(!cr.ok||!pr.ok)throw new Error("catalog fetch failed");
      const cd=await cr.json(),pd=await pr.json(); categories=Array.isArray(cd)?cd:(cd.categories||[]); products=Array.isArray(pd)?pd:(pd.products||[]);
    }catch(e){console.warn(e);categories=[];products=[];}
    applyQuery(); renderCategories(); renderFilters(); renderBrands();
    const filterBtn=document.querySelector(`[data-filter="${CSS.escape(activeCategory)}"]`); if(filterBtn){document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));filterBtn.classList.add("active");}
    renderProducts();
  }
  load();
})();
