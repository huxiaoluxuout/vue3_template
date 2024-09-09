function e(e,t){return Object.prototype.toString.call(e).replace(/\[object (\w+)\]/,"$1").toLowerCase()===t}function t(e){if("object"!=typeof e||null===e)throw new TypeError("Target must be an object");return new Proxy(e,{get:(e,t,n)=>Reflect.get(e,t,n),set:(e,t,n,o)=>Reflect.set(e,t,n,o)})}function n(e=uni){return{ylxEventBus:new s(e),ylxMustLogIn:new c(e),ylxNextPage:new a(e)}}import{reactive as o}from"vue";const r=new class{constructor(){this.eventListeners=new Map}on(e,t){if("function"!=typeof t)throw new Error(`${t} 必须是一个函数`);this.eventListeners.has(e)||this.eventListeners.set(e,new Set),this.eventListeners.get(e).add(t)}once(e,t){if("function"!=typeof t)throw new Error(`${t} 必须是一个函数`);const n=(...o)=>{t(...o),this.off(e,n)};this.on(e,n)}emit(e,...t){let n,o,r;if("string"==typeof e)n=e;else{if("object"!=typeof e)throw new Error("Options 必须是字符串或对象");n=e.event,o=e.handler,r=e.source}const s=this.eventListeners.get(n);if(!s)return;const a={args:t,source:r};if(o){for(const e of s)if(e.name===o){e(a);break}}else s.forEach((e=>e(a)))}off(e,t){if(t){if("function"==typeof t){const n=this.eventListeners.get(e);n&&n.delete(t)}}else this.eventListeners.delete(e)}clear(){this.eventListeners.clear()}};class s{static platform=null;constructor(e){s.platform=e}static NAVIGATION_TYPES={NAVIGATE_TO:"navigateTo",SWITCH_TAB:"switchTab"};static eventBusSet=new Set;static defaultGlobalCallback=({args:e,source:t})=>console.log("AppEvent",{args:e,source:t});onGlobal(e=s.defaultGlobalCallback){r.on("AppEvent",e),r.on("GLOBAL_PAGES_EVENT",s.handlerListener)}static handlerListener({args:e,source:t}){console.log("handlerListener",e,t);let[{navigationType:n,targetPath:o,isNavigationEnabled:r,options:a,sourceName:c}]=e;const{path:i,query:l,delimiter:u}=s.parseUrl(o);s.sendTargetPage(i,t,a,c),s.handleNavigation(n,i,l,u,a,r)}static sendTargetPage(e,t,n,o){s.eventBusSet.has(e)?r.emit({event:e,source:o||t},n):r.once("CURRENT_PAGE_EVENT"+e,(()=>(s.eventBusSet.add(e),r.emit({event:e,source:o||t},n))))}static handleNavigation(e,t,n,o,r,a){if(!a)return;if(e!==s.NAVIGATION_TYPES.NAVIGATE_TO&&e!==s.NAVIGATION_TYPES.SWITCH_TAB)return void console.error(`导航路径：${JSON.stringify(s.NAVIGATION_TYPES)}`);const c=e===s.NAVIGATION_TYPES.NAVIGATE_TO?`${t}${n}${o}currentRoute=${t}`:t;s.platform[e]({url:c,fail:e=>console.error("Navigation Error:",e)})}async emit({targetPath:e,options:t={},source:n=""},o=!1,a=s.NAVIGATION_TYPES.NAVIGATE_TO){const c=await s.getRoute(),i="object"==typeof t?Object.assign({fromPage:c},t):t;r.emit({event:"GLOBAL_PAGES_EVENT",source:c,handler:"handlerListener"},{navigationType:a,targetPath:e,isNavigationEnabled:o,options:i,sourceName:n})}async emitGlobal(e={},t=""){const n=await s.getRoute(),o="object"==typeof e?Object.assign({fromPage:n},e):e;r.emit({event:"AppEvent",source:t||n},o)}static getRoute(){const e=getCurrentPages(),t="/"+e[e.length-1].route;return Promise.resolve(t)}on(e){"function"==typeof e&&s.getRoute().then((t=>{s.eventBusSet.has(t)||(s.eventBusSet.add(t),r.on(t,e),r.emit("CURRENT_PAGE_EVENT"+t))}))}static parseUrl(e){const t=e.startsWith("/")?e:"/"+e,[n,o]=t.split("?");return{path:n,query:o?"?"+o:"",delimiter:o?"&":"?"}}}class a{static platform=null;constructor(e){a.platform=e}useNextPage(n=1,o=10){function r(){T.page=i,T.pageSize=l}function s(e){f=!0,u=!1,r(),h(),"function"==typeof e&&e()}function c(){T.page>1&&!u&&h()}let i=n,l=o,u=!1,f=!1;const{setFun:g,addFun:p,invokeAllFn:h}=function(){let e=[],t=[];return{addFun:(e,...n)=>{t.some((t=>t.func===e&&t.args.length===n.length))||t.push({func:e,args:n})},setFun:(t,...n)=>{e=[{func:t,args:n}]},invokeAllFn:function(){const n=t.concat(e);for(;n.length>0;){const{func:e,args:t}=n.pop();e(...t)}}}}(),T=t({page:i,pageSize:l});r();let d=0;return{mixinReachBottomPullDownRefresh:{onLoad(){r()},onReachBottom(){c()},onPullDownRefresh(){s(),d=setTimeout((()=>{a.platform.stopPullDownRefresh()}),2500)}},reachBottomHandler:c,pageInfoProxy:T,setFun:g,addFun:p,invokeAllFn:h,reload:s,dataHandler:function({data:t=[],resData:n=[]},o=!1){return a.platform.stopPullDownRefresh(),clearTimeout(d),e(t,"array")?(e(n,"array")||(console.warn("没有数据要返回空数组！！！"),n=[]),f&&(t=[],o=!0,f=!1),o?(T.page+=1,t.concat(n)):1===T.page?n:u?t:(u=!0,t.concat(n))):n}}}}class c{static platform=null;static loginObject={login:!1};constructor(e){c.platform=e,o&&(c.loginObject=o(c.loginObject)),this.loginProxyObject=t(c.loginObject)}static onError(){c.platform.showModal({title:"登录后，获取完整功能",success:function(e){e.confirm?console.log("用户点击确定"):e.cancel&&console.log("用户点击取消")}})}setLoginToken({tokenKey:e,tokenData:t},n){this.loginProxyObject.login=!0,c.platform.setStorage({key:e,data:t,success:function(){"function"==typeof n&&n()}})}updateLogin(e){this.loginProxyObject.login=!0,"function"==typeof e&&e()}unSetLoginToken(e,t){this.loginProxyObject.login=!1,c.platform.removeStorage({key:e,success:function(){"function"==typeof t&&t()}})}interceptMastLogIn({onSuccess:e,onError:n=c.onError}){const{createInterceptor:o}=function(e){const n=t(e);return{proxyObject:n,createInterceptor:function({onError:t,onSuccess:o}){if("function"==typeof t){if("function"==typeof o)return function(...r){const s=Object.keys(e)[0];n[s]?o(...r):t()};console.error(`${o}: 必须是函数`)}else console.error(`${t}: 必须是函数`)}}}(c.loginObject);return o({onSuccess:e,onError:n})}}export{n as default};
