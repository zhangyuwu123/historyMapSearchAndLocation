var map = new AMap.Map('container', {
    showLabel: true,
    center: [87.5396, 42.5246],
    zoom: 6
});
let bboxParm = null
var layerGuodao = null;
var layerShengdao = null;
var currentZoom = 0
var zizhiquguodaoTimeId = null
var zizhiqushengdaoTimeId = null
map.on('zoomchange', function(e) {
   bboxParm = map.getBounds().toString().replace(';',',')
   currentZoom = map.getZoom(); 
   zizhiquguodaoTimeId && clearTimeout(zizhiquguodaoTimeId)
   zizhiqushengdaoTimeId && clearTimeout(zizhiqushengdaoTimeId)
   zizhiquguodaoTimeId = setTimeout(() => {
        getJSONGuodao()
    }, 500);
    zizhiqushengdaoTimeId = setTimeout(() => {
        getJSONShengdao()
    }, 500);
});
map.on('movestart', function(e) {
    zizhiquguodaoTimeId && clearTimeout(zizhiquguodaoTimeId)
    zizhiqushengdaoTimeId && clearTimeout(zizhiqushengdaoTimeId)
});
map.on('moveend', function(e) {
    bboxParm = map.getBounds().toString().replace(';',',')
    if(currentZoom < 8) return
    zizhiquguodaoTimeId = setTimeout(() => {
        getJSONGuodao()
    }, 500);
    zizhiqushengdaoTimeId = setTimeout(() => {
        getJSONShengdao()
    }, 500);
    
});
AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
    var layerCtrl1 = new BasicControl.LayerSwitcher({
        position: 'tr'
    });
    var zoomCtrl2 = new BasicControl.Zoom({
            position: 'br',
            showZoomNum: true
        });
    map.addControl(layerCtrl1);
    map.addControl(zoomCtrl2);
})

bboxParm = map.getBounds().toString().replace(';',',')
getJSONGuodao()
getJSONShengdao()
function getJSONGuodao(){
    var curIndex = 0
    var makers = []
    var labelMakers = []
    var makerObj = {}
    ajax('http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Azizhiquguodao&width=768&height=491&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson&bbox=' +bboxParm, function(err, geoJSON) {
    if (!err) { 
        layerGuodao && map.remove(layerGuodao);
        layerGuodao = new AMap.GeoJSON({
            geoJSON: geoJSON,
            getPolyline: function(geojson, lnglats) {
                if(currentZoom >= 10 && geojson.properties.LXBM){
                        if(lnglats.length > 20){
                            curIndex = parseInt(lnglats.length/5)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 1]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 2]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 3]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 4]}
                            
                        } else if(lnglats.length < 20 && lnglats.length > 10){
                            curIndex = parseInt(lnglats.length/4)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 1]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 2]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 3]}
                        }else{
                            curIndex = parseInt(lnglats.length/2)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex]}
                        }
                        // labelMakers.push(makerObj)
                    }
                
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
        layerGuodao.setMap(map);

        if(currentZoom >= 10){
                // labelMakers.forEach( item =>{
                    for(var subItem in makerObj){
                        var position =  new AMap.LngLat(makerObj[subItem].position[0], makerObj[subItem].position[1])
                        var marker = new AMap.Marker({
                            position: position,
                            anchor:'center',
                            content: '' +
                                    '<div class="custom-content-makers">' +
                                        makerObj[subItem].lxbm  +
                                    '</div>',
                            offset: new AMap.Pixel(0,0)
                        });
                        makers.push(marker)
                        
                    }
                    layerGuodao.addOverlays(makers)
                // })
            }
        
        // log.success('GeoJSON 数据加载完成')
    } else {
        log.error('GeoJSON 服务请求失败')
     }
})
}
function getJSONShengdao(){
    var curIndex = 0
    var makers = []
    var labelMakers = []
    var makerObj = {}
    ajax('http://39.107.32.7:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite%3Azizhiqushengdao&width=768&height=462&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson&bbox=' +bboxParm, function(err, geoJSON) {
        if (!err) { 
            layerShengdao && map.remove(layerShengdao);
            layerShengdao = new AMap.GeoJSON({
                geoJSON: geoJSON,
                getPolyline: function(geojson, lnglats) {
                    // console.log(geojson.properties.LXBM,geojson.properties.LDBM,lnglats.length)
                    if(currentZoom >= 10 && geojson.properties.LXBM){
                        if(lnglats.length > 20){
                            curIndex = parseInt(lnglats.length/5)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 1]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 2]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 3]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 4]}
                            
                        } else if(lnglats.length < 20 && lnglats.length > 10){
                            curIndex = parseInt(lnglats.length/4)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 1]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 2]}
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex * 3]}
                        }else{
                            curIndex = parseInt(lnglats.length/2)
                            makerObj[geojson.properties.LXBM] = { lxbm:geojson.properties.LXBM,position: lnglats[curIndex]}
                        }
                        // labelMakers.push(makerObj)
                    }
                    return new AMap.Polyline({
                        path: lnglats,
                        lineJoin:'round',
                        strokeColor: '#0c9463',   // 线颜色
                        strokeOpacity: 0.6,         // 线透明度
                        strokeWeight: 4,          // 线宽
                        strokeStyle: 'solid',     // 线样式
                        strokeDasharray: [10, 5], // 补充线样式
                    });
                }
            }); 
            layerShengdao.setMap(map);
            if(currentZoom >= 10){
                // labelMakers.forEach( item =>{
                    for(var subItem in makerObj){
                        var position =  new AMap.LngLat(makerObj[subItem].position[0], makerObj[subItem].position[1])
                        var marker = new AMap.Marker({
                            position: position,
                            anchor:'center',
                            content: '' +
                                    '<div class="custom-content-makers">' +
                                        makerObj[subItem].lxbm  +
                                    '</div>',
                            offset: new AMap.Pixel(0,0)
                        });
                        makers.push(marker)
                        
                    }
                    layerShengdao.addOverlays(makers)
                // })
            }
           
            // log.success('GeoJSON 数据加载完成')
        } else {
            log.error('GeoJSON 服务请求失败')
        }
    })
}