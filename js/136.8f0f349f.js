"use strict";(self["webpackChunkTHChatUI"]=self["webpackChunkTHChatUI"]||[]).push([[136],{5965:function(e,t,n){n.d(t,{y:function(){return f}});n(6573),n(8100),n(7936),n(7467),n(4732),n(9577);async function o(e,t){const n=e.getReader();let o;while(!(o=await n.read()).done)t(o.value)}function r(e){let t,n,o,r=!1;return function(a){void 0===t?(t=a,n=0,o=-1):t=i(t,a);const s=t.length;let c=0;while(n<s){r&&(10===t[n]&&(c=++n),r=!1);let a=-1;for(;n<s&&-1===a;++n)switch(t[n]){case 58:-1===o&&(o=n-c);break;case 13:r=!0;case 10:a=n;break}if(-1===a)break;e(t.subarray(c,a),o),c=n,o=-1}c===s?t=void 0:0!==c&&(t=t.subarray(c),n-=c)}}function a(e,t,n){let o=s();const r=new TextDecoder;return function(a,i){if(0===a.length)null===n||void 0===n||n(o),o=s();else if(i>0){const n=r.decode(a.subarray(0,i)),s=i+(32===a[i+1]?2:1),c=r.decode(a.subarray(s));switch(n){case"data":o.data=o.data?o.data+"\n"+c:c;break;case"event":o.event=c;break;case"id":e(o.id=c);break;case"retry":const n=parseInt(c,10);isNaN(n)||t(o.retry=n);break}}}}function i(e,t){const n=new Uint8Array(e.length+t.length);return n.set(e),n.set(t,e.length),n}function s(){return{data:"",event:"",id:"",retry:void 0}}var c=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const l="text/event-stream",d=1e3,u="last-event-id";function f(e,t){var{signal:n,headers:i,onopen:s,onmessage:f,onclose:p,onerror:y,openWhenHidden:b,fetch:v}=t,g=c(t,["signal","headers","onopen","onmessage","onclose","onerror","openWhenHidden","fetch"]);return new Promise(((t,c)=>{const w=Object.assign({},i);let m;function O(){m.abort(),document.hidden||E()}w.accept||(w.accept=l),b||document.addEventListener("visibilitychange",O);let k=d,j=0;function T(){document.removeEventListener("visibilitychange",O),window.clearTimeout(j),m.abort()}null===n||void 0===n||n.addEventListener("abort",(()=>{T(),t()}));const x=null!==v&&void 0!==v?v:window.fetch,C=null!==s&&void 0!==s?s:h;async function E(){var n;m=new AbortController;try{const n=await x(e,Object.assign(Object.assign({},g),{headers:w,signal:m.signal}));await C(n),await o(n.body,r(a((e=>{e?w[u]=e:delete w[u]}),(e=>{k=e}),f))),null===p||void 0===p||p(),T(),t()}catch(i){if(!m.signal.aborted)try{const e=null!==(n=null===y||void 0===y?void 0:y(i))&&void 0!==n?n:k;window.clearTimeout(j),j=window.setTimeout(E,e)}catch(s){T(),c(s)}}}E()}))}function h(e){const t=e.headers.get("content-type");if(!(null===t||void 0===t?void 0:t.startsWith(l)))throw new Error(`Expected content-type to be ${l}, Actual: ${t}`)}},1136:function(e,t,n){n.r(t),n.d(t,{fenchStream:function(){return i}});n(4114);var o=n(5965),r=n(2882);const a="/local/"+r.A.state.setting.chat_type+"/stream";async function i({prompt:e,history:t,files:n,controller:r,onopen:i,onmessage:c,onclose:l,onerror:d}){await(0,o.y)(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:s(e,t,n),signal:r.signal,onopen:i,onmessage:c,onclose:l,onerror:d,openWhenHidden:!0})}function s(e,t,n){let o={prompt:e,history:c(t),files:n};return JSON.stringify({input:o})}function c(e){const t=[];for(let n=0;n<e.length;n++){const o=e[n];t.push({user:o.query,assistant:o.answer})}return t}}}]);
//# sourceMappingURL=136.8f0f349f.js.map