import { Map, View,Feature } from "ol";
import {transform} from 'ol/proj';
import("ol/Feature.js").default
import("ol/MapBrowserEvent").default
import("ol/coordinate.js").Coordinate|undefined
import Point from 'ol/geom/Point';
import {Icon, Style,Stroke} from 'ol/style';
import LineString from 'ol/geom/LineString';
import XYZ from "ol/source/XYZ";
import { Projection } from "ol/proj";
import { TileWMS, Vector as VectorSource, OSM } from "ol/source";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
// import 'ol/ol.css';

import {
  equalTo as equalToFilter,
  like as likeFilter,
  and as andFilter
} from 'ol/format/filter';
import {WFS, GeoJSON} from 'ol/format';

var regexp = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|qiaoliang|suidao|zizhiquguodao|zizhiqushengdao'
)
var regexpLuxian = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|zizhiquguodao|zizhiqushengdao'
)
var dwdm = getURLParameters()
var layerFilter = `DWDM like '%${dwdm}%'`
console.log('dwdm',layerFilter)
var tempVectorLayer = [] //需要清除的线
var wfsVectorLayer 
var wfsshengdao 
var wfscundao 
var wfsjianzhilian 
var wfsjianzhiying 
var wfsqiaoliang 
var wfsshi 
var wfssuidao 
var wfstuanchang 
var wfsxiandao 
var wfsxiangdao
var wfszizhiquguodao
var wfszizhiqushengdao
var wfszhuanyong
let intervalId = null
let timeId = null
var wfsVectorLayer
var iconGeometry = new Point([87.6168 , 43.8256]);
var iconFeature = new Feature({
  geometry: iconGeometry,
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});
var iconStyle = new Style({
  image: new Icon(({
      anchor: [0.5, 46],
      scale:0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 1,
      src: 'images/location.png'
  }))
});

iconFeature.setStyle(iconStyle);
var tempVectorLayer = [] //需要清除的线
var vectorSource = new VectorSource({
  features: [iconFeature]
});

var vectorLayer = new VectorLayer({
  source: vectorSource
});
vectorLayer.setZIndex(100000)//显示在所有层级的最上面
function addWms() {
  wfsVectorLayer = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:xjgd", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsshengdao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:shengdao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsxiandao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:xiandao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsxiangdao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:xiangdao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfszhuanyong = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:zhuanyong", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfscundao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:cundao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsjianzhilian = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:jianzhilian", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsjianzhiying = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:jianzhiying", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsshi = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:shi", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfsqiaoliang = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:qiaoliang", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfssuidao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:suidao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfstuanchang = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:tuanchang", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256,
         CQL_FILTER: layerFilter
       },
       serverType: "geoserver"
     })
   });
   wfszizhiquguodao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:zizhiquguodao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256
       },
       serverType: "geoserver"
     })
   });
   wfszizhiqushengdao = new TileLayer({
     source: new TileWMS({
       url: "https://dt.jgy-tec.com/geoserver/cite/wms",
       params: {
         VERSION: "1.1.1",
         LAYERS:
           "cite:zizhiqushengdao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
         tilesOrigin: 87.6168 + "," + 43.8256
       },
       serverType: "geoserver"
     })
   });
   // wfsVectorLayer10 = new TileLayer({
   //   source: new TileWMS({
   //     url: "https://dt.jgy-tec.com/geoserver/cite/wms",
   //     params: {
   //       VERSION: "1.1.1",
   //       LAYERS:
   //         "cite:xjgd,cite:shengdao,cite:xiandao,cite:xiangdao,cite:zhuanyong,cite:cundao,cite:jianzhilian,cite:jianzhiying,cite:shi,cite:qiaoliang,cite:suidao,cite:tuanchang,cite:zizhiquguodao,cite:xiangzheng,cite:cunzhuang", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
   //       tilesOrigin: 87.6168 + "," + 43.8256
   //     },
   //     serverType: "geoserver"
   //   })
   // });
   map.addLayer(wfsVectorLayer);
   map.addLayer(wfsshengdao);
   map.addLayer(wfsshi);
   map.addLayer(wfssuidao);
   map.addLayer(wfstuanchang);
   map.addLayer(wfsxiandao);
   map.addLayer(wfsxiangdao);
   map.addLayer(wfszhuanyong);
   map.addLayer(wfszizhiquguodao);
   map.addLayer(wfszizhiqushengdao);
   map.addLayer(wfsjianzhilian);
   map.addLayer(wfsjianzhiying);
   map.addLayer(wfscundao);
   map.addLayer(wfsqiaoliang);
   bindlayerclick()
 }
 function bindlayerclick(){
   document.getElementById('chkguodao').onchange = function(e) {
     e.target.checked ? wfsVectorLayer.setVisible(true) : wfsVectorLayer.setVisible(false)
   };
   document.getElementById('chkshengdao').onchange = function(e) {
     e.target.checked ? wfsshengdao.setVisible(true) : wfsshengdao.setVisible(false)
   };
   document.getElementById('chkxiandao').onchange = function(e) {
     e.target.checked ? wfsxiandao.setVisible(true) : wfsxiandao.setVisible(false)
   };
   document.getElementById('chkcundao').onchange = function(e) {
     e.target.checked ? wfscundao.setVisible(true) : wfscundao.setVisible(false)
   };
   document.getElementById('chkxiangdao').onchange = function(e) {
     e.target.checked ? wfsxiangdao.setVisible(true) : wfsxiangdao.setVisible(false)
   };
   document.getElementById('chkzizhiquguodao').onchange = function(e) {
     e.target.checked ? wfszizhiquguodao.setVisible(true) : wfszizhiquguodao.setVisible(false)
   };
   document.getElementById('chkzizhiqushengdao').onchange = function(e) {
     e.target.checked ? wfszizhiqushengdao.setVisible(true) : wfszizhiqushengdao.setVisible(false)
   };
   document.getElementById('chkzhuanyonggonglu').onchange = function(e) {
     e.target.checked ? wfszhuanyong.setVisible(true) : wfszhuanyong.setVisible(false)
   };
   document.getElementById('chkjianzhilian').onchange = function(e) {
     e.target.checked ? wfsjianzhilian.setVisible(true) : wfsjianzhilian.setVisible(false)
   };
   document.getElementById('chkjianzhiying').onchange = function(e) {
     e.target.checked ? wfsjianzhiying.setVisible(true) : wfsjianzhiying.setVisible(false)
   };
   document.getElementById('chkshi').onchange = function(e) {
     e.target.checked ? wfsshi.setVisible(true) : wfsshi.setVisible(false)
   };
   document.getElementById('chktuanchang').onchange = function(e) {
     e.target.checked ? wfstuanchang.setVisible(true) : wfstuanchang.setVisible(false)
   };
   document.getElementById('chkqiaoliang').onchange = function(e) {
     e.target.checked ? wfsqiaoliang.setVisible(true) : wfsqiaoliang.setVisible(false)
   };
   document.getElementById('chksuidao').onchange = function(e) {
     e.target.checked ? wfssuidao.setVisible(true) : wfssuidao.setVisible(false)
   };
 }
 var tileLayer = new TileLayer({
  source: new XYZ({
    url:
      "http://mt1.google.cn/vt/lyrs=y@258000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Ga"
  })
});
var projection = new Projection('EPSG:900913');
var displayProjection = new Projection('EPSG:4326');
var map = new Map({
  target: "map",
  projection: projection,
	displayProjection: displayProjection,
  layers: [vectorLayer, tileLayer],
  view: new View({
    center: [87.6168 , 43.8256],
    zoom: 14,
    projection: "EPSG:4326"
  })
});

map.on('pointerdrag', function (evt) {
  // 经纬度坐标
  clearInt()
  if(timeId){
    clearTimeout(timeId)
  }
  timeId = setTimeout(() =>{
    startInterval()
  },3000)
  // window.postMessage(JSON.stringify({type:'stopLocation'}));
});
var waitGetFeaturesTimeoutId
map.on("singleclick", handleSingleClick);
function handleSingleClick(evt) {
  if(waitGetFeaturesTimeoutId) {
    clearInterval(waitGetFeaturesTimeoutId)
  }
  var view = map.getView();
  var viewResolution = (view.getResolution());
  var url = null
  var arr = []
  var layerCount = 0 ;
  var fetchedCount = 0
  var waitGetFeaturesTimeoutId
  map.getLayers().forEach(function (lyr) {
    if (lyr.getSource()["getGetFeatureInfoUrl"] !== undefined) {
      layerCount ++
    }
  });
  map.getLayers().forEach(function (lyr) {
    if (lyr.getSource()["getGetFeatureInfoUrl"] !== undefined) {
       url = lyr.getSource().getGetFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        view.getProjection(),
        { 
          INFO_FORMAT: "application/json",
          FEATURE_COUNT: 10
         }
      );
    if (url) {
      fetch(url)
        .then(function (response) {
          return response.text(); 
          })
        .then(function (response) {
          // console.log(response)
          fetchedCount ++
          var features = JSON.parse(response).features
          var arr = []
          features.forEach(item => {
            if(regexp.test(item.id)){
              console.log(item.geometry.coordinates,evt.coordinate)
              let curDist
              let minObj = getMinDist(item.geometry.coordinates[0],evt.coordinate)
              console.log(minObj)
              if(item.properties.QDZH > item.properties.ZDZH){
                curDist = computerCurDist(item.geometry.coordinates[0],minObj.minIndex)
              }else{
                curDist = computerCurDist2(item.geometry.coordinates[0],minObj.minIndex)
              }
              
              arr.push({id:item.id,value:item.properties,curDist:curDist})
            }
          });
          console.log(arr)
          if(arr.length > 0){
            drawSelectedLine(features)
            window.postMessage(JSON.stringify({type:'singleClick',data:arr}));
          }
        });
    }
    }
  })
  waitGetFeaturesTimeoutId = setInterval(function(){
    if(fetchedCount >= layerCount){
      clearInterval(waitGetFeaturesTimeoutId)
    }
  },500)
  setTimeout(() => {
    if(waitGetFeaturesTimeoutId){
      clearInterval(waitGetFeaturesTimeoutId)
    }
  }, 3000);
}
addWms()
startInterval()//开始定位
function startInterval(){
  intervalId = setInterval(() => {
    if(window.long && window.lat){
      CenterMap(window.long ,window.lat)
    }
  }, 2000);
}
function clearInt(){
  if(intervalId){
    clearInterval(intervalId);
  }
}
function CenterMap(long, lat) {
  var view = map.getView();
  view.setCenter([long, lat]);
  iconGeometry.setCoordinates([long, lat]);
}
function getMinDist(arr,coordinate){
  let curDist = 0
  let minDist = 10000
  let minIndex = 0
  for(let i = 0;i<arr.length;i++){
    curDist = distance(arr[i][1],arr[i][0],coordinate[1],coordinate[0],"K")
    if(curDist < minDist){
      minDist = curDist
      minIndex = i
    }
  }
  return {minDist:minDist,minIndex:minIndex}
}
function computerCurDist(arr,minIndex){
  let curDist = 0
  for(let i = 0;i<arr.length;i++){
    if(i<=minIndex && i+1 < arr.length){
      curDist += distance(arr[i][1],arr[i][0],arr[i+1][1],arr[i+1][0],"K")
    }
  }
  return curDist
}
function computerCurDist2(arr,minIndex){
  let curDist = 0
  for(let i = arr.length-1;i >= 0;i--){
    if(i>=minIndex && i-1 >= 0){
      curDist += distance(arr[i][1],arr[i][0],arr[i-1][1],arr[i-1][0],"K")
    }
  }
  return curDist
}
function distance(lat1, lon1, lat2, lon2, unit){
  try {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  } catch (error) {
    alert(JSON.stringify(error))
    return 0
  }
};
//绘制选中的路线
function drawSelectedLine(features){
  if(features.length > 0){
    //清除之前绘制的线
    tempVectorLayer.forEach(item =>{
      map.removeLayer(item)
    })
    features.forEach(item =>{
      if(!regexpLuxian.test(item.id)){
        return
      }
      let vectorSource = new VectorSource();
      let LineStringFeature = new Feature(
      new LineString(item.geometry.coordinates[0])); //绘制多边形的数据
      let vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
              width: 3, 
              color: 'rgba(255, 255, 255, 1)',
              lineDash: [.1, 5] //or other combinations
          }),
          zIndex: 2
      })
      });
      vectorSource.addFeature(LineStringFeature);
      tempVectorLayer.push(vectorLayer)
      map.addLayer(vectorLayer);
    })
  }
}

function getURLParameters(){
  var reg = /a{3}?/g
  var str =location.href
  var vars ={}
  str.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,p1,p2,offset,m){
      vars[p1] = p2
  })
  if(vars['dwdm']){
    return vars['dwdm']
  }else{
    return '66'
  }
}