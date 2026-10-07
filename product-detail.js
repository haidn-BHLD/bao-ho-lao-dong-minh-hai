(() => {
  const root=document.body.dataset.root||"../";
  const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const joinRoot=(p="")=>`${root}${String(p).replace(/^\.\//,"")}`;
  const normalize=(p="")=>p?joinRoot(p.replace(/^\.\//,"")):"";
  const slugify=(v="")=>String(v).toLowerCase().replace(/đ/g,"d").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"san-pham";
  function shortHash(value=""){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36).slice(0,5)}
  const productSlug=p=>(p.slug||"").trim()||`${slugify(p.name)}-${shortHash(`${p.name}|${p.brand}|${p.category}`)}`;
  const wanted=new URLSearchParams(location.search).get("sp")||"";
  let products=[],categories=[],site={};

  function productHref(p){return `${joinRoot("san-pham/chi-tiet.html")}?sp=${encodeURIComponent(productSlug(p))}`;}
  function catMeta(key){return categories.find(c=>c.key===key)||{name:"Bảo hộ lao động",glyph:"PPE",visual:"visual-dark"};}

  function setMeta(p){
    const title=`${p.name} | Minh Hải`;
    document.title=title;
    const desc=(p.description||p.details||`Thông tin chi tiết ${p.name} tại Minh Hải.`).slice(0,160);
    document.querySelector('meta[name="description"]')?.setAttribute("content",desc);
    const canonical=`https://baoholaodongminhhaitn.com/san-pham/chi-tiet.html?sp=${encodeURIComponent(productSlug(p))}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href",canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content",title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content",desc);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content",canonical);
    const old=document.getElementById("product-jsonld"); if(old)old.remove();
    const json={"@context":"https://schema.org","@type":"Product","name":p.name,"description":desc,"category":catMeta(p.category).name};
    if(p.brand)json.brand={"@type":"Brand","name":p.brand};
    if(p.image)json.image=[`https://baoholaodongminhhaitn.com/${p.image.replace(/^\.?\//,"")}`];
    const s=document.createElement("script");s.id="product-jsonld";s.type="application/ld+json";s.textContent=JSON.stringify(json);document.head.appendChild(s);
  }

  function renderGallery(p){
    const host=document.querySelector("[data-product-gallery]"); if(!host)return;
    const raw=[]; if(p.image)raw.push(p.image); if(Array.isArray(p.gallery))raw.push(...p.gallery.map(x=>typeof x==="string"?x:(x&&x.image)||"").filter(Boolean));
    const images=[...new Set(raw)]; const m=catMeta(p.category);
    if(!images.length){host.innerHTML=`<div class="product-detail-placeholder ${esc(m.visual||'visual-dark')}"><span>${esc(m.glyph||'PPE')}</span></div>`;return;}
    const main=normalize(images[0]);
    host.innerHTML=`<div class="product-detail-main-image"><img data-product-main-image src="${esc(main)}" alt="${esc(p.name)}"></div>${images.length>1?`<div class="product-thumbnails">${images.map((img,i)=>`<button type="button" class="product-thumb${i===0?' active':''}" data-thumb="${esc(normalize(img))}"><img src="${esc(normalize(img))}" alt="Ảnh ${i+1} - ${esc(p.name)}"></button>`).join("")}</div>`:""}`;
    host.querySelectorAll("[data-thumb]").forEach(btn=>btn.onclick=()=>{host.querySelector("[data-product-main-image]").src=btn.dataset.thumb;host.querySelectorAll(".product-thumb").forEach(x=>x.classList.toggle("active",x===btn));});
  }

  function renderSpecs(p){
    const host=document.querySelector("[data-product-specs]"); if(!host)return;
    const specs=Array.isArray(p.specifications)?p.specifications.filter(x=>x&&(x.label||x.value)):[];
    const section=host.closest(".product-spec-section"), grid=host.closest(".product-detail-info-grid");
    if(!specs.length){section?.setAttribute("hidden","");grid?.classList.add("single-column");return;}
    section?.removeAttribute("hidden");grid?.classList.remove("single-column");
    host.innerHTML=specs.map(x=>`<div class="spec-row"><dt>${esc(x.label||"Thông tin")}</dt><dd>${esc(x.value||"")}</dd></div>`).join("");
  }

  function renderContact(p){
    const c=site.contact||{}; const host=document.querySelector("[data-product-contact]"); if(!host)return;
    const phone=c.phone||"0915418416", phoneDisplay=c.phone_display||phone, email=c.email||"haidn@baoholaodongminhhaitn.com", address=c.address||"Thái Nguyên", map=c.map_url||"#";
    host.innerHTML=`<h2>Liên hệ hỏi mẫu / báo giá</h2><p>${esc(p.contact_note||"Liên hệ Minh Hải để xác nhận mẫu, thông số kỹ thuật, khả năng cung cấp và báo giá sản phẩm.")}</p><div class="product-contact-actions"><a class="contact-action-card" href="tel:${esc(phone.replace(/\s+/g,''))}"><span>☎</span><div><small>Gọi điện</small><strong>${esc(phoneDisplay)}</strong></div></a><a class="contact-action-card" href="mailto:${esc(email)}"><span>✉</span><div><small>Email</small><strong>${esc(email)}</strong></div></a><a class="contact-action-card" href="${esc(map)}" target="_blank" rel="noopener"><span>⌖</span><div><small>Địa chỉ</small><strong>${esc(address)}</strong></div></a></div>`;
  }

  function renderRelated(p){
    const host=document.querySelector("[data-related-products]");if(!host)return;
    const related=products.filter(x=>x!==p&&x.category===p.category).slice(0,4);
    if(!related.length){host.closest(".related-product-section")?.setAttribute("hidden","");return;}
    host.innerHTML=related.map(x=>`<a class="related-product-card" href="${esc(productHref(x))}"><strong>${esc(x.name)}</strong><span>${esc(x.brand||"Minh Hải")}</span></a>`).join("");
  }

  function render(p){
    const m=catMeta(p.category); setMeta(p);
    document.querySelector("[data-product-category]").textContent=m.name||"Bảo hộ lao động";
    document.querySelectorAll("[data-product-name]").forEach(el=>{el.textContent=p.name||"Sản phẩm bảo hộ";});
    document.querySelector("[data-product-brand]").textContent=p.brand?`Thương hiệu: ${p.brand}`:"Thương hiệu: Đang cập nhật";
    document.querySelector("[data-product-summary]").textContent=p.description||"Liên hệ Minh Hải để được tư vấn thông tin sản phẩm.";
    document.querySelector("[data-product-details]").textContent=p.details||p.description||"Thông tin chi tiết đang được cập nhật. Vui lòng liên hệ Minh Hải để được tư vấn.";
    const catLink=document.querySelector("[data-category-link]"); if(catLink){catLink.textContent=m.name||"Danh mục";catLink.href=m.path?joinRoot(m.path):`${joinRoot("danh-muc/")}?category=${encodeURIComponent(p.category)}`;}
    renderGallery(p);renderSpecs(p);renderContact(p);renderRelated(p);
  }

  function renderNotFound(){const main=document.querySelector("[data-product-page]");if(main)main.innerHTML='<div class="container product-not-found"><h1>Không tìm thấy sản phẩm</h1><p>Sản phẩm có thể đã được đổi tên hoặc chưa được công bố.</p><a class="btn btn-primary" href="./">Xem danh sách sản phẩm</a></div>';}

  async function load(){
    try{
      const [pr,cr,sr]=await Promise.all([fetch(joinRoot("data/products.json"),{cache:"no-store"}),fetch(joinRoot("data/categories.json"),{cache:"no-store"}),fetch(joinRoot("data/site.json"),{cache:"no-store"})]);
      if(!pr.ok||!cr.ok)throw new Error("fetch failed");const pd=await pr.json(),cd=await cr.json();products=Array.isArray(pd)?pd:(pd.products||[]);categories=Array.isArray(cd)?cd:(cd.categories||[]);if(sr.ok)site=await sr.json();
      const product=products.find(p=>productSlug(p)===wanted); if(!product){renderNotFound();return;} render(product);
    }catch(e){console.warn(e);renderNotFound();}
  }
  load();
})();
