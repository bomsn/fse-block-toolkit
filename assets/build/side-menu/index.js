(()=>{"use strict";var e,t={407:()=>{const e=window.wp.blocks,t=window.wp.i18n,n=window.wp.blockEditor,r=window.wp.components,i=window.wp.data,o=window.wp.element,c=window.wp.dom,l=window.React;const u=window.ReactJSXRuntime,s=["BUTTON","FIELDSET","INPUT","OPTGROUP","OPTION","SELECT","TEXTAREA","A"],a=({children:e,style:t={},...n})=>{const r=(0,o.useRef)(null),i=()=>{r.current&&c.focus.focusable.find(r.current).forEach((e=>{s.includes(e.nodeName)&&e.setAttribute("tabindex","-1"),e.hasAttribute("contenteditable")&&e.setAttribute("contenteditable","false")}))},a=function(e,t,n){var r=this,i=(0,l.useRef)(null),o=(0,l.useRef)(0),c=(0,l.useRef)(null),u=(0,l.useRef)([]),s=(0,l.useRef)(),a=(0,l.useRef)(),d=(0,l.useRef)(e),f=(0,l.useRef)(!0);d.current=e;var b="undefined"!=typeof window,v=!t&&0!==t&&b;if("function"!=typeof e)throw new TypeError("Expected a function");t=+t||0;var w=!!(n=n||{}).leading,h=!("trailing"in n)||!!n.trailing,p="maxWait"in n,k="debounceOnServer"in n&&!!n.debounceOnServer,g=p?Math.max(+n.maxWait||0,t):null;(0,l.useEffect)((function(){return f.current=!0,function(){f.current=!1}}),[]);var m=(0,l.useMemo)((function(){var e=function(e){var t=u.current,n=s.current;return u.current=s.current=null,o.current=e,a.current=d.current.apply(n,t)},n=function(e,t){v&&cancelAnimationFrame(c.current),c.current=v?requestAnimationFrame(e):setTimeout(e,t)},l=function(e){if(!f.current)return!1;var n=e-i.current;return!i.current||n>=t||n<0||p&&e-o.current>=g},m=function(t){return c.current=null,h&&u.current?e(t):(u.current=s.current=null,a.current)},x=function e(){var r=Date.now();if(l(r))return m(r);if(f.current){var c=t-(r-i.current),u=p?Math.min(c,g-(r-o.current)):c;n(e,u)}},y=function(){if(b||k){var d=Date.now(),v=l(d);if(u.current=[].slice.call(arguments),s.current=r,i.current=d,v){if(!c.current&&f.current)return o.current=i.current,n(x,t),w?e(i.current):a.current;if(p)return n(x,t),e(i.current)}return c.current||n(x,t),a.current}};return y.cancel=function(){c.current&&(v?cancelAnimationFrame(c.current):clearTimeout(c.current)),o.current=0,u.current=i.current=s.current=c.current=null},y.isPending=function(){return!!c.current},y.flush=function(){return c.current?m(Date.now()):a.current},y}),[w,p,t,g,h,v,b,k]);return m}(i,0,{leading:!0});return(0,o.useLayoutEffect)((()=>{let e;return i(),r.current&&(e=new window.MutationObserver(a),e.observe(r.current,{childList:!0,attributes:!0,subtree:!0})),()=>{e&&e.disconnect(),a.cancel()}}),[a]),(0,u.jsx)("div",{ref:r,"aria-disabled":"true",style:{userSelect:"none",pointerEvents:"none",cursor:"normal",...t},...n,children:e})},d=JSON.parse('{"UU":"fse-block-toolkit/side-menu"}');(0,e.registerBlockType)(d.UU,{edit:({attributes:e,setAttributes:o})=>{const{visibilityDesktop:c,visibilityTablet:l,visibilityMobile:s,selectedNavigation:d,selectedSecondaryNavigation:f}=e,b=(0,i.useSelect)((e=>{const n=e("core").getEntityRecords("postType","wp_navigation",{per_page:-1});return n?[{value:"",label:(0,t.__)("Select a navigation","fse-block-toolkit")},...n.map((e=>({value:e.id.toString(),label:e.title.rendered})))]:[]}),[]);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(n.InspectorControls,{children:[(0,u.jsxs)(r.PanelBody,{title:(0,t.__)("Visibility Settings","fse-block-toolkit"),children:[(0,u.jsx)(r.ToggleControl,{label:(0,t.__)("Show on Desktop","fse-block-toolkit"),checked:c,onChange:e=>o({visibilityDesktop:e})}),(0,u.jsx)(r.ToggleControl,{label:(0,t.__)("Show on Tablet","fse-block-toolkit"),checked:l,onChange:e=>o({visibilityTablet:e})}),(0,u.jsx)(r.ToggleControl,{label:(0,t.__)("Show on Mobile","fse-block-toolkit"),checked:s,onChange:e=>o({visibilityMobile:e})})]}),(0,u.jsxs)(r.PanelBody,{title:(0,t.__)("Navigation Settings","fse-block-toolkit"),children:[(0,u.jsx)(r.SelectControl,{label:(0,t.__)("Select Main Navigation","fse-block-toolkit"),value:d,options:b,onChange:e=>o({selectedNavigation:e})}),(0,u.jsx)(r.SelectControl,{label:(0,t.__)("Select Secondary Navigation","fse-block-toolkit"),value:f,options:b,onChange:e=>o({selectedSecondaryNavigation:e})})]})]}),(0,u.jsx)("div",{...(0,n.useBlockProps)({className:"fse-block-toolkit-side-menu"}),children:(0,u.jsx)(a,{children:(0,u.jsx)("button",{className:"fse-block-toolkit-side_menu_button","aria-label":(0,t.__)("Menu","fse-block-toolkit"),children:(0,u.jsx)(r.SVG,{height:"32px",width:"32px",id:"Layer_1",style:{enableBackground:"new 0 0 32 32"},version:"1.1",viewBox:"0 0 32 32",xmlSpace:"preserve",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",children:(0,u.jsx)(r.Path,{d:"M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"})})})})})]})},save:()=>null})}},n={};function r(e){var i=n[e];if(void 0!==i)return i.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,r),o.exports}r.m=t,e=[],r.O=(t,n,i,o)=>{if(!n){var c=1/0;for(a=0;a<e.length;a++){for(var[n,i,o]=e[a],l=!0,u=0;u<n.length;u++)(!1&o||c>=o)&&Object.keys(r.O).every((e=>r.O[e](n[u])))?n.splice(u--,1):(l=!1,o<c&&(c=o));if(l){e.splice(a--,1);var s=i();void 0!==s&&(t=s)}}return t}o=o||0;for(var a=e.length;a>0&&e[a-1][2]>o;a--)e[a]=e[a-1];e[a]=[n,i,o]},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={459:0,942:0,475:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var i,o,[c,l,u]=n,s=0;if(c.some((t=>0!==e[t]))){for(i in l)r.o(l,i)&&(r.m[i]=l[i]);if(u)var a=u(r)}for(t&&t(n);s<c.length;s++)o=c[s],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(a)},n=globalThis.webpackChunkfse_block_toolkit=globalThis.webpackChunkfse_block_toolkit||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var i=r.O(void 0,[942,475],(()=>r(407)));i=r.O(i)})();