import { Map, View ,Feature} from "ol";
import("ol/Feature.js").default
import("ol/MapBrowserEvent").default
import("ol/coordinate.js").Coordinate|undefined
import Point from 'ol/geom/Point';
import {Icon, Style,Stroke} from 'ol/style';
import LineString from 'ol/geom/LineString';
import XYZ from "ol/source/XYZ";
import { Projection } from "ol/proj";
import { TileWMS, Vector as VectorSource, ImageWMS } from "ol/source";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
// import 'ol/ol.css';
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';
import {getLength} from 'ol/sphere';
import Draw from 'ol/interaction/Draw';

// import TileLayer from "ol/layer/Tile";
import Image from "ol/layer/Image";
import {
  equalTo as equalToFilter,
  like as likeFilter,
  and as andFilter
} from 'ol/format/filter';
import {WFS, GeoJSON} from 'ol/format';
var wfsVectorLayer
// http://127.0.0.1:8080/geoserver/cite/wms
var regexp = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|qiaoliang|suidao|zizhiquguodao'
)
var regexpLuxian = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|zizhiquguodao'
)
var tempVectorLayer = [] //需要清除的线
//加载geoserver发布的地图
function addWms() {
  wfsVectorLayer = new TileLayer({
    source: new TileWMS({
      url: "http://39.107.32.7/geoserver/cite/wms",
      params: {
        VERSION: "1.1.1",
        LAYERS:
          "cite:xjgd,cite:shengdao,cite:xiandao,cite:xiangdao,cite:zhuanyong,cite:cundao,cite:jianzhilian,cite:jianzhiying,cite:shi,cite:qiaoliang,cite:suidao,cite:tuanchang,cite:zizhiquguodao", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开

        tilesOrigin: 87.6168 + "," + 43.8256
      },
      serverType: "geoserver"
    })
  });
  map.addLayer(wfsVectorLayer);
}

var format = "image/png";
var shengdaoSelected = new Image({
  source: new ImageWMS({
    ratio: 1,
    url: "http://39.107.32.7/geoserver/cite/wms",
    params: {
      FORMAT: format,
      VERSION: "1.1.1",
      LAYERS: "cite:shengdao",
      exceptions: "application/vnd.ogc.se_inimage"
    }
  })
});
var tileLayer = new TileLayer({
  source: new XYZ({
    url:
      "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6"
  })
});
var projection = new Projection('EPSG:900913');
var displayProjection = new Projection('EPSG:4326');
var map = new Map({
  target: "map",
  projection: projection,
	displayProjection: displayProjection,
  layers: [shengdaoSelected, tileLayer],
  view: new View({
    center: [87.6168 , 43.8256],
    zoom: 5,
    projection: "EPSG:4326"
  })
});
// map.on("singleclick", function(evt) {
//   debugger
//   var view = map.getView();
//   var viewResolution = view.getResolution();
//   var source = shengdaoSelected.get("visible")
//     ? shengdaoSelected.getSource()
//     : tileLayer.getSource();
//   var url = source.getGetFeatureInfoUrl(
//     evt.coordinate,
//     viewResolution,
//     view.getProjection(),
//     { INFO_FORMAT: "text/html", FEATURE_COUNT: 50 }
//   );
//   debugger
  
//   if (url) {
//     fetch(url)
//       .then(function (response) { return response.text(); })
//       .then(function (response) {
//         var allFeatures = new WMSGetFeatureInfo().readFeatures(response);
//         console.log(allFeatures)
//       });
//   }
//   // console.log(evt,view);
//   // if (url) {
//   //   document.getElementById("nodelist").innerHTML =
//   //     '<iframe cross sandbox="allow-same-origin" src="' + url + '"></iframe>';
//   // }
// });
map.on("singleclick", function(evt) {
  var view = map.getView();
  var viewResolution = (view.getResolution());
      var url = wfsVectorLayer.getSource().getGetFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        view.getProjection(),
        { INFO_FORMAT: "application/json", FEATURE_COUNT: 10 }
      );
  if (url) {
    fetch(url)
      .then(function (response) {
         return response.text(); 
        })
      .then(function (response) {
        // console.log(response)
        var features = JSON.parse(response).features
        var arr = []
        features.forEach(item => {
          if(regexp.test(item.id)){
            arr.push({id:item.id,value:item.properties})
          }
        });
        if(arr.length > 0){
          drawSelectedLine(features)
          window.postMessage(JSON.stringify({type:'singleClick',data:arr}));
        }
      });
  }
})
addWms();
setTimeout(() => {
  if(window.type === 'luduan'){
    luxian()
  }else if(window.type === 'qiaoliang'){
    qiaoliang()
  }else if(window.type === 'suidao'){
    suidao()
  }else{
    if(!window.type){
      alert('type不能为空'+window.type)
    }
  }
}, 2000);
function suidao(){
  var vectorSource = new VectorSource();
  var vector = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2
      })
    })
  });
  
  map.addLayer(vector);
  // generate a GetFeature request
  var featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    featureNS: 'http://www.opengeospatial.net/cite',    //命名空間
    featurePrefix: 'cite',  
    featureTypes: ['cite:suidao'],
    // featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:jianzhilian','cite:jianzhiying','cite:qiaoliang','cite:suidao','cite:tuanchang','cite:zizhiquguodao'],
    outputFormat: 'application/json',
    filter: andFilter(likeFilter("DWDM",window.A0102),likeFilter("LXBM",window.K0101))
  });
  fetch('http://dt.jgy-tec.com/geoserver/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    var features = new GeoJSON().readFeatures(json);
    if(features.length === 0){
      alert('没有找到该要素')
      return
    }
    vectorSource.addFeatures(features);
    map.getView().fit(vectorSource.getExtent(),{size:map.getSize()/4, maxZoom:16});
  });
}
function qiaoliang(){
  var vectorSource = new VectorSource();
  var vector = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2
      })
    })
  });
  
  map.addLayer(vector);
  // generate a GetFeature request
  var featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    featureNS: 'http://www.opengeospatial.net/cite',    //命名空間
    featurePrefix: 'cite',  
    featureTypes: ['cite:qiaoliang'],
    outputFormat: 'application/json',
    filter: andFilter(likeFilter("WZZH",window.K6003),likeFilter("DWDM",window.A0102),likeFilter("LXBM",window.K0101))
  });
  fetch('http://dt.jgy-tec.com/geoserver/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    var features = new GeoJSON().readFeatures(json);
    if(features.length === 0){
      alert('没有找到该要素')
      return
    }
    vectorSource.addFeatures(features);
    map.getView().fit(vectorSource.getExtent());
  });
}
function luxian(){
  var vectorSource = new VectorSource();
  var vector = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2
      })
    })
  });
  
  map.addLayer(vector);
  // generate a GetFeature request
  var featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    featureNS: 'http://www.opengeospatial.net/cite',    //命名空間
    featurePrefix: 'cite',  
    featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:zizhiquguodao'],
    // featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:jianzhilian','cite:jianzhiying','cite:qiaoliang','cite:suidao','cite:tuanchang','cite:zizhiquguodao'],
    outputFormat: 'application/json',
    filter: andFilter(equalToFilter("QDZH",window.K0108),likeFilter("LXBM",window.K0101))
  });
  fetch('http://dt.jgy-tec.com/geoserver/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    var features = new GeoJSON().readFeatures(json);
    if(features.length === 0){
      alert('没有找到该要素')
      return
    }
    vectorSource.addFeatures(features);
    map.getView().fit(vectorSource.getExtent());
  });
}

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