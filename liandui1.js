var colors = ["#035594", "#117aab", "#28a2b8", "#64c4c1", "#86cfbb"];
function getArea(id){
  ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly&maxFeatures=50&outputFormat=application%2Fjson&CQL_FILTER=%20O' + encodeURIComponent('身份证号') +'='+id, function(err, geoJSON) {
    if (!err) { 
      console.log(geoJSON.features[0].geometry.coordinates[0][0])
      // 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
      var path = [];
      geoJSON.features[0].geometry.coordinates[0][0].forEach(item => {
        path.push(new AMap.LngLat(item[0],item[1]))
      });
      // 创建折线实例
      var polygon = new AMap.Polygon({
          path: path,  
          fillColor: '#117aab', // 多边形填充颜色
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#035594', // 线条颜色
      });

      map.add(polygon);
    }
  })
}
function getAreaByObjectId(id,type){
  ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3A' + type +'&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH='+id.replace('X','') , function(err, geoJSON) {
    if (!err) { 
      closeInfoWindow()
      if(geoJSON.features.length <= 0){
          window.noUserinfoTips()
          return
      }
      var path = [];
      geoJSON.features[0].geometry.coordinates[0][0].forEach(item => {
        path.push([item[0],item[1]])
      });
      addObject3D(path)
      let centerLngLat = getAreaCenter(path)
      window.searchUserInfoByPoly(id, centerLngLat)
    }
  })
}
function getAreaBySFZH(id,data){
  ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly2&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH='+id.replace('X',''), function(err, geoJSON) {
    if (!err) { 
      closeInfoWindow()
      if(geoJSON.features.length <= 0){
          getArea2BySFZH(id,data)
          return
      }
      var path = [];
      geoJSON.features[0].geometry.coordinates[0][0].forEach(item => {
        path.push([item[0],item[1]])
      });
      addObject3D(path)
      let centerLngLat = getAreaCenter(path)
      window.formateInfoWindow(centerLngLat)
      map.setZoomAndCenter(18, path[0]);
    }
  })
}
window.getAreaBySFZH = getAreaBySFZH
function getArea2BySFZH(id,data){
  ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly1&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=%20SFZH='+id.replace('X',''), function(err, geoJSON) {
    if (!err) { 
      // removeObject3D()
      if(geoJSON.features.length <= 0){
          closeInfoWindow()
          window.noUserinfoTips()
          return
      }
      var path = [];
      geoJSON.features[0].geometry.coordinates[0][0].forEach(item => {
        path.push([item[0],item[1]])
      });
      addObject3D(path)
      let centerLngLat = getAreaCenter(path)
      window.formateInfoWindow(centerLngLat)
      map.setZoomAndCenter(18, path[0]);
    }
  })
}
var map;
var bboxParm = null;
var LabelsData = [];
var object3Dlayer;
var prism;
var title;
var content;
AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
  var layerCtrl1 = new BasicControl.LayerSwitcher({
      position: 'tr'
  });
  var zoomCtrl1 = new BasicControl.Zoom({
          theme: 'dark'
      }),
      zoomCtrl2 = new BasicControl.Zoom({
          position: 'br',
          showZoomNum: true
      });
  map = new AMap.Map('container', {
      viewMode: '3D', // 开启 3D 模式
      pitch: 55,
      jogEnable:true,
      animateEnable:true,
      rotation: 35,
      center: [79.2134, 40.0113],
      zoom: 14,
      layers: layerCtrl1.getEnabledLayers()
  });
  
  // map.setMapStyle('amap://styles/cd1d69b80d0cc6d4e88da6b9ede152e2');
  // amap://styles/75acc86942468c28d0f637c1b9e6348a
  // map.setMapStyle('amap://styles/75acc86942468c28d0f637c1b9e6348a');
  map.addControl(layerCtrl1);
  map.addControl(zoomCtrl2);
  map.on('zoomchange', function(e) {
      bboxParm = map.getBounds().toString().replace(';',',') 
  });
  map.on('moveend', function(e) {
      bboxParm = map.getBounds().toString().replace(';',',') 
  });
  // getPolygonJSON() 
  getPolygon1JSON()
  // getPolygon2JSON()
  // getPolylineJSON()
  // getPointJSON()
  object3Dlayer = new AMap.Object3DLayer();
  map.add(object3Dlayer);
  content = '';
  title = '详细信息';
  
});


function getPointJSON(){
    bboxParm = map.getBounds().toString().replace(';',',')
    // http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Apoly&bbox=2.66025648058059E7%2C4430791.94402121%2C2.6603965839738775E7%2C4431589.7613009475&width=768&height=437&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson
    ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoint&maxFeatures=500000&outputFormat=application%2Fjson', function(err, geoJSON) {
    if (!err) { 
        var layer = new AMap.LabelsLayer({
                    zooms: [6, 20],
                    zIndex: 1000,
                    // 开启标注避让，默认为开启，v1.4.15 新增属性
                    collision: true,
                    // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
                    animation: true,
                });
                map.add(layer);
                var markers = [];

        geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            // 还可以自定义getMarker和getPolyline
            getMarker: function(geojson, lnglats) {
              //   console.log(geojson,geojson.properties.Name,geojson.properties)
                    var curData = {
                            name: geojson.properties.Name,
                            position: geojson.geometry.coordinates,
                            zooms: [10, 20],
                            opacity: 1,
                            zIndex: 10,
                            icon: {
                            type: 'image',
                            image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
                            clipOrigin: [14, 92],
                            clipSize: [50, 68],
                            size: [25, 34],
                            anchor: 'bottom-center',
                            angel: 0,
                            retina: true
                        },
                            text: {
                                content: geojson.properties.Name,
                                direction: 'left',
                                offset: [0, -5],
                                style: {
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    fillColor: '#333',
                                    strokeColor: '#fff',
                                    strokeWidth: 2,
                                }
                            }
                        };
                    curData.extData = {
                        index: parseInt(geojson.properties.OBJECTID)
                    };
                  //   console.log(parseInt(geojson.properties.OBJECTID))
                    var labelMarker = new AMap.LabelMarker(curData);

                    markers.push(labelMarker);
            }
        });  
        layer.add(markers);
        console.log('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
})
}
function getPolylineJSON(){
    bboxParm = map.getBounds().toString().replace(';',',')
    // http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Apoly&bbox=2.66025648058059E7%2C4430791.94402121%2C2.6603965839738775E7%2C4431589.7613009475&width=768&height=437&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson
    ajax('http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Aline&width=768&height=462&srs=EPSG%3A4490&format=application%2Fjson%3Btype%3Dgeojson&bbox=' +bboxParm, function(err, geoJSON) {
    if (!err) {
        geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            // 还可以自定义getMarker和getPolyline
            getPolyline: function(geojson, lnglats) {
                return new AMap.Polyline({
                    path: lnglats,
                    lineJoin:'round',
                    strokeColor: 'red',   // 线颜色
                    strokeOpacity: 1,         // 线透明度
                    strokeWeight: 4,          // 线宽
                    strokeStyle: 'solid',     // 线样式
                    strokeDasharray: [10, 5], // 补充线样式
                });
            }
        }); 
        geojson.setMap(map);
        console.log('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
})
}
function getPolygonJSON(){
    bboxParm = map.getBounds().toString().replace(';',',')
    // http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Apoly&bbox=2.66025648058059E7%2C4430791.94402121%2C2.6603965839738775E7%2C4431589.7613009475&width=768&height=437&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson
    ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly&maxFeatures=50000&outputFormat=application%2Fjson', function(err, geoJSON) {
    if (!err) { 
        
        var geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            getPolygon: function(geojson, lnglats) {
                return new AMap.Polygon({
                    path: lnglats,
                    fillOpacity: 0.5,// 面积越大透明度越高
                    strokeColor: 'white',
                    fillColor: 'green'
                });
            }
        }); 
        geojson.setMap(map);
        geojson.on('click',function(t1){
            console.log(t1.target.Ce.extData._geoJsonProperties._parentProperities)
            getAreaByObjectId(t1.target.Ce.extData._geoJsonProperties._parentProperities.OBJECTID)
        })
        console.log('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
  })
}
function getPolygon1JSON(){
    bboxParm = map.getBounds().toString().replace(';',',')
    // http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Apoly&bbox=2.66025648058059E7%2C4430791.94402121%2C2.6603965839738775E7%2C4431589.7613009475&width=768&height=437&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson
    ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly1&maxFeatures=50000000&outputFormat=application%2Fjson', function(err, geoJSON) {
    if (!err) { 
      getPolygon2JSON()
        var geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            getPolygon: function(geojson, lnglats) {
                let polygon = new AMap.Polygon({
                    path: lnglats,
                    fillOpacity: 0.5,// 面积越大透明度越高
                    strokeColor: 'white',
                    fillColor: 'green'
                });
                if(geojson.properties._parentProperities.XM){
                  LabelsData.push({name:geojson.properties._parentProperities.XM,position:polygon.getBounds().getCenter()})
                }
                return polygon
            }
        }); 
        geojson.on('click',function(t1){
            console.log(t1.target.Ce.extData._geoJsonProperties._parentProperities)
            if(t1.target.Ce.extData._geoJsonProperties._parentProperities.SFZH){
                getAreaByObjectId(t1.target.Ce.extData._geoJsonProperties._parentProperities.SFZH,'poly1')
            }else{
              window.noUserinfoTips()
              closeInfoWindow()
            }
        })
        geojson.setMap(map);
      //   addLayerText()
        console.log('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
  })
}
function getPolygon2JSON(){
    bboxParm = map.getBounds().toString().replace(';',',')
    // http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Apoly&bbox=2.66025648058059E7%2C4430791.94402121%2C2.6603965839738775E7%2C4431589.7613009475&width=768&height=437&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson
    ajax('http://39.107.32.7:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Apoly2&maxFeatures=50000000&outputFormat=application%2Fjson', function(err, geoJSON) {
    if (!err) { 
        var geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            getPolygon: function(geojson, lnglats) {
                let polygon = new AMap.Polygon({
                    path: lnglats,
                    fillOpacity: 0.5,// 面积越大透明度越高
                    strokeColor: 'white',
                    fillColor: 'green'
                });
                if(geojson.properties._parentProperities.XM){
                  LabelsData.push({name:geojson.properties._parentProperities.XM,position:polygon.getBounds().getCenter()})
                }
                return polygon
            }
        }); 
        geojson.on('click',function(t1){
            console.log(t1.target.Ce.extData._geoJsonProperties._parentProperities)
            if(t1.target.Ce.extData._geoJsonProperties._parentProperities.SFZH){
              //   window.searchUserInfoByPoly(t1.target.Ce.extData._geoJsonProperties._parentProperities)
                getAreaByObjectId(t1.target.Ce.extData._geoJsonProperties._parentProperities.SFZH, 'poly2')
            }else{
              closeInfoWindow()
              window.noUserinfoTips()
            }
        })
        geojson.setMap(map);
      //   addLayerText()
        console.log('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
  })
}
function getAreaCenter(lnglats){
  let polygon = new AMap.Polygon({
      path: lnglats,
      fillOpacity: 0.5,// 面积越大透明度越高
      strokeColor: 'white',
      fillColor: 'green'
  });
  let center = polygon.getBounds().getCenter()
  polygon = null
  return center
}
function addInfoWindow(str, lnglat){
  content = '<div class="info-title">详细信息</div><div class="info-content">' +
  '<img src="https://webapi.amap.com/images/amap.jpg">' +
  str +
  '</div>'; 
  // infowindow1.setContent(str)
  window.infoWindow1 = new AMap.InfoWindow({
      isCustom: true,  //使用自定义窗体
      autoMove:true,
      content: createInfoWindow(title, str),
      // offset: new AMap.Pixel(16, -30)
  });
  window.infoWindow1.open(map, lnglat)
  // infowindow1.setPosition(lnglat)
}
window.addInfoWindow = addInfoWindow
function addObject3D(paths){
      var bounds = paths.map(function(path) {
          return new AMap.LngLat(path[0], path[1]);
      });
      prism = new AMap.Object3D.Prism({
          path: bounds,
          height: 30,
          color: 'rgba(100, 150, 230, 0.7)' // 支持 #RRGGBB、rgb()、rgba() 格式数据
      });
      prism.transparent = true;
      object3Dlayer.add(prism);
}
function removeObject3D(){
    if(prism){
        object3Dlayer.remove(prism);
         prism = null
    }
}
function addLayerText(LngLat){
  var layer = new AMap.LabelsLayer({
      zooms: [6, 20],
      zIndex: 1000,
      collision: true,
      animation: true,
  });
  map.add(layer);
  var markers = [];
  for (let i = 0; i < LabelsData.length; i++) {
      const item = LabelsData[i];
      var curData = {
              name: item.name,
              position: item.position,
              zooms: [10, 20],
              opacity: 1,
              zIndex: 10,
              icon: {
              type: 'image',
              image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
              clipOrigin: [14, 92],
              clipSize: [50, 68],
              size: [25, 34],
              anchor: 'bottom-center',
              angel: 0,
              retina: true
          },
              text: {
                  content: item.name,
                  direction: 'top',
                  offset: [0, -5],
                  style: {
                      fontSize: 15,
                      fontWeight: 'normal',
                      fillColor: '#333',
                      strokeColor: '#fff',
                      strokeWidth: 2,
                  }
              }
          };
      curData.extData = {
          index: i
      };
  //   console.log(parseInt(geojson.properties.OBJECTID))
      var labelMarker = new AMap.LabelMarker(curData);
      markers.push(labelMarker);
  }

  layer.add(markers);
}
//构建自定义信息窗体
function createInfoWindow(title, content) {
var info = document.createElement("div");
info.className = "custom-info input-card content-window-card";

//可以通过下面的方式修改自定义窗体的宽高
//info.style.width = "400px";
// 定义顶部标题
var top = document.createElement("div");
var titleD = document.createElement("div");
var closeX = document.createElement("img");
top.className = "info-top";
titleD.innerHTML = title;
closeX.src = "https://webapi.amap.com/images/close2.gif";
closeX.onclick = closeInfoWindow;

top.appendChild(titleD);
top.appendChild(closeX);
info.appendChild(top);

// 定义中部内容
var middle = document.createElement("div");
middle.className = "info-middle";
middle.style.backgroundColor = 'white';
middle.innerHTML = content;
info.appendChild(middle);

// 定义底部内容
var bottom = document.createElement("div");
bottom.className = "info-bottom";
bottom.style.position = 'relative';
bottom.style.top = '0px';
bottom.style.margin = '0 auto';
var sharp = document.createElement("img");
sharp.src = "https://webapi.amap.com/images/sharp.png";
bottom.appendChild(sharp);
info.appendChild(bottom);
return info;
}
function closeInfoWindow() {
  map.clearInfoWindow();
  removeObject3D()
}