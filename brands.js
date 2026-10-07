(() => {
  const root=document.body.dataset.root||"../";
  const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  async function load(){
    const host=document.querySelector("[data-brand-grid]"); if(!host)return;
    try{const r=await fetch(`${root}data/products.json`,{cache:"no-store"});if(!r.ok)throw new Error("fetch");const d=await r.json();const ps=Array.isArray(d)?d:(d.products||[]);const brands=[...new Set(ps.map(p=>(p.brand||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"vi"));if(!brands.length){host.innerHTML='<p class="no-results">Chưa có thương hiệu được khai báo.</p>';return;}host.innerHTML=brands.map(b=>`<a class="brand-card" href="${root}san-pham/?brand=${encodeURIComponent(b)}"><strong>${esc(b)}</strong><span>Xem sản phẩm →</span></a>`).join("");}catch(e){host.innerHTML='<p class="no-results">Không thể tải danh sách thương hiệu.</p>';}
  }
  load();
})();
