import { Map, View,Feature } from "ol";
import("ol/Feature.js").default
import("ol/MapBrowserEvent").default
import("ol/coordinate.js").Coordinate|undefined
import {Stroke, Style,Fill} from 'ol/style';
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

import {
  equalTo as equalToFilter,
  like as likeFilter,
  and as andFilter
} from 'ol/format/filter';
import {WFS, GeoJSON} from 'ol/format';

var regexp = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|qiaoliang|suidao|zizhiquguodao'
)
var regexpLuxian = new RegExp(
  'xjgd|shengdao|xiandao|xiangdao|zhuanyong|cundao|zizhiquguodao'
)
var tempVectorLayer = [] //需要清除的线
var wfsVectorLayer 
// 测距
var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource();

var vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    })
  })
});
// http://127.0.0.1:8080/geoserver/cite/wms
//加载geoserver发布的地图
function addWms() {
 wfsVectorLayer = new TileLayer({
    source: new TileWMS({
      url: "http://39.107.32.7/geoserver/cite/wms",
      params: {
        VERSION: "1.1.1",
        LAYERS:
          "cite:xjgd,cite:shengdao,cite:xiandao,cite:xiangdao,cite:zhuanyong,cite:cundao,cite:jianzhilian,cite:jianzhiying,cite:shi,cite:qiaoliang,cite:suidao,cite:tuanchang,cite:zizhiquguodao,cite:xiangzheng,cite:cunzhuang,cite:xianjixingzhengzhongxing", //可以是单个图层名称，也可以是图层组名称，或多个图层名称，中间用“，”隔开
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
var projection = new Projection('EPSG:900913');
var displayProjection = new Projection('EPSG:4326');
var map = new Map({
  target: "map",
  projection: projection,
	displayProjection: displayProjection,
  layers: [tileLayer, vector],
  view: new View({
    center: [87.6168 , 43.8256],
    zoom: 5,
    projection: "EPSG:4326"
  })
});
//查询选择的路线信息
map.on("singleclick", handleSingleClick);
addWms();
function handleSingleClick(evt) {
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
          window.parent.postMessage(JSON.stringify({type:'singleClick',data:arr}),"*");
        }
      });
  }
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
//回调函数
function receiveMessageFromIndex ( event ) {
  let data = JSON.parse(event.data)
  if(data.type === 'luduan'){
    luxian(data.K0101,data.K0108)
  }else if(data.type === 'qiaoliang'){
    qiaoliang(data.K0101,data.A0102,data.K6003)
  }else if(data.type === 'suidao'){
    suidao(data.K0101,data.A0102,data.K6324)
  }else{}
}

//监听message事件，构造物定位
window.addEventListener("message", receiveMessageFromIndex, false);
function suidao(K0101,A0102,K6324){
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
    filter: andFilter(likeFilter("DWDM",A0102),likeFilter("LXBM",K0101))
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
    map.getView().fit(vectorSource.getExtent(),{size:map.getSize()/10, maxZoom:12});
  });
}
function qiaoliang(K0101,A0102,K6003){
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
    filter: andFilter(likeFilter("WZZH",K6003),likeFilter("DWDM",A0102),likeFilter("LXBM",K0101))
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
    map.getView().fit(vectorSource.getExtent(),{size:map.getSize()/10, maxZoom:12});
  });
}
function luxian(K0101,K0108){
  console.log(K0101,K0108)
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
    filter: andFilter(equalToFilter("QDZH",K0108),likeFilter("LXBM",K0101))
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

// 测距
/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
var measureTooltip;
/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = '单击继续测量距离；单击两次结束测量。';
/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
var pointerMoveHandler
function listenerPointMove(){
    pointerMoveHandler = function(evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    var helpMsg = '单击鼠标左键开始测量距离';
  
    if (sketch) {
      var geom = sketch.getGeometry();
      if (geom instanceof LineString) {
        helpMsg = continueLineMsg;
      }
    }
  
    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);
  
    helpTooltipElement.classList.remove('hidden');
  };
  
  map.on('pointermove', pointerMoveHandler);
  
  map.getViewport().addEventListener('mouseout', function() {
    helpTooltipElement.classList.add('hidden');
  });
}
function unListenerPointMove(){
  map.un('pointermove', pointerMoveHandler);
}
var chkMeasure = document.getElementById('chkMeasure');

var draw; // global so we can remove it later


/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function(line) {
  var length = getLength(line,{projection:'EPSG:4326',radius:6378137});
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
  }
  return output;
};


function addInteraction() {
  draw = new Draw({
    source: source,
    type: 'LineString',
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      })
    })
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  var listener;
  draw.on('drawstart',
    function(evt) {
      // set sketch
      sketch = evt.feature;
      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;

      listener = sketch.getGeometry().on('change', function(evt) {
        var geom = evt.target;
        var output;
        if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

  draw.on('drawend',
    function() {
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
      unByKey(listener);
    });
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'ol-tooltip hidden';
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
}


/**
 * Let user change the geometry type.
 */
chkMeasure.onchange = function(e) {
  if(e.target.checked){
    listenerPointMove()
    addInteraction();
    map.un("singleclick", handleSingleClick);
  }else{
    map.removeOverlay(measureTooltip);
    unListenerPointMove()
    map.removeInteraction(draw);
    map.on("singleclick", handleSingleClick);
  }
  // addInteraction();
};

// addInteraction();