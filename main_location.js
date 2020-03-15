import { Map, View,Feature } from "ol";
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
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';
import {getLength} from 'ol/sphere';
import Draw from 'ol/interaction/Draw';

var regexp = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|qiaoliang|suidao|zizhiquguodao'
)
var regexpLuxian = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|zizhiquguodao'
)
let intervalId = null
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

var tileLayer = new TileLayer({
  source: new XYZ({
    url:
      "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6"
  })
});
// "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6"
// http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
var tileLayer2 = new TileLayer({
  source: new XYZ({
    url:
      "http://webst04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}&ltype=4"
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
  window.long = null
  window.lat = null
  window.postMessage(JSON.stringify({type:'stopLocation'}));
});

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
});
addWms()
intervalId = setInterval(() => {
  if(window.long && window.lat){
    CenterMap(window.long ,window.lat)
  }
}, 2000);
function CenterMap(long, lat) {
  var view = map.getView();
  view.setCenter([long, lat]);
  iconGeometry.setCoordinates([long, lat]);
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