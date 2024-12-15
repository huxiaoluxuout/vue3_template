function e(e,t){const n=Object.prototype.toString.call(e).replace(/\[object (\w+)\]/,"$1").toLowerCase();return t?n===t:n}function t(e){return new Proxy(e,{get:(e,t,n)=>Reflect.get(e,t,n),set:(e,t,n,o)=>Reflect.set(e,t,n,o)})}function n(e=uni,t){return{ylxEventBus:new r(e),ylxNextPage:new a(e,t),ylxMustLogIn:new s(e,t)}}const o=new class{constructor(){this.eventListeners=new Map}on(e,t){this.eventListeners.has(e)||this.eventListeners.set(e,{}),this.eventListeners.get(e)[t.name]=t}once(e,t){const n=(...o)=>{t(...o),this.off(e,n)};this.on(e,n)}emit(t,...n){let o,r,a;if(e(t,"string"))o=t;else{if(!e(t,"object"))throw new Error("第一个参数必须是字符串或对象");o=t.event,r=t.handler,a=t.source}const s=this.eventListeners.get(o);if(!s)return;const i={args:n,source:a};if(r){const e=s[r];e&&e(i)}else Object.values(s).forEach((e=>e(i)))}off(t,n,o){if(n){if(e(n,"function")){const e=this.eventListeners.get(t);e&&(o?Object.keys(e).forEach((t=>{delete e[t]})):delete e[n.name])}}else this.eventListeners.delete(t)}clear(){this.eventListeners.clear()}};class r{static platform=null;constructor(e){r.platform=e}static NAVIGATION_TYPES={NAVIGATE_TO:"navigateTo",SWITCH_TAB:"switchTab"};static eventBusSet=new Set;static defaultGlobalCallback=()=>({});onGlobal(e=r.defaultGlobalCallback){o.on("AppEvent",e),o.on("GLOBAL_PAGES_EVENT",r.handlerListener)}static handlerListener({args:e,source:t}){let[{navigationType:n,targetPath:o,isNavigationEnabled:a,options:s,sourceName:i}]=e;const{path:c,query:l,delimiter:u}=function(e){const t=e.startsWith("/")?e:"/"+e,[n,o]=t.split("?");return{path:n,query:o?"?"+o:"",delimiter:o?"&":"?"}}(o);r.sendTargetPage(c,t,s,i),r.handleNavigation(n,c,l,u,s,a)}static sendTargetPage(e,t,n,a){r.eventBusSet.has(e)?o.emit({event:e,source:a||t},n):o.once("CURRENT_PAGE_EVENT"+e,(()=>(r.eventBusSet.add(e),o.emit({event:e,source:a||t},n))))}static handleNavigation(e,t,n,o,a,s){if(!s)return;if(e!==r.NAVIGATION_TYPES.NAVIGATE_TO&&e!==r.NAVIGATION_TYPES.SWITCH_TAB)return void console.error(`导航路径：${JSON.stringify(r.NAVIGATION_TYPES)}`);const i=e===r.NAVIGATION_TYPES.NAVIGATE_TO?`${t}${n}${o}currentRoute=${t}`:t;r.platform[e]({url:i,fail:e=>console.error("Navigation Error:",e)})}async emit({targetPath:t,options:n={},source:a="",prevPage:s=!1},i=!1,c=r.NAVIGATION_TYPES.NAVIGATE_TO){const{currentRoute:l,prevPageRoute:u}=await r.getRoute();s&&u&&(t=u);const g=e(n,"object")?Object.assign({fromPage:l},n):n;return new Promise((e=>{g.thenCallback=e,o.emit({event:"GLOBAL_PAGES_EVENT",source:l,handler:"handlerListener"},{navigationType:c,targetPath:t,isNavigationEnabled:i,options:g,sourceName:a})}))}async emitGlobal(t={},n=""){const a=await r.getRoute(),s=e(t,"object")?Object.assign({fromPage:a},t):t;return new Promise((e=>{s.thenCallback=e,o.emit({event:"AppEvent",source:n||a},s)}))}static getRoute(){const e=getCurrentPages();let t=null;e.length>=2&&(t="/"+e[e.length-2].route);const n="/"+e[e.length-1].route;return Promise.resolve({currentRoute:n,prevPageRoute:t})}on(t){e(t,"function")&&r.getRoute().then((({currentRoute:e})=>{r.eventBusSet.has(e)||r.eventBusSet.add(e),o.on(e,t),o.emit("CURRENT_PAGE_EVENT"+e)}))}off(t,{targetPath:n,del:a=!1}){e(n,"undefined")?r.getRoute().then((({currentRoute:e})=>{o.off(e,t,a)})):o.off(n,t,a)}clear(){o.clear()}}class a{static platform=null;static pageInfo={page:1,pageSize:10};loadingProxyObject=null;static loadingObj={loading:!0};constructor(e,n){a.platform=e,n&&(a.loadingObj=n(a.loadingObj)),this.loadingProxyObject=t(a.loadingObj)}setLoadingProxyObject(e){this.loadingProxyObject.loading=e}useNextPage(n={page:1,pageSize:10}){function o(){b.page=a.pageInfo.page,b.pageSize=a.pageInfo.pageSize}function r(t){h=!0,d=!1,i.setLoadingProxyObject(!0),o(),p(),e(t,"function")&&t(b)}function s(){b.page>1&&!d&&p()}const i=this,{setFun:c,addFun:l,invokeAllFn:u}=function(){let e=[],t=[];return{addFun:(e,...n)=>{t.some((t=>t.func===e&&t.args.length===n.length))||t.push({func:e,args:n})},setFun:(t,...n)=>{e=[{func:t,args:n}]},invokeAllFn:function(){const n=t.concat(e);for(;n.length>0;){const{func:e,args:t}=n.pop();e(...t)}}}}(),g=l,f=c,p=u;e(n,"object")||(n={page:1,pageSize:10}),n.page||n.pageSize||(n={page:1,pageSize:10});let h=!1,d=!1;a.pageInfo={...n};const b=t(n);let P=0;return{ylxMixins:{onLoad(){o()},onReachBottom(){s()},onPullDownRefresh(){r(),P=setTimeout((()=>{a.platform.stopPullDownRefresh()}),2500)}},ylxPageInfo:b,ylxReachBottom:s,ylxSetFun:f,ylxAddFun:g,ylxInvokeFn:p,ylxRefresh:r,ylxSetData:function({data:t=[],resData:n=[]},o=!1){if(a.platform.stopPullDownRefresh(),clearTimeout(P),i.setLoadingProxyObject(!1),!e(t,"array"))return n;if(e(t,"array")&&!e(n,"array")&&(console.error(`${n} must be array !!!`),n=[]),h&&(t=[],h=!1),1===b.page)return n;if(o)return b.page+=1,t.concat(n);if(d){let e=(b.page-1)*b.pageSize,o=n.length;return t.splice(e,o,...n)}return d=!0,t.concat(n)}}}}class s{static platform=null;static loginObject={login:!1};constructor(e,n){s.platform=e,n&&(s.loginObject=n(s.loginObject)),this.loginProxyObject=t(s.loginObject)}setLoginToken({tokenKey:t,tokenData:n},o){this.loginProxyObject.login=!0,s.platform.setStorage({key:t,data:n,success:function(){e(o,"function")&&o()}})}unSetLoginToken(t,n="token"){this.loginProxyObject.login=!1,s.platform.removeStorage({key:n,success:function(){e(t,"function")&&t()}})}intercept({success:e=()=>{},fail:n=()=>{}}){const{createInterceptor:o}=function(e){const n=t(e);return{proxyObject:n,createInterceptor:function({onError:t,onSuccess:o}){return function(...r){const a=Object.keys(e)[0];n[a]?o(...r):t()}}}}(s.loginObject);return o({onSuccess:e,onError:n})}}export{n as default};
