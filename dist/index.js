!function(e){function t(t){for(var r,i,l=t[0],u=t[1],c=t[2],f=0,p=[];f<l.length;f++)i=l[f],a[i]&&p.push(a[i][0]),a[i]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);for(s&&s(t);p.length;)p.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,l=1;l<n.length;l++){var u=n[l];0!==a[u]&&(r=!1)}r&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={0:0},o=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],u=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var s=u;o.push([114,1]),n()}({114:function(e,t,n){"use strict";n.r(t),function(e){n(84);var r=n(50),a=n.n(r),o=n(82),i=n.n(o),l=n(83);console.log("fluro-vue 2.0.15");var u="fluro.user",c=localStorage,s={install:function(t,n){if(!n||!n.store)throw new Error("Please initialise fluro-vue with a Vuex store.");if(sessionStorage){var r=i.a.utils.guid();sessionStorage.setItem("window.id",r)}var o;if(c){var s=c.getItem(u);try{o=JSON.parse(s)}catch(e){c.removeItem(u)}}var f,p,d,m,v=n.store;v.registerModule("fluro",{namespaced:!0,state:{user:o,application:null,realmSelectFullScreen:!1},mutations:{updateField:l.updateField,user:function(e,t){e.user=t},application:function(e,t){e.application=t},realmSelectFullScreen:function(e,t){e.realmSelectFullScreen=t}},getters:{getField:l.getField,user:function(e,t){return e.user},application:function(e,t){return e.application},realmSelectFullScreen:function(e,t){return e.realmSelectFullScreen}}});var g=e.env.VUE_APP_FLURO_ENV;switch(g){case"local":f=e.env.VUE_APP_API_LOCAL,!0;break;case"staging":f=e.env.VUE_APP_API_STAGING,!0;break;default:f=e.env.VUE_APP_API_LIVE}var h,w=_.get(window,"applicationData"),b=_.get(w,"_application");if(b){switch(d=b.timezone,"production"==g&&(f=b.apipath||f),b.authenticationStyle){case"application":var y="http:";window&&window.location&&window.location.protocol&&(y=window.location.protocol),p=b.apikey,m=e.env.VUE_APP_REMOTE_URL||"".concat(y,"//").concat(b.domain);break;case"global":b.requireLogin&&(h=_.get(window,"applicationUser"))}setTimeout(function(){v.commit("fluro/application",b)})}else setTimeout(function(){v.commit("fluro/application",null)});var S=new i.a({apiURL:f,applicationToken:p,domain:m,withCredentials:h});d&&(S.date.defaultTimezone=d),S.access.setDefaultApplication(b),S.auth.addEventListener("change",E);var P=v.getters["fluro/user"];function E(e,t){v.commit("fluro/user",e),t||function(e){if(c)if(e)try{c.setItem(u,a()(e))}catch(e){}else c.removeItem(u)}(e),S.stats.refresh()}P?S.auth.set(P):h&&(console.log("-- Authenticated via cookie",h),S.auth.set(h)),window&&window.addEventListener("storage",function(e){if(e&&e.key!=u)return;if(c){var t=c.getItem(u);if(t)try{o=JSON.parse(t)}catch(t){o=null,c.removeItem(u),E(null,e)}finally{E(o,e)}else E(null,e)}}),t.filter("dateFromID",S.date.dateFromID),t.filter("formatDate",S.date.formatDate),t.filter("timeago",S.date.timeago),t.filter("readableEventDate",S.date.readableEventDate),t.filter("readableEventTime",S.date.readableEventTime),t.filter("filesize",S.asset.filesize),t.filter("comma",S.utils.comma),t.filter("definitionTitle",function(e,t,n){var r=S.types.readable(e,t);return r.length?r:n?S.types.readable(n,t):""}),S.resetCache=function(){console.log("RESET GLOBAL CACHE"),S.cache.reset(),S.dispatch("cache.reset")},t.prototype.$fluro=S}};t.default=s}.call(this,n(115))},82:function(e,t){e.exports=fluro},83:function(e,t){e.exports=vuex-map-fields}});