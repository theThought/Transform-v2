!function(){function e(e,t,n,s){Object.defineProperty(e,t,{get:n,set:s,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},s={},o=t.parcelRequire94c2;null==o&&((o=function(e){if(e in n)return n[e].exports;if(e in s){var t=s[e];delete s[e];var o={id:e,exports:{}};return n[e]=o,t.call(o.exports,o,o.exports),o.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){s[e]=t},t.parcelRequire94c2=o);var r=o.register;r("bk5lr",function(t,n){e(t.exports,"register",function(){return s},function(e){return s=e}),e(t.exports,"resolve",function(){return o},function(e){return o=e});var s,o,r=new Map;s=function(e,t){for(var n=0;n<t.length-1;n+=2)r.set(t[n],{baseUrl:e,path:t[n+1]})},o=function(e){var t=r.get(e);if(null==t)throw Error("Could not resolve bundle with id "+e);return new URL(t.path,t.baseUrl).toString()}}),r("81dlR",function(t,n){e(t.exports,"getBundleURL",function(){return s},function(e){return s=e});var s,o={};s=function(e){var t=o[e];return t||(t=function(){try{throw Error()}catch(t){var e=(""+t.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(e)return(""+e[2]).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}(),o[e]=t),t}}),r("7SePl",function(e,t){e.exports=o("7ZW28")(o("bk5lr").resolve("2HY3m")).then(()=>o("fZQ7f"))}),r("7ZW28",function(e,t){var n=o("6drz0");e.exports=n(function(e){return new Promise(function(t,n){if([].concat(document.getElementsByTagName("script")).some(function(t){return t.src===e})){t();return}var s=document.createElement("link");s.href=e,s.rel="preload",s.as="script",document.head.appendChild(s);var o=document.createElement("script");o.async=!0,o.type="text/javascript",o.src=e,o.onerror=function(t){var s=TypeError("Failed to fetch dynamically imported module: ".concat(e,". Error: ").concat(t.message));o.onerror=o.onload=null,o.remove(),n(s)},o.onload=function(){o.onerror=o.onload=null,t()},document.getElementsByTagName("head")[0].appendChild(o)})})}),r("6drz0",function(e,t){var n={},s={},o={};e.exports=function(e,t){return function(r){var i=function(e){switch(e){case"preload":return s;case"prefetch":return o;default:return n}}(t);return i[r]?i[r]:i[r]=e.apply(null,arguments).catch(function(e){throw delete i[r],e})}}}),o("bk5lr").register(o("81dlR").getBundleURL("6R60F"),JSON.parse('["6R60F","index.e24b8f0e.js","2HY3m","polyfills.817977f3.js","bOLyU","index.2b38a90f.css"]'));class i extends HTMLElement{static #e=this.observedAttributes=["attribute"];constructor(){if(super(),this.button=this.querySelector("button"),this.count=0,!this.button)return;this.init(),this.button.addEventListener("click",this)}init(){this.button?.removeAttribute("hidden")}handleGlobalClick(e){let t=e.target;this.button?.contains(t)||console.log("Click target:",t,"Clicked outside component:",this)}attributeChangedCallback(e,t,n){console.log(`Attribute ${e} has changed from ${t} to ${n}.`)}handleEvent(e){let t=e.currentTarget;this.count++,t&&(t.innerHTML=`Clicked ${this.count} time(s)`)}connectedCallback(){document.addEventListener("click",e=>this.handleGlobalClick(e))}disconnectedCallback(){document.removeEventListener("click",this.handleGlobalClick)}}class l extends HTMLElement{constructor(){super(),console.log("constructor(): ",this)}}class c extends l{constructor(){super()}}class a extends l{constructor(){super()}}let u=(e,t)=>{let n=JSON.parse(e);if(t)for(let[e,s]of Object.entries(n))e===t&&(n=Object.assign({[e]:s},n.key));return n};class d extends HTMLElement{constructor(){super()}broadcastChange(e){console.log(e)}}class h extends d{constructor(){if(super(),this.qid=this.dataset.questionid,this.qgroup=this.dataset.questiongroup,this.element=document.querySelector(".a-input-singlelineedit"),this.question=this.closest("o-question-response"),!this.element)return;this.init(),this.element.addEventListener("click",this),this.element.addEventListener("change",this)}init(){console.log("MInputSinglelineedit: init...",this.qid,this.qgroup,this.element),this.broadcastChange("message from the child using Component class."),this.parseCustomProperties()}parseCustomProperties(){let e=this.question?.dataset.customprops;if((this.qid===this.question?.dataset.questionid||this.qgroup===this.question?.dataset.questiongroup||e)&&e){let t;e.includes("type")&&(t=u(e,"type"),this.setInputType(t)),e.includes("labels")&&(t=u(e,"labels"),this.setLabels(t))}}setInputType(e){let t=e.type;switch(t){case"date":t="date";break;case"number":t="number";break;default:t="text"}this.element&&(this.element.type=t)}setLabels(e){for(let[t,n]of Object.entries(e.labels)){if("pre"===t&&n){let e=document.createElement("span");e.classList.add("a-label-prelabel"),e.textContent=n,this.insertBefore(e,this.element)}if("post"===t&&n){let e=document.createElement("span");e.classList.add("a-label-postlabel"),e.textContent=n,this.appendChild(e)}}}handleEvent(e){switch(e.type){case"click":console.log("click");break;case"change":console.log("change")}}connectedCallback(){}disconnectedCallback(){}}let p=()=>{customElements.get("wc-example")||customElements.define("wc-example",i),customElements.get("o-question")||customElements.define("o-question",l),customElements.get("o-question-container")||customElements.define("o-question-container",c),customElements.get("o-question-response")||customElements.define("o-question-response",a),customElements.get("m-input-singlelineedit")||customElements.define("m-input-singlelineedit",h)};"function"==typeof document.createElement("dialog").showModal?p():o("7SePl").then(()=>p()).catch(e=>console.error(e))}();
//# sourceMappingURL=index.e24b8f0e.js.map
