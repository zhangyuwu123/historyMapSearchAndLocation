import { Map, View, style, geom, layer, source } from "ol";
// import TileLayer from "ol/layer/Tile";
import Image from "ol/layer/Image";
import XYZ from "ol/source/XYZ";
import { transform, Projection } from "ol/proj";
import { TileWMS, Vector, ImageWMS } from "ol/source";
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'

import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Stroke, Style} from 'ol/style';
import {
  equalTo as equalToFilter,
  like as likeFilter,
  and as andFilter
} from 'ol/format/filter';
import {WFS, GeoJSON} from 'ol/format';
// http://127.0.0.1:8080/geoserver/cite/wms
//加载geoserver发布的地图
function addWms() {
  var wfsVectorLayer = new TileLayer({
    source: new TileWMS({
      url: "http://localhost:8080/geoserver/cite/wms",
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
    url: "http://localhost:8080/geoserver/cite/wms",
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
map.on("singleclick", function(evt) {
  debugger
  var view = map.getView();
  var viewResolution = view.getResolution();
  var source = shengdaoSelected.get("visible")
    ? shengdaoSelected.getSource()
    : tileLayer.getSource();
  var url = source.getGetFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    view.getProjection(),
    { INFO_FORMAT: "text/html", FEATURE_COUNT: 50 }
  );
  debugger
  
  if (url) {
    fetch(url)
      .then(function (response) { return response.text(); })
      .then(function (response) {
        var allFeatures = new WMSGetFeatureInfo().readFeatures(response);
        console.log(allFeatures)
      });
  }
  // console.log(evt,view);
  // if (url) {
  //   document.getElementById("nodelist").innerHTML =
  //     '<iframe cross sandbox="allow-same-origin" src="' + url + '"></iframe>';
  // }
});
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
  fetch('http://localhost:8080/geoserver/wfs', {
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
    featureTypes: [,'cite:qiaoliang'],
    outputFormat: 'application/json',
    filter: andFilter(likeFilter("WZZH",window.K6003),likeFilter("DWDM",window.A0102),likeFilter("LXBM",window.K0101))
  });
  fetch('http://localhost:8080/geoserver/wfs', {
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
    filter: likeFilter("LXBM",window.K0101 || '')
  });
  fetch('http://localhost:8080/geoserver/wfs', {
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