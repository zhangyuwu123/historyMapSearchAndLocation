import { Map, View, style, geom, layer, source,Feature } from "ol";
// import TileLayer from "ol/layer/Tile";
import {Icon, Style} from 'ol/style';
import Point from 'ol/geom/Point';
import Image from "ol/layer/Image";
import XYZ from "ol/source/XYZ";
import { transform, Projection } from "ol/proj";
import { TileWMS, Vector as VectorSource, ImageWMS } from "ol/source";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var regexp = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|qiaoliang|suidao|zizhiquguodao'
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