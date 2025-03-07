import*as e from"@wordpress/interactivity";var t={d:(e,s)=>{for(var r in s)t.o(s,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:s[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const s=(a={getContext:()=>e.getContext,store:()=>e.store,useEffect:()=>e.useEffect,withScope:()=>e.withScope},n={},t.d(n,a),n),r=["products","pages","posts"],o=e=>{let t={};for(let s of r)t[s]=e;return t};var a,n;const c=new class{constructor(e=100){this.maxSize=e,this.cache=new Map}get(e){if(!this.cache.has(e))return;const t=this.cache.get(e);return this.cache.delete(e),this.cache.set(e,t),t}set(e,t){this.cache.has(e)?this.cache.delete(e):this.cache.size>=this.maxSize&&this.cache.delete(this.cache.keys().next().value),this.cache.set(e,t)}}(100);let i;const{state:l,actions:h}=(0,s.store)("MiniSearchBlock",{state:{results:o([]),hasMore:o(!1),isLoading:o(!1),isEverythingLoading:!1,get hasResults(){let e={};for(let t of r)e[t]=l.results[t].length>0;return e}},actions:{stopPropagation:e=>{e.stopPropagation()},resetState:()=>{l.results=o([]),l.hasMore=o(!1),l.isLoading=o(!1),l.isEverythingLoading=!1},resetContext:()=>{const e=(0,s.getContext)();e.searchTerm="",e.searchPage=o(1),e.lastUpdatedSearchPage="",e.noResults=!1,e.requestInfo&&e.requestInfo.controller&&e.requestInfo.controller.abort(),e.requestInfo=null},toggleDrawer:()=>{const e=(0,s.getContext)();!1===e.isOpen?(e.isOpen=!0,document.body.classList.add("drawer-open")):h.closeDrawer()},closeDrawer:()=>{(0,s.getContext)().isOpen=!1,document.body.classList.remove("drawer-open")},performSearch:e=>{const t=(0,s.getContext)();t.isOpen&&(t.searchTerm=e.target.value,t.searchPage={products:1,pages:1,posts:1})},loadMore:e=>{e.preventDefault(),e.stopPropagation();const t=e.target.closest("button[data-section]");if(!t)return void console.error("Could not find button with data-section");const r=t.dataset.section;if(!r)return void console.error("No section found in data attribute");const o=(0,s.getContext)();o.searchPage[r]++,o.lastUpdatedSearchPage=r},initializeNewRequest:()=>{const e=(0,s.getContext)();e.requestInfo&&e.requestInfo.controller&&e.requestInfo.controller.abort();const t=new AbortController,r=Date.now();return e.requestInfo={id:r,controller:t},{signal:t.signal,id:r}},updateNonce:async()=>{const e=`${context.apiUrl.replace("/wp-json","")}wp-admin/admin-ajax.php?action=rest-nonce`;try{const t=await fetch(e);if(!t.ok)throw t;const r=await t.text();(0,s.getContext)().apiNonce=r}catch(e){throw console.error("Failed to update nonce:",e),e}},fetchREST:async(e,t={})=>{const r=(0,s.getContext)(),o={credentials:"include",headers:{"Content-Type":"application/json","X-WP-Nonce":r.apiNonce},signal:r.requestInfo.controller.signal,...t};try{const t=await fetch(r.apiUrl+e,o);if(!t.ok)throw t;return await t.json()}catch(s){if(403===s.status&&"rest_cookie_invalid_nonce"===s.statusText)return await h.updateNonce(),h.fetchREST(e,t);throw s}},fetchResults:async(e,t,s)=>{const r=`${s}-${e}-${t}`;if(c.get(r))return c.get(r);try{const o=new URLSearchParams({page:t.toString(),per_page:"5",status:"publish",search:e}),a="products"===s?"wc/v3/products":"wp/v2/"+s,n=await h.fetchREST(`${a}?${o}`),i=h.extractQueryData(n,s);return c.set(r,i),i}catch(e){if("AbortError"===e.name)throw e;return console.error(`Error fetching ${s}:`,e),[]}},query:async()=>{const e=(0,s.getContext)();e.noResults=!1;const{id:t}=h.initializeNewRequest();if(e.searchTerm.length<3||!e.isOpen)h.resetState();else try{if(e.lastUpdatedSearchPage){const s=e.lastUpdatedSearchPage;l.isLoading[s]=!0;const r=await h.fetchResults(e.searchTerm,e.searchPage[s],s);if(e.requestInfo.id!==t)return;l.results[s]=l.results[s].concat(r),l.hasMore[s]=5===r.length,l.isLoading[s]=!1,e.lastUpdatedSearchPage=""}else{if(h.resetState(),l.isEverythingLoading=!0,await Promise.all(r.map((async t=>{const s=await h.fetchResults(e.searchTerm,e.searchPage[t],t);l.results[t]=s,l.hasMore[t]=5===s.length}))),e.requestInfo.id!==t)return;l.isEverythingLoading=!1,l.hasResults.products||l.hasResults.products||l.hasResults.products||(e.noResults=!0)}}catch(s){"AbortError"===s.name?console.log("Request was cancelled"):(console.error("Search failed:",s),e.requestInfo&&e.requestInfo.id===t&&(l.isEverythingLoading=!1,l.isLoading=o(!1)))}},debounceQuery:(e=300)=>{clearTimeout(i),i=setTimeout((0,s.withScope)((()=>{h.query()})),e)},extractQueryData:(e,t)=>{let s=[];switch(Array.isArray(e)||(e=Object.values(e)),t){case"products":for(const t of e){const e=document.createElement("div");e.innerHTML=t.price_html;const r=e.textContent||e.innerText||"";s.push({type:"product",id:t.id,link:t.permalink,title:t.name,image:t.images&&t.images.length>0?t.images[0].src:"/wp-content/uploads/woocommerce-placeholder-150x150.png",price:t.price,price_html:r})}break;case"pages":for(const t of e)s.push({type:"page",id:t.id,title:t.title.rendered,link:t.link});break;case"posts":for(const t of e)s.push({type:"post",id:t.id,title:t.title.rendered,link:t.link});break;default:console.error("Unsupported type:",t)}return s}},callbacks:{setupModal:()=>{const e=(0,s.getContext)();(0,s.useEffect)((()=>{e.isOpen||(h.resetContext(),h.resetState())}),[e.isOpen])},setupSearch:()=>{const e=(0,s.getContext)();(0,s.useEffect)((()=>{!1!==e.isOpen&&(e.searchTerm.length<3?h.resetState():h.debounceQuery())}),[e.searchTerm]),(0,s.useEffect)((()=>{!1!==e.isOpen&&""!==e.lastUpdatedSearchPage&&(e.searchTerm.length<3?h.resetState():h.query())}),[e.lastUpdatedSearchPage])}}});