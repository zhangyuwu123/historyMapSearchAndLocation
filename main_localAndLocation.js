import { Map, View,Feature } from "ol";
import {defaults as defaultControls, Control} from 'ol/control';
import {createStringXY} from 'ol/coordinate';
import MousePosition from "ol/control/MousePosition.js";
import("ol/Feature.js").default
import("ol/MapBrowserEvent").default
import("ol/coordinate.js").Coordinate|undefined
import {Stroke, Style,Fill} from 'ol/style';
import {LineString, Polygon} from 'ol/geom';
import Point from 'ol/geom/Point';
import XYZ from "ol/source/XYZ";
import { Projection,transform } from "ol/proj";
import { TileWMS, Vector as VectorSource, OSM } from "ol/source";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
// import 'ol/ol.css';
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';
import {getLength, getArea} from 'ol/sphere';
import Draw from 'ol/interaction/Draw';

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
var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mousePosition'),
  undefinedHTML: '&nbsp;'
});
var projection = new Projection('EPSG:900913');
var displayProjection = new Projection('EPSG:4326');
var map = new Map({
  controls: defaultControls().extend([mousePositionControl]),
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
addWms();
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
          features.forEach(item => {
            if(regexp.test(item.id)){
              arr.push({id:item.id,value:item.properties})
            }
          });
          if(arr.length > 0){
            drawSelectedLine(features)
          }
        });
    }
    }
  })
  waitGetFeaturesTimeoutId = setInterval(function(){
    if(fetchedCount >= layerCount){
      clearInterval(waitGetFeaturesTimeoutId)
      waitGetFeatures(arr)
    }
  },500)
  setTimeout(() => {
    if(waitGetFeaturesTimeoutId){
      clearInterval(waitGetFeaturesTimeoutId)
    }
  }, 3000);
}

function waitGetFeatures(arr){
  if(arr.length > 0){
    window.parent.postMessage(JSON.stringify({type:'singleClick',data:arr}),"*");
  }
}
var popup = new Overlay({
  element: document.getElementById('popup')
});
map.addOverlay(popup);
function handleCoordinate(evt){
  var element = popup.getElement();
  var coordinate = evt.coordinate;
    document.getElementById('popup').style.display='flex'

  document.getElementById('popupLat').innerHTML = '经度：'+coordinate[0].toFixed(6)
  document.getElementById('popupLong').innerHTML = '纬度：'+ coordinate[1].toFixed(6)
  element.classList.add('coorContainer')
  popup.setPosition(coordinate);
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
    luduan(data.K0101,data.K0108)
  }else if(data.type === 'luxian'){
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
  fetch('https://dt.jgy-tec.com/geoserver/wfs', {
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
  fetch('https://dt.jgy-tec.com/geoserver/wfs', {
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
    featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:zizhiquguodao','cite:zizhiqushengdao'],
    // featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:jianzhilian','cite:jianzhiying','cite:qiaoliang','cite:suidao','cite:tuanchang','cite:zizhiquguodao'],
    outputFormat: 'application/json',
    filter: likeFilter("LXBM",K0101)
  });
  fetch('https://dt.jgy-tec.com/geoserver/wfs', {
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

function luduan(K0101,K0108){
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
    featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:zizhiquguodao','cite:zizhiqushengdao'],
    // featureTypes: ['cite:xjgd','cite:shengdao','cite:xiandao','cite:xiangdao','cite:zhuanyong','cite:cundao','cite:jianzhilian','cite:jianzhiying','cite:qiaoliang','cite:suidao','cite:tuanchang','cite:zizhiquguodao'],
    outputFormat: 'application/json',
    filter: andFilter(equalToFilter("QDZH",K0108),likeFilter("LXBM",K0101))
  });
  fetch('https://dt.jgy-tec.com/geoserver/wfs', {
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

var continuePolygonMsg = '单击继续测量面积';
var helpMsg 
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
    if(typeSelect == 'area'){
      helpMsg = '单击鼠标左键开始测量面积';
    }else if(typeSelect == 'length'){
      helpMsg = '单击鼠标左键开始测量距离';
    }else{

    }
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
var chkLength = document.getElementById('chkLength');
var chkCoordinate = document.getElementById('chkCoordinate');
var chkArea = document.getElementById('chkArea');
var typeSelect //checkbox选中的值：长度、面积、坐标
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

var formatArea = function(polygon) {
  var area = getArea(polygon);
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
  }
  return output;
};


function addInteraction() {
  var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');

  draw = new Draw({
    source: source,
    type: type,
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
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
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
  if(typeSelect == 'area'){
    measureTooltip = ''
  }else if(typeSelect == 'length'){
    measureTooltip = ''
  }else{}
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
chkLength.onchange = function(e) {
  unListenerPointMove()
  map.removeInteraction(draw);
  if(e.target.checked){
    helpMsg = '单击鼠标左键开始测量距离';
    chkCoordinate.checked = false
    chkArea.checked = false
    typeSelect = 'length'
    listenerPointMove()
    addInteraction();
    map.un("singleclick", handleSingleClick);
    document.getElementById('popup').style.display='none'
    map.un("singleclick", handleCoordinate);
  }else{
    typeSelect = ''
    map.removeOverlay(measureTooltip);
    document.querySelector('.ol-overlay-container').style.display='none'
"none"
    // unListenerPointMove()
    // map.removeInteraction(draw);
    map.on("singleclick", handleSingleClick);
  }
};


chkCoordinate.onchange = function(e) {
  if(e.target.checked){
    typeSelect = 'coordinate'
    chkLength.checked = false
    chkArea.checked = false
    map.un("singleclick", handleSingleClick);
    map.on("singleclick", handleCoordinate);
    unListenerPointMove()
    map.removeInteraction(draw);
  }else{
    map.removeLayer(popup);
    typeSelect = ''
    document.getElementById('popup').style.display='none'
    map.un("singleclick", handleCoordinate);
    map.on("singleclick", handleSingleClick);
  }
};

chkArea.onchange = function(e) {
  unListenerPointMove()
  map.removeInteraction(draw);
  if(e.target.checked){
    helpMsg = '单击鼠标左键开始测量面积';
    typeSelect = 'area'
    chkCoordinate.checked = false
    chkLength.checked = false
    listenerPointMove()
    addInteraction();
    map.un("singleclick", handleSingleClick);
    document.getElementById('popup').style.display='none'
    map.un("singleclick", handleCoordinate);
  }else{
    typeSelect = ''
    map.removeOverlay(measureTooltip);
    document.querySelector('.ol-overlay-container').style.display='none'
"none"
    // map.removeInteraction(draw);
    map.on("singleclick", handleSingleClick);
  }
};
document.getElementById('clearLine').onclick= function(){
  source.clear();
  document.querySelectorAll('.ol-overlay-container').forEach(item => {
    item.style.display='none'
  })

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
