!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t){var o;function n(e,t){ajax("http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3A"+t+"&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH="+e.replace("X",""),function(t,o){if(!t){if(u(),o.features.length<=0)return void window.noUserinfoTips();var n=[];o.features[0].geometry.coordinates[0][0].forEach(e=>{n.push([e[0],e[1]])}),c(n);let t=p(n);window.searchUserInfoByPoly(e,t)}})}window.getAreaBySFZH=function(e,t){ajax("http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly2&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH="+e.replace("X",""),function(t,n){if(!t){if(u(),n.features.length<=0)return void function(e,t){ajax("http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly1&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH="+e.replace("X",""),function(e,t){if(!e){if(t.features.length<=0)return u(),void window.noUserinfoTips();var n=[];t.features[0].geometry.coordinates[0][0].forEach(e=>{n.push([e[0],e[1]])}),c(n);let e=p(n);window.formateInfoWindow(e),o.setZoomAndCenter(18,n[0])}})}(e);var r=[];n.features[0].geometry.coordinates[0][0].forEach(e=>{r.push([e[0],e[1]])}),c(r);let t=p(r);window.formateInfoWindow(t),o.setZoomAndCenter(18,r[0])}})};var r,i,a,s=[];function p(e){let t=new AMap.Polygon({path:e,fillOpacity:.5,strokeColor:"white",fillColor:"green"}),o=t.getBounds().getCenter();return t=null,o}function c(e){var t=e.map(function(e){return new AMap.LngLat(e[0],e[1])});(i=new AMap.Object3D.Prism({path:t,height:30,color:"rgba(100, 150, 230, 0.7)"})).transparent=!0,r.add(i)}function l(e,t){var o=document.createElement("div");o.className="custom-info input-card content-window-card";var n=document.createElement("div"),r=document.createElement("div"),i=document.createElement("img");n.className="info-top",r.innerHTML=e,i.src="https://webapi.amap.com/images/close2.gif",i.onclick=u,n.appendChild(r),n.appendChild(i),o.appendChild(n);var a=document.createElement("div");a.className="info-middle",a.style.backgroundColor="white",a.innerHTML=t,o.appendChild(a);var s=document.createElement("div");s.className="info-bottom",s.style.position="relative",s.style.top="0px",s.style.margin="0 auto";var p=document.createElement("img");return p.src="https://webapi.amap.com/images/sharp.png",s.appendChild(p),o.appendChild(s),o}function u(){o.clearInfoWindow(),i&&(r.remove(i),i=null)}AMapUI.loadUI(["control/BasicControl"],function(e){var t=new e.LayerSwitcher({position:"tr"}),i=(new e.Zoom({theme:"dark"}),new e.Zoom({position:"br",showZoomNum:!0}));(o=new AMap.Map("container",{viewMode:"3D",pitch:55,jogEnable:!0,animateEnable:!0,rotation:35,center:[79.2134,40.0113],zoom:14,layers:t.getEnabledLayers()})).addControl(t),o.addControl(i),o.on("zoomchange",function(e){o.getBounds().toString().replace(";",",")}),o.on("moveend",function(e){o.getBounds().toString().replace(";",",")}),o.getBounds().toString().replace(";",","),ajax("http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly1&maxFeatures=50000000&outputFormat=application%2Fjson",function(e,t){if(e)log.error("GeoJSON 服务请求失败");else{o.getBounds().toString().replace(";",","),ajax("http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly2&maxFeatures=50000000&outputFormat=application%2Fjson",function(e,t){if(e)log.error("GeoJSON 服务请求失败");else{var r=new AMap.GeoJSON({geoJSON:t,getPolygon:function(e,t){let o=new AMap.Polygon({path:t,fillOpacity:.5,strokeColor:"white",fillColor:"green"});return e.properties._parentProperities.XM&&s.push({name:e.properties._parentProperities.XM,position:o.getBounds().getCenter()}),o}});r.on("click",function(e){console.log(e.target.Ce.extData._geoJsonProperties._parentProperities),e.target.Ce.extData._geoJsonProperties._parentProperities.SFZH?n(e.target.Ce.extData._geoJsonProperties._parentProperities.SFZH,"poly2"):(u(),window.noUserinfoTips())}),r.setMap(o),console.log("GeoJSON 数据加载完成")}});var r=new AMap.GeoJSON({geoJSON:t,getPolygon:function(e,t){let o=new AMap.Polygon({path:t,fillOpacity:.5,strokeColor:"white",fillColor:"green"});return e.properties._parentProperities.XM&&s.push({name:e.properties._parentProperities.XM,position:o.getBounds().getCenter()}),o}});r.on("click",function(e){console.log(e.target.Ce.extData._geoJsonProperties._parentProperities),e.target.Ce.extData._geoJsonProperties._parentProperities.SFZH?n(e.target.Ce.extData._geoJsonProperties._parentProperities.SFZH,"poly1"):(window.noUserinfoTips(),u())}),r.setMap(o),console.log("GeoJSON 数据加载完成")}}),r=new AMap.Object3DLayer,o.add(r),"",a="详细信息"}),window.addInfoWindow=function(e,t){'<div class="info-title">详细信息</div><div class="info-content"><img src="https://webapi.amap.com/images/amap.jpg">'+e+"</div>",window.infoWindow1=new AMap.InfoWindow({isCustom:!0,autoMove:!0,content:l(a,e)}),window.infoWindow1.open(o,t)}}]);