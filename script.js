const FALLBACK_CATEGORIES = [
  {key:"clothing",name:"Quần áo bảo hộ",filter:"Quần áo",path:"quan-ao-bao-ho/",glyph:"ÁO",visual:"visual-green"},
  {key:"footwear",name:"Giày bảo hộ",filter:"Giày",path:"giay-bao-ho/",glyph:"GIÀY",visual:"visual-blue"},
  {key:"head",name:"Mũ bảo hộ",filter:"Mũ & bảo vệ đầu",path:"mu-bao-ho/",glyph:"MŨ",visual:"visual-orange"},
  {key:"hand",name:"Găng tay bảo hộ",filter:"Găng tay",path:"gang-tay-bao-ho/",glyph:"GĂNG",visual:"visual-red"},
  {key:"eye",name:"Kính bảo hộ",filter:"Kính & mặt",path:"kinh-bao-ho/",glyph:"KÍNH",visual:"visual-purple"},
  {key:"fall",name:"Thiết bị chống rơi",filter:"Chống rơi",path:"thiet-bi-chong-roi/",glyph:"CHỐNG RƠI",visual:"visual-dark"},
  {key:"respiratory",name:"Bảo vệ hô hấp",filter:"Bảo vệ hô hấp",path:"bao-ve-ho-hap/",glyph:"KHẨU TRANG",visual:"visual-yellow"}
];
const FALLBACK_PRODUCTS = [
  {name:"Quần áo bảo hộ lao động",brand:"Minh Hải",category:"clothing",image:"",description:"Trang phục làm việc, đồng phục bảo hộ và các mẫu theo nhu cầu môi trường sử dụng."},
  {name:"Giày bảo hộ",brand:"Minh Hải",category:"footwear",image:"",description:"Các dòng giày phục vụ môi trường công trường, nhà xưởng và khu vực có yêu cầu bảo vệ bàn chân."},
  {name:"Mũ bảo hộ",brand:"Minh Hải",category:"head",image:"",description:"Mũ bảo hộ và phụ kiện hỗ trợ bảo vệ đầu trong các môi trường làm việc phù hợp."}
];
let categories=[], products=[], activeCategory="all", activeBrand="all", currentPage=1;
const PAGE_SIZE=8;
const year=document.getElementById("year"); if(year) year.textContent=new Date().getFullYear();
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function normalizeImagePath(path){return path ? path.replace(/^\.?\//,"") : "";}
function metaFor(key){return categories.find(c=>c.key===key)||{key,name:"Bảo hộ lao động",filter:"Bảo hộ",glyph:"PPE",visual:"visual-dark",path:""};}
function categoryHref(c){return c.path || `danh-muc/?category=${encodeURIComponent(c.key)}`;}
function renderCategories(){
  const grid=document.querySelector("[data-category-grid]");
  if(grid) grid.innerHTML=categories.map(c=>`<a class="seo-category-card" href="${esc(categoryHref(c))}"><strong>${esc(c.name||c.filter||c.key)}</strong><span>Xem sản phẩm →</span></a>`).join("");
  const filters=document.getElementById("category-filters");
  if(filters){filters.innerHTML='<button class="filter active" data-filter="all">Tất cả</button>'+categories.map(c=>`<button class="filter" data-filter="${esc(c.key)}">${esc(c.filter||c.name||c.key)}</button>`).join("");
    filters.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{filters.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");activeCategory=btn.dataset.filter;currentPage=1;renderProducts();}));
  }
}
function renderBrandFilter(){
  const select=document.getElementById("brand-filter"); if(!select)return;
  const brands=[...new Set(products.map(p=>(p.brand||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"vi"));
  select.innerHTML='<option value="all">Tất cả thương hiệu</option>'+brands.map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join("");
  if(!brands.includes(activeBrand)) activeBrand="all"; select.value=activeBrand;
}
function productMatches(p){return (activeCategory==="all"||p.category===activeCategory)&&(activeBrand==="all"||(p.brand||"")===activeBrand);}
function card(p,index){const m=metaFor(p.category),img=normalizeImagePath(p.image),name=esc(p.name||"Sản phẩm bảo hộ"),brand=esc(p.brand||"Đang cập nhật"),desc=esc(p.description||"Liên hệ Minh Hải để được tư vấn."); const media=img?`<div class="product-image"><img src="${esc(img)}" alt="${name}" loading="lazy"></div>`:`<div class="product-image"><div class="product-visual ${esc(m.visual||'visual-dark')}"><span>${esc(m.glyph||'PPE')}</span></div></div>`;return `<article class="product-card" data-index="${index}" tabindex="0" role="button" aria-label="Xem ${name}">${media}<div class="product-body"><span class="tag">${esc((m.name||'Bảo hộ lao động').toUpperCase())}</span><h3>${name}</h3><div class="product-brand">Thương hiệu: ${brand}</div><p>${desc}</p><span class="text-link">Xem mẫu & thông tin →</span></div></article>`;}
function renderPagination(total){
  const nav=document.getElementById("product-pagination"); if(!nav)return;
  const pages=Math.max(1,Math.ceil(total/PAGE_SIZE)); currentPage=Math.min(currentPage,pages); nav.hidden=pages<=1;
  const nums=nav.querySelector("[data-page-numbers]"); nums.innerHTML=Array.from({length:pages},(_,i)=>i+1).map(n=>`<button type="button" class="page-number${n===currentPage?' active':''}" data-page="${n}" aria-label="Trang ${n}">${n}</button>`).join("");
  nav.querySelector("[data-page-prev]").disabled=currentPage===1; nav.querySelector("[data-page-next]").disabled=currentPage===pages;
  nav.querySelector("[data-page-status]").textContent=`Trang ${currentPage}/${pages}`;
  nums.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>{currentPage=Number(b.dataset.page);renderProducts(true);}));
  nav.querySelector("[data-page-prev]").onclick=()=>{if(currentPage>1){currentPage--;renderProducts(true)}};
  nav.querySelector("[data-page-next]").onclick=()=>{if(currentPage<pages){currentPage++;renderProducts(true)}};
}
function renderProducts(scroll=false){const grid=document.getElementById("product-grid"); if(!grid)return; const filtered=products.map((p,i)=>({p,i})).filter(({p})=>productMatches(p)); if(!filtered.length){grid.className="product-grid empty";grid.innerHTML='<div class="no-results">Chưa có sản phẩm phù hợp với bộ lọc hiện tại.</div>';renderPagination(0);return;} const start=(currentPage-1)*PAGE_SIZE, page=filtered.slice(start,start+PAGE_SIZE);grid.className="product-grid";grid.innerHTML=page.map(({p,i})=>card(p,i)).join("");grid.querySelectorAll(".product-card").forEach(el=>{const i=Number(el.dataset.index);const open=()=>openProduct(products[i]);el.addEventListener("click",open);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}})});renderPagination(filtered.length);if(scroll) document.getElementById("product-grid")?.scrollIntoView({behavior:"smooth",block:"start"});}
function openProduct(p){const modal=document.getElementById("product-modal"); if(!modal)return; const m=metaFor(p.category),host=document.getElementById("modal-product-media"),img=normalizeImagePath(p.image);host.innerHTML=img?`<img src="${esc(img)}" alt="${esc(p.name)}">`:`<div class="product-visual ${esc(m.visual||'visual-dark')}"><span>${esc(m.glyph||'PPE')}</span></div>`;document.getElementById("modal-product-tag").textContent=(m.name||"Bảo hộ lao động").toUpperCase();document.getElementById("modal-product-name").textContent=p.name||"Sản phẩm bảo hộ";document.getElementById("modal-product-brand").textContent=`Thương hiệu: ${p.brand||"Đang cập nhật"}`;document.getElementById("modal-product-description").textContent=p.description||"Liên hệ Minh Hải để được tư vấn.";modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeProduct(){const m=document.getElementById("product-modal");if(!m)return;m.classList.remove("open");m.setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.getElementById("brand-filter")?.addEventListener("change",e=>{activeBrand=e.target.value;currentPage=1;renderProducts();});document.getElementById("product-modal-close")?.addEventListener("click",closeProduct);document.getElementById("product-modal")?.addEventListener("click",e=>{if(e.target.id==="product-modal")closeProduct();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProduct();});
async function load(){try{const [cr,pr]=await Promise.all([fetch("data/categories.json",{cache:"no-store"}),fetch("data/products.json",{cache:"no-store"})]);if(!cr.ok||!pr.ok)throw new Error("catalog fetch failed");const cd=await cr.json(),pd=await pr.json();categories=Array.isArray(cd)?cd:(cd.categories||[]);products=Array.isArray(pd)?pd:(pd.products||[]);}catch(e){console.warn("Không thể tải dữ liệu catalogue; dùng dữ liệu mẫu.",e);categories=FALLBACK_CATEGORIES;products=FALLBACK_PRODUCTS;}renderCategories();renderBrandFilter();renderProducts();}
load();
