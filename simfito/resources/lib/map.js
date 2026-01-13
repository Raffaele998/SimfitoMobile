var map /*Mappa generale*/,map1/*Mappa per le trappole*/,map2/*Mappa per i report degli amministratori*/,map3/*map tutte le trappole*/,map4,extent;
var trappoleLayer_All;
var sitiLayer,osservazioniLayer,trappoleLayer,sitiLayer1,markerLayer, markerLayer1;
var source= new ol.source.Vector({features:new ol.Collection()});
var sourceForDraw=new ol.source.Vector({features:new ol.Collection()});
var wgs84Sphere= new ol.Sphere(6378137);
var DEM,Comuni;
var maxZoom=19;
var draw, draw2, draw2M; // global so we can remove it later
var features = new ol.Collection();
var features1= new ol.Collection();
var features2= new ol.Collection();
var features2M= new ol.Collection();
var source1=new ol.source.Vector({features:new ol.Collection()});
var mainBbox;
var bufferLayer;
var count=1;
var map0Info=false;
var map2Info=false;
var sketch=null;
var featureOverlay2=null, featureOverlay2M=null;

function mousePositionFormat(coord)
{
    var template='X:{x}, Y:{y} (WGS84 - WEB MERCATOR)';
    return ol.coordinate.format(coord,template,0);
}

function mapInit(mapNumber)
{
    /*for(var i=0; i<userprj.length;i++){
        proj4.defs(userprj[i].srs,userprj[i].def);
        console.info(userprj[i].srs+' added');
    }*/
    console.info('init map: '+mapNumber);
    /*var prjStore=Ext.StoreMgr.get('userPrjStore');
    prjStore.load();*/
    
    mapNumber=(mapNumber===undefined)?0:mapNumber;
    var config={
        "bbextent":{
            "left":1542502.7001861606,
            "bottom":4892629.7413647305,
            "right":1692986.4273636823,
            "top":5070443.308257283
        }
    };

    var bbox=config.bbextent;
    mainBbox=[bbox.left, bbox.bottom, bbox.right, bbox.top];
    extent = ol.proj.transform(mainBbox, 'EPSG:900913', 'EPSG:3857');

    scaleLineControl = new ol.control.ScaleLine();

    var mousePositionControl= new ol.control.MousePosition({
        className: 'mouse_position',
        coordinateFormat: mousePositionFormat,//ol.coordinate.createStringXY(0),
        projection: 'EPSG:32633',
        undefinedHTML: '&nbsp;'
    });

    //DEM
    var demSource= new ol.source.TileWMS({
        url: wmsUrl,
        params: {'LAYERS': 'simfito:demcampania'},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    DEM= new ol.layer.Tile({
        source: demSource
    });
    //end DEM

    // Comuni
    var comuniSource= new ol.source.TileWMS({
        url: wmsUrl,
        params: {'LAYERS': 'simfito:ComuniCampani'},
        title: 'Comuni',
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    Comuni= new ol.layer.Tile({
        source: comuniSource
    });
    // end Comuni

    // catasto
    var catastoSource= new ol.source.TileWMS({
        url: wmsUrl,
        params: {'LAYERS': 'simfito:catasto'},
        title: 'Catasali',
        serverType: 'geoserver'/*,
        crossOrigin: 'anonymous'*/
    });

    Catasto= new ol.layer.Tile({
        source: catastoSource
    });
    // end catasto
    
    //layer agenzia entrate
    
    var aeCodiceSource=new ol.source.TileWMS({
        url: "https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php",
        params: {'LAYERS': 'codice_plla'},
        title: 'Agenzia Delle Entrate codice',
        projection: new ol.proj.Projection({code:"EPSG:25832", units:'m',axisOrientation:'enu'}),
        serverType: 'geoserver'/*,
        crossOrigin: 'anonymous'*/
    });
    
    aeCod = new ol.layer.Tile({
        source: aeCodiceSource,
        visible: false
    });
    
    var aeFabSource= new ol.source.TileWMS({
        url: "https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php",
        params: {'LAYERS': 'fabbricati'},
        title: 'Agenzia Delle Entrate Fabbricati',
        projection: new ol.proj.Projection({code:"EPSG:25832", units:'m',axisOrientation:'enu'}),
        serverType: 'geoserver'/*,
        crossOrigin: 'anonymous'*/
    });

    aeFab= new ol.layer.Tile({
        source: aeFabSource,
        visible: false
    });
    
    var aeCatSource= new ol.source.TileWMS({
        url: "https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php",
        params: {'LAYERS': 'CP.CadastralParcel'},
        title: 'Agenzia Delle Entrate Fabbricati',
        projection: new ol.proj.Projection({code:"EPSG:25832"}),
        serverType: 'geoserver'/*,
        crossOrigin: null*/
    });

    aeCat= new ol.layer.Tile({
        source: aeCatSource,
        visible: false
    });
    
    //end layer agenzia entrate


    //view
    var view = new ol.View({
        projection: 'EPSG:3857',
        zoom: 15,
        minZoom: 0,
        maxZoom: maxZoom
    });
    var view1 = new ol.View({
        projection: 'EPSG:3857',
        zoom: 15,
        minZoom: 0,
        maxZoom: maxZoom
    });
    var view3 = new ol.View({
        projection: 'EPSG:3857',
        zoom: 15,
        minZoom: 0,
        maxZoom: maxZoom
    });
    //end view

    var modify = new ol.interaction.Modify({
        features: features,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });

    modify.on('modifyend',function(e){
        if(Ext.getCmp('sito')!==undefined){
            var type= e.features.getArray()[0].getGeometry().getType();
            var point, area;
            switch(type){
                case "Polygon":
                    point= e.features.getArray()[0].getGeometry().getFlatInteriorPoint();
                    area=Number(e.features.getArray()[0].getGeometry().getArea().toFixed(0));
                    break;
                case "Point":
                    point= e.features.getArray()[0].getGeometry().getCoordinates();
                    area=null;
                    break;

            }

            var comuniRequest=getFeatureInfo(Comuni,point);
            var provincia=comuniRequest.features[0].properties.provincia;
            var comune=comuniRequest.features[0].properties.istat;
            var demRequest=getFeatureInfo(DEM,point);
            var quota=demRequest.features[0].properties.GRAY_INDEX;

            Ext.getCmp('sitiprovincia').setValue(provincia);
            /* Ext.getCmp('siticomune').setDisabled(false);
            Ext.getCmp('siticomune').getStore().load();*/
            Ext.getCmp('siticomune').setValue(comune);
            Ext.getCmp('quota').setValue(quota);
            Ext.getCmp('superficie').setValue(area);
        }
    });

    var modify1 = new ol.interaction.Modify({
        features: features1,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });

    modify1.on('modifyend',function(e){
    });
    
    var modify2 = new ol.interaction.Modify({
        features: features2,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });

    modify2.on('modifyend',function(e){
    });

    //add bing
    /*
    layer=new ol.layer.Tile({
        visible: true,
        preload: Infinity,
        baseLayer:true,
        source: new ol.source.BingMaps({
            key: "AkakbAJ8Rv9M5qxPXcTjraIU3gWVCMTBIbu7G1KyAQYrCqgEwjlVIHIBvlEYbBez",
            imagerySet: 'AerialWithLabels'
        })
    });
    */

    //add maptiler
    layer=new ol.layer.Tile({
        visible: true,
        //preload: Infinity,
        baseLayer:true,
        source:  new ol.source.TileJSON({
            url: "https://api.maptiler.com/maps/0197f439-2f22-727f-9834-81faf9e485fd/tiles.json?key=dQzikmvStbfnnvQsX6WC", // source URL
            tileSize: 512,
            crossOrigin: 'anonymous'
        }),
    });

    //marker layer
    var vectorSource=new ol.source.Vector({
        features: []
    });

    markerLayer= new ol.layer.Vector({
        source: vectorSource
    });

    markerLayer1= new ol.layer.Vector({
        source: vectorSource
    });

    switch(mapNumber){
        case 0:
        default:
            //map
            map = new ol.Map({
                target: 'myMap',
                renderer: 'canvas',
                view: view,
                layers: [],
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: true
                    })
                }).extend([
                    scaleLineControl, mousePositionControl
                ])
            });
            // end map

            map.addInteraction(modify);
            //end add feature
            
            //aeCat.getSource().setProperties('projection','EPSG:25832');
            
            //spostati dopo il caricamento delle proiezioni in application on load
            /*map.addLayer(layer);
            /*map.addLayer(aeCat);
            map.addLayer(aeFab);
            map.addLayer(Catasto);
            map.addLayer(markerLayer);*/
            //end add bing


            //first zoom on map extent;
            map.on('postrender',function(event){
                if(event.map.renderer_.renderedVisible_){
                    if(firstTime){
                        map.getView().fit(extent,map.getSize());
                        firstTime=false;
                    }
                }

            });
            //add feature to draw "siti"
            var featureOverlay = new ol.layer.Vector({
                source: new ol.source.Vector({features: features}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            featureOverlay.setMap(map);
            
            map.on('singleclick', function(evt) {
                if(map0Info){
                    var viewResolution = /** @type {number} */ (map.getView().getResolution());
                    /*var url = wmsSource.getGetFeatureInfoUrl(
                        evt.coordinate, viewResolution, 'EPSG:3857',
                        {'INFO_FORMAT': 'text/html'});
                    if (url) {
                        console.log(url);
                    }*/
                    var layers=sitiLayer;/*evt.target.getLayers().getArray();
                   
                    var urls=[];
                    for (var idx in layers){
                        if(layers[idx].getVisible()){
                            if(layers[idx].getSource().getUrls()!=null){
                                urls.push(layers[idx].getSource().getGetFeatureInfoUrl(
                                    evt.coordinate, viewResolution, 'EPSG:3857',{'INFO_FORMAT': 'text/html'}));
                            }
                        }
                    }
                    for (var i in urls){
                        
                    }*/
                    var urls=[];
                    if(sitiLayer!=undefined){
                        if(layers.getSource().getUrls()!=null){
                            urls.push(layers.getSource().getGetFeatureInfoUrl(
                                evt.coordinate, viewResolution, 'EPSG:3857',{'INFO_FORMAT': 'text/html'}));
                        }
                        Ext.create('SIMFito.view.GetFeaturesInfoWindow').init(urls);
                    }
                }
            });


            break;
        case 1:
            map1 = new ol.Map({
                target: 'myMap1',
                renderer: 'canvas',
                view: view1,
                layers: [],
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: true
                    })
                }).extend([
                    scaleLineControl, mousePositionControl
                ])
            });
            // end map

            map1.addInteraction(modify1);
            //end add feature

            map1.addLayer(layer);
            map1.addLayer(aeCat);
            map1.addLayer(aeFab);
            map1.addLayer(aeCod);
            map1.addLayer(Catasto);
            map1.addLayer(markerLayer1);
            //end add bing


            //first zoom on map extent;
            map1.on('postrender',function(){
                if(firstTime1){
                    map1.getView().fit(extent,map1.getSize());
                    firstTime1=false;
                }

            });

            var featureOverlay1 = new ol.layer.Vector({
                source: new ol.source.Vector({features: features1}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            featureOverlay1.setMap(map1);
            break;
        case 2:
            map2= new ol.Map({
                target: 'myMap2',
                render: 'canfas',
                view: view,
                layers: [],
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: true
                    })
                }).extend([
                    scaleLineControl, mousePositionControl
                ])
            });

            //map2.addLayer(layer);
            /*map2.addLayer(aeCat);
            map2.addLayer(aeFab);*/
            
            createMeasureTooltip(true);
            createHelpTooltip(true);
            
            
            map2.addInteraction(modify2);

            map2.on('postrender',function(){
                if(count<10){
                    map2.getView().fit(extent,map2.getSize());
                    firstTime2=false;
                    count++;
                }

            });

            map2.on('singleclick', function(evt) {
                if(map2Info){
                    var viewResolution = /** @type {number} */ (map2.getView().getResolution());
                    /*var url = wmsSource.getGetFeatureInfoUrl(
                        evt.coordinate, viewResolution, 'EPSG:3857',
                        {'INFO_FORMAT': 'text/html'});
                    if (url) {
                        console.log(url);
                    }*/
                    var layers=evt.target.getLayers().getArray();
                    var urls=[];
                    for (var idx in layers){
                        if(layers[idx].getVisible()){
                            if(layers[idx].getSource().getUrls()!=null){
                                urls.push(layers[idx].getSource().getGetFeatureInfoUrl(
                                    evt.coordinate, viewResolution, 'EPSG:3857',{'INFO_FORMAT': 'text/html'}));
                            }
                        }
                    }
                    for (var i in urls){
                        
                    }
                    Ext.create('SIMFito.view.GetFeaturesInfoWindow').init(urls);
                }
            });


            featureOverlay2 = new ol.layer.Vector({
                source: new ol.source.Vector({features: features2}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            
            featureOverlay2M = new ol.layer.Vector({
                source: new ol.source.Vector({features: features2M}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            featureOverlay2.setMap(map2);
            featureOverlay2M.setMap(map2);
            
            pointerMoveHandler = function (evt) {
              if (evt.dragging) {
                return;
              }
              /** @type {string} */
              let helpMsg = '';

              if (sketch) {
                const geom = sketch.getGeometry();
                if (geom instanceof ol.geom.Polygon) {
                  helpMsg = "";
                } else if (geom instanceof ol.geom.LineString) {
                  helpMsg =  "";
                }
              }
              
              if(helpTooltipElement !== null){
                  helpTooltipElement.innerHTML = "";
                  helpTooltipElement.classList.remove('hidden');
              }
               
              helpTooltip.setPosition(evt.coordinate);
            };
            
            break;
        case 3:
            map3 = new ol.Map({
                target: 'myMap3',
                renderer: 'canvas',
                view: view3,
                layers: [],
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: true
                    })
                }).extend([
                    scaleLineControl, mousePositionControl
                ])
            });
            // end map

            map3.addInteraction(modify1);
            //end add feature
            map3.addLayer(layer);
            map3.addLayer(aeCat);
            map3.addLayer(aeFab);
            map3.addLayer(aeCod);
            map3.addLayer(markerLayer1);
            //end add bing


            //first zoom on map extent;
            map3.on('postrender',function(){
                if(firstTime1){
                    map3.getView().fit(extent,map3.getSize());
                    firstTime1=false;
                }

            });

            var featureOverlay3 = new ol.layer.Vector({
                source: new ol.source.Vector({features: features1}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            featureOverlay3.setMap(map3);
            break;
        case 4:
            map4 = new ol.Map({
                target: 'myMap4',
                renderer: 'canvas',
                view: view1,
                layers: [],
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: true
                    })
                }).extend([
                    scaleLineControl, mousePositionControl
                ])
            });
            // end map

            map4.addInteraction(modify1);
            //end add feature
            
            map4.addLayer(layer);
            map4.addLayer(aeCat);
            map4.addLayer(aeFab);
            map4.addLayer(aeCod);
            map4.addLayer(Catasto);
            map4.addLayer(markerLayer1);
            //end add bing


            //first zoom on map extent;
            map4.on('postrender',function(){
                if(firstTime4){
                    map4.getView().fit(extent,map4.getSize());
                    firstTime4=false;
                }

            });

            var featureOverlay4 = new ol.layer.Vector({
                source: new ol.source.Vector({features: features1}),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            featureOverlay4.setMap(map4);
            break;
    }
}

function addBufferLayer(pestcode,start,end,buffer1,buffer2,buffer3)
{
    var viewparams='end:'+end+';start:'+start+';pestcode:'+pestcode+';buffer1:'+buffer1+';buffer2:'+buffer2+';buffer3:'+buffer3;
    var bufferLayerSourcer= new ol.source.TileWMS({
        url: wmsUrl,
        params: {'LAYERS': 'simfito:simbuffer','viewparams':viewparams},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    bufferLayer= new ol.layer.Tile({
        source: bufferLayerSourcer
    });
    
    pufferLayer.setOpacity(0.4);

    map2.addLayer(bufferLayer);
}

function addGeometry(id,xgeometry,zoomOn,group, whitchMap)
{
    whitchMap=(whitchMap===undefined) ? 'map' : whitchMap;
    group=(typeof group!='undefined')?group:'none';
    removeLayerBy('myGroup', group, whitchMap);
    zoomOn=(typeof zoomOn == "undefined")? true : zoomOn;

    var coor = xgeometry.coordinates;
    var geometryType = xgeometry.type;
    var labelText=xgeometry.label;
    var textAlign='center';
    var offsetX=0;
    switch(geometryType) {
        case 'Point':
        default:
            geometry = new ol.geom.Point(coor);
            textAlign='end';
            offsetX=-10;
            break;
        case 'LineString':
            geometry = new ol.geom.LineString(coor);
            break;
        case 'LinearRing':
            geometry = new ol.geom.LinearRing(coor);
            break;
        case 'Polygon':
            geometry = new ol.geom.Polygon(coor);
            opacity = 0.2;
            break;
        case 'MultiPoint':
            geometry = new ol.geom.MultiPoint(coor);
            break;
        case 'MultiLineString':
            geometry = new ol.geom.MultiLineString(coor);
            break;
        case 'MultiPolygon':
            geometry = new ol.geom.MultiPolygon(coor);
            //opacity = 0.5;
            break;
        case 'GeometryCollection':
            geometry = new ol.geom.GeometryCollection(coor);
            break;
        case 'Circle':
            geometry = new ol.geom.Circle(coor);
            break;
    }
    var label = new ol.style.Text({
        text: labelText,
        fill: new ol.style.Fill({color:  '#ffffff'}),
        stroke: new ol.style.Stroke({color: '#000000', width: 1}),
        scale: 1.8,
        offsetX: offsetX,
        textAlign: textAlign
    });
    var feature = new ol.Feature({
        geometry: geometry,
        name: group
    });
    var color;
    switch(group){
        case 'osservazioni':
            color= 'rgba(2550,0,0,025)';
            break;
        case 'siti':
        default :
            color = 'rgba(0,255,255,0.25)';
            break;
    }
    var iconStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: color
        }),
        stroke: new ol.style.Stroke({
            color: '#00ffff',
            width: 1
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 3
            })
        }),
        text: label
    });
    feature.setStyle(iconStyle);
    var ff= new ol.Collection([feature]);
    var source= new ol.source.Vector({features:ff});
    var vItem = new ol.layer.Vector({
        source: source,
        idItem: id,
        myGroup:group
    });
    var vift=true;
    var count=0;
    if(zoomOn){
        vItem.on('postcompose',function(event){
            if(vift){
                if(geometryType=='Point'){
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().setCenter(coor);
                            map.getView().setZoom(maxZoom);
                            break;
                        case 'map1':
                            map1.getView().setCenter(coor);
                            map1.getView().setZoom(maxZoom);
                            break;
                        case 'map2':
                            map2.getView().setCenter(coor);
                            map2.getView().setZoom(maxZoom);
                            break;
                        case 'map3':
                            map3.getView().setCenter(coor);
                            map3.getView().setZoom(maxZoom);
                            break;
                        case 'map4':
                            map4.getView().setCenter(coor);
                            map4.getView().setZoom(maxZoom);
                            break;
                    }
                } else {
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().fit(vItem.getSource().getExtent(),map.getSize());
                            break;
                        case 'map1':
                            map1.getView().fit(vItem.getSource().getExtent(),map1.getSize());
                            break;
                        case 'map2':
                            map2.getView().fit(vItem.getSource().getExtent(),map2.getSize());
                            break;
                        case 'map3':
                            map3.getView().fit(vItem.getSource().getExtent(),map3.getSize());
                            break;
                        case 'map4':
                            map4.getView().fit(vItem.getSource().getExtent(),map4.getSize());
                            break;
                    }
                }
                if(count++==1)
                    vift=false;
            }
        });
    }
    switch (whitchMap){
        case 'map':
        default:
            map.addLayer(vItem);
            break;
        case 'map1':
            map1.addLayer(vItem);
            break;
        case 'map2':
            map2.addLayer(vItem);
            break;
        case 'map3':
            map3.addLayer(vItem);
            break;
        case 'map4':
            map4.addLayer(vItem);
            break;
    }
    //map.addLayer(vItem);
    return vItem.getSource().getExtent();
}

function addGeometry2(id,xgeometry,zoomOn,group, whitchMap)
{
    whitchMap=(whitchMap===undefined) ? 'map' : whitchMap;
    group=(typeof group!='undefined')?group:'none';
    removeLayerBy('myGroup', group, whitchMap);
    zoomOn=(typeof zoomOn == "undefined")? true : zoomOn;

    var coor = xgeometry.coordinates;
    var geometryType = xgeometry.type;
    var labelText=xgeometry.label;
    var textAlign='center';
    var offsetX=0;
    switch(geometryType) {
        case 'Point':
        default:
            geometry = new ol.geom.Point(coor);
            textAlign='end';
            offsetX=-10;
            break;
        case 'LineString':
            geometry = new ol.geom.LineString(coor);
            break;
        case 'LinearRing':
            geometry = new ol.geom.LinearRing(coor);
            break;
        case 'Polygon':
            geometry = new ol.geom.Polygon(coor);
            opacity = 0.2;
            break;
        case 'MultiPoint':
            geometry = new ol.geom.MultiPoint(coor);
            break;
        case 'MultiLineString':
            geometry = new ol.geom.MultiLineString(coor);
            break;
        case 'MultiPolygon':
            geometry = new ol.geom.MultiPolygon(coor);
            //opacity = 0.5;
            break;
        case 'GeometryCollection':
            geometry = new ol.geom.GeometryCollection(coor);
            break;
        case 'Circle':
            geometry = new ol.geom.Circle(coor);
            break;
    }
    var label = new ol.style.Text({
        text: labelText,
        fill: new ol.style.Fill({color:  '#ffffff'}),
        stroke: new ol.style.Stroke({color: '#000000', width: 1}),
        scale: 1.8,
        offsetX: offsetX,
        textAlign: textAlign
    });
    var feature = new ol.Feature({
        geometry: geometry,
        name: group
    });
    var color;
    switch(group){
        case 'osservazioni':
            color= 'rgba(2550,0,0,025)';
            break;
        case 'siti':
        default :
            color = 'rgba(0,255,255,0.25)';
            break;
    }
    var iconStyle = new ol.style.Style({
        /*fill: new ol.style.Fill({
            color: color
        }),*/
        stroke: new ol.style.Stroke({
            color: '#00ffff',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 3
            })
        }),
        text: label
    });
    feature.setStyle(iconStyle);
    var ff= new ol.Collection([feature]);
    var source= new ol.source.Vector({features:ff});
    var vItem = new ol.layer.Vector({
        source: source,
        idItem: id,
        myGroup:group
    });
    var vift=true;
    var count=0;
    if(zoomOn){
        vItem.on('postcompose',function(event){
            if(vift){
                if(geometryType=='Point'){
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().setCenter(coor);
                            map.getView().setZoom(maxZoom);
                            break;
                        case 'map1':
                            map1.getView().setCenter(coor);
                            map1.getView().setZoom(maxZoom);
                            break;
                        case 'map2':
                            map2.getView().setCenter(coor);
                            map2.getView().setZoom(maxZoom);
                            break;
                        case 'map3':
                            map3.getView().setCenter(coor);
                            map3.getView().setZoom(maxZoom);
                            break;
                        case 'map4':
                            map4.getView().setCenter(coor);
                            map4.getView().setZoom(maxZoom);
                            break;
                    }
                } else {
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().fit(vItem.getSource().getExtent(),map.getSize());
                            break;
                        case 'map1':
                            map1.getView().fit(vItem.getSource().getExtent(),map1.getSize());
                            break;
                        case 'map2':
                            map2.getView().fit(vItem.getSource().getExtent(),map2.getSize());
                            break;
                        case 'map3':
                            map3.getView().fit(vItem.getSource().getExtent(),map3.getSize());
                            break;
                        case 'map4':
                            map4.getView().fit(vItem.getSource().getExtent(),map4.getSize());
                            break;
                    }
                }
                if(count++==1)
                    vift=false;
            }
        });
    }
    switch (whitchMap){
        case 'map':
        default:
            map.addLayer(vItem);
            break;
        case 'map1':
            map1.addLayer(vItem);
            break;
        case 'map2':
            map2.addLayer(vItem);
            break;
        case 'map3':
            map3.addLayer(vItem);
            break;
        case 'map4':
            map4.addLayer(vItem);
            break;
    }
    //map.addLayer(vItem);
    return vItem.getSource().getExtent();
}

var modifyL;
function addGeometry3(id,xgeometry,zoomOn,group, whitchMap)
{
    whitchMap=(whitchMap===undefined) ? 'map' : whitchMap;
    group=(typeof group!='undefined')?group:'none';
    removeLayerBy('myGroup', group, whitchMap);
    zoomOn=(typeof zoomOn == "undefined")? true : zoomOn;

    var coor = xgeometry.coordinates;
    var geometryType = xgeometry.type;
    var labelText=xgeometry.label;
    var textAlign='center';
    var offsetX=0;
    switch(geometryType) {
        case 'Point':
        default:
            geometry = new ol.geom.Point(coor);
            textAlign='end';
            offsetX=-10;
            break;
        case 'LineString':
            geometry = new ol.geom.LineString(coor);
            break;
        case 'LinearRing':
            geometry = new ol.geom.LinearRing(coor);
            break;
        case 'Polygon':
            geometry = new ol.geom.Polygon(coor);
            opacity = 0.2;
            break;
        case 'MultiPoint':
            geometry = new ol.geom.MultiPoint(coor);
            break;
        case 'MultiLineString':
            geometry = new ol.geom.MultiLineString(coor);
            break;
        case 'MultiPolygon':
            geometry = new ol.geom.MultiPolygon(coor);
            //opacity = 0.5;
            break;
        case 'GeometryCollection':
            geometry = new ol.geom.GeometryCollection(coor);
            break;
        case 'Circle':
            geometry = new ol.geom.Circle(coor);
            break;
    }
    var label = new ol.style.Text({
        text: labelText,
        fill: new ol.style.Fill({color:  '#ffffff'}),
        stroke: new ol.style.Stroke({color: '#000000', width: 1}),
        scale: 1.8,
        offsetX: offsetX,
        textAlign: textAlign
    });
    var feature = new ol.Feature({
        geometry: geometry,
        name: group
    });
    var color;
    switch(group){
        case 'osservazioni':
            color= 'rgba(2550,0,0,025)';
            break;
        case 'siti':
        default :
            color = 'rgba(0,255,255,0.25)';
            break;
    }
    var iconStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: color
        }),
        stroke: new ol.style.Stroke({
            color: '#00ffff',
            width: 1
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 3
            })
        }),
        text: label
    });
    feature.setStyle(iconStyle);
    var ff= new ol.Collection([feature]);
    var source= new ol.source.Vector({features:ff});
    modifyL = new ol.layer.Vector({
        source: source,
        idItem: id,
        myGroup:group
    });
    var vift=true;
    var count=0;
    if(zoomOn){
        modifyL.on('postcompose',function(event){
            if(vift){
                if(geometryType=='Point'){
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().setCenter(coor);
                            map.getView().setZoom(maxZoom);
                            break;
                        case 'map1':
                            map1.getView().setCenter(coor);
                            map1.getView().setZoom(maxZoom);
                            break;
                        case 'map2':
                            map2.getView().setCenter(coor);
                            map2.getView().setZoom(maxZoom);
                            break;
                        case 'map3':
                            map3.getView().setCenter(coor);
                            map3.getView().setZoom(maxZoom);
                            break;
                        case 'map4':
                            map4.getView().setCenter(coor);
                            map4.getView().setZoom(maxZoom);
                            break;
                    }
                } else {
                    switch(whitchMap){
                        case 'map':
                        default:
                            map.getView().fit(modifyL.getSource().getExtent(),map.getSize());
                            break;
                        case 'map1':
                            map1.getView().fit(modifyL.getSource().getExtent(),map1.getSize());
                            break;
                        case 'map2':
                            map2.getView().fit(modifyL.getSource().getExtent(),map2.getSize());
                            break;
                        case 'map3':
                            map3.getView().fit(modifyL.getSource().getExtent(),map3.getSize());
                            break;
                        case 'map4':
                            map4.getView().fit(modifyL.getSource().getExtent(),map4.getSize());
                            break;
                    }
                }
                if(count++==1)
                    vift=false;
            }
        });
    }
    switch (whitchMap){
        case 'map':
        default:
            map.addLayer(modifyL);
            break;
        case 'map1':
            map1.addLayer(modifyL);
            break;
        case 'map2':
            map2.addLayer(modifyL);
            break;
        case 'map3':
            map3.addLayer(modifyL);
            break;
        case 'map4':
            map4.addLayer(modifyL);
            break;
    }
    //map.addLayer(vItem);
    return {"extent":modifyL.getSource().getExtent(),"layer":modifyL};
}



function findLayerBy(key, value, witchMap)
{
    var lay=-1;
    var layers;/* = ((witchMap===undefined)||(witchMap=='map')) ? map.getLayers().getArray() : map1.getLayers().getArray();*/
    if(witchMap==undefined){
        witchMap='map';
    }
    switch (witchMap){
        default:
        case 'map':
            layers=map.getLayers().getArray();
            break;
        case 'map1':
            layers=map3.getLayers().getArray();
            break;
        case 'map2':
            layers=map2.getLayers().getArray();
            break;
        case 'map4':
            layers=map4.getLayers().getArray();
            break;
    }
    for(var i in layers){
        if(layers[i].get(key)!==undefined){
            if(layers[i].get(key)==value){
                lay= layers[i];
            }
        }
    }
    return lay;
}

function removeLayerBy(key, value, witchMap)
{
    var layers;// = ((witchMap===undefined)||(witchMap=='map')) ? map.getLayers().getArray(): map1.getLayers().getArray();
    switch(witchMap){
        case 'map':
        default:
            layers=map.getLayers().getArray();
            break;
        case 'map1':
            layers=map1.getLayers().getArray();
            break;
        case 'map2':
            layers=map2.getLayers().getArray();
            break;
        case 'map3':
            layers=map3.getLayers().getArray();
            break;
        case 'map4':
            layers=map4.getLayers().getArray();
            break;
            
    }
    for(var i=layers.length-1;i>=0;i--){
        if(layers[i].get(key)!==undefined){
            if(layers[i].get(key)==value){
                lay= layers[i];
                switch(witchMap){
                    case 'map':
                    default:
                        map.removeLayer(lay);
                        break;
                    case 'map1':
                        map1.removeLayer(lay);
                        break;
                    case 'map2':
                        map2.removeLayer(lay);
                        break;
                    case 'map3':
                        map3.removeLayer(lay);
                        break;
                    case 'map4':
                        map4.removeLayer(lay);
                        break;
                }
            }
        }
    }
}

function bboxs2bbox(bboxs)
{
    var bbox;
    if((bboxs===null)||(bboxs===undefined)||(bboxs==='')){
        bbox=mainBbox;
    }
    else {
        var alpha=bboxs.split("BOX(")[1].split(")")[0].split(",");
        var alpha0=alpha[0].split(" ");
        var alpha1=alpha[1].split(" ");
        bbox=[alpha0[0]*1,alpha0[1]*1,alpha1[0]*1,alpha1[1]*1];
    }
    return bbox;
}

function addInteraction(geometryType,from,extras)
{
    switch(from){
        case 'newTrap':
            draw1= new ol.interaction.Draw({
                features: features1,
                type: geometryType
            });
            draw1.on('drawend',function(e){
                var gid_sito=extras.gid_sito;
                var coordinates=e.feature.getGeometry().getCoordinates();
                Ext.getBody().mask();
                Ext.Ajax.request({
                    url: 'services/ajax.php',
                    async:true,
                    cors:true,
                    params:{
                        mode: 'chk_trap',
                        gid_sito: gid_sito,
                        coordinates: Ext.JSON.encode(coordinates)
                    },
                    method: 'POST',
                    success: function(response, opts) {
                        Ext.getBody().unmask();
                        var text = response.responseText;
                        var resp= Ext.JSON.decode(text,true);
                        var intersect=resp.data[0].intersect;
                        if(intersect=="true"){
                            var type=e.feature.getGeometry().getType();
                            Ext.getCmp('ridisegnatrappola').setDisabled(false);
                            Ext.getCmp('zoomtrappola').setDisabled(false);
                            map1.removeInteraction(draw1);
                        }
                        else{
                            var userData = response.request.params;
                            var extras = {gid_sito : userData.gid_sito};

                            removeInteraction('map1');
                            addInteraction('Point','newTrap',extras);

                            Ext.getCmp('zoomtrappola').setDisabled(true);
                            
                            Ext.Msg.alert('Attenzione','La trappola è stata posizionata troppo lontano dal sito!');
                        }
                    },
                    failure: function(response, opts) {
                        Ext.getBody().unmask();
                        console.error('server-side failure with status code ' + response.status);
                    }
                });
            });
            map1.addInteraction(draw1);
            break;
        case 'lenght':
             draw2M= new ol.interaction.Draw({
                 features: features2M,
                 type: geometryType
             });
             draw2M.on('drawstart',
                function(evt){
                    createHelpTooltip(true);
                     createMeasureTooltip(true);
                    sketch = evt.feature;

                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;

                    listener = sketch.getGeometry().on('change', function(evt) {
                        var geom = evt.target;
                        var output;
                        if(false){
                            var coordinates=evt.target.getFlatCoordinates();
                            output = formatLength2( /** @type {ol.geom.LineString} */ geom, coordinates);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        else{
                            if (geom instanceof ol.geom.Polygon) {
                                output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                            } else if (geom instanceof ol.geom.LineString) {
                                output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                                tooltipCoord = geom.getLastCoordinate();
                            }
                        }
                        measureTooltipElement.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this
            );											

            draw2M.on('drawend',function(e){
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip(false);
                ol.Observable.unByKey(listener);

            });
            map2.addInteraction(draw2M);
        break;
        case 'areaBuffer':
            //debugger;
            pointerMoveHandler_=map2.on('pointermove', pointerMoveHandler);
            
            if(extras!=undefined){
                var id=100;
                var result=addGeometry3(id,extras,true,'areebuffer','map2');                
                
                draw2= new ol.interaction.Modify({
                    source: result.layer.getSource()
                });
                
                draw2.on('modifystart',
                    function(evt){
                        createHelpTooltip(true);
                         createMeasureTooltip(true);
                        sketch = evt.features.getArray()[0];

                        /** @type {ol.Coordinate|undefined} */
                        var tooltipCoord = evt.coordinate;

                        listener = sketch.getGeometry().on('change', function(evt) {
                            var geom = evt.target;
                            var output;
                            if(false){
                                var coordinates=evt.target.getFlatCoordinates();
                                output = formatLength2( /** @type {ol.geom.LineString} */ geom, coordinates);
                                tooltipCoord = geom.getLastCoordinate();
                            }
                            else{
                                
                                if (geom instanceof ol.geom.LineString) {
                                    output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                                    tooltipCoord = geom.getLastCoordinate();
                                }
                                else{
                                   output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                                   tooltipCoord = geom.getInteriorPoints().getCoordinates()[0]; 
                                }
                            }
                            measureTooltipElement.innerHTML = output;
                            measureTooltip.setPosition(tooltipCoord);
                        });
                    }, this
                );
            }
            else{
                draw2= new ol.interaction.Draw({
                    features: features2,
                    type: geometryType
                });
                
                draw2.on('drawstart',
                    function(evt){
                        createHelpTooltip(true);
                        createMeasureTooltip(true);
                        sketch = evt.feature;

                        /** @type {ol.Coordinate|undefined} */
                        var tooltipCoord = evt.coordinate;

                        listener = sketch.getGeometry().on('change', function(evt) {
                            var geom = evt.target;
                            var output;
                            if(false){
                                var coordinates=evt.target.getFlatCoordinates();
                                output = formatLength2( /** @type {ol.geom.LineString} */ geom, coordinates);
                                tooltipCoord = geom.getLastCoordinate();
                            }
                            else{
                                if (geom instanceof ol.geom.Polygon) {
                                    output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                                } else if (geom instanceof ol.geom.LineString) {
                                    output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                                    tooltipCoord = geom.getLastCoordinate();
                                }
                            }
                            measureTooltipElement.innerHTML = output;
                            measureTooltip.setPosition(tooltipCoord);
                        });
                    }, this
                );

                /*draw2.on('drawend',function(e){
                    //sketch = e.feature;
                    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip(true);
                    ol.Observable.unByKey(listener);

                });*/            
            }
            
            
            map2.addInteraction(draw2);
            break;
        default:
            draw = new ol.interaction.Draw({
                features: features,
                type: geometryType
            });
            draw.on('drawend', function(e){
                var type,point,area,comuniRequest,provincia,comune,demRequest,quota;
                switch (from){
                    case 'newSite':
                        type= e.feature.getGeometry().getType();
                        switch(type){
                            case "Polygon":
                                point= e.feature.getGeometry().getFlatInteriorPoint();
                                area=Number(e.feature.getGeometry().getArea().toFixed(0));
                                break;
                            case "Point":
                                point= e.feature.getGeometry().getCoordinates();
                                area=null;
                                break;

                        }

                        comuniRequest=getFeatureInfo(Comuni,point);
                        if(comuniRequest.features.length>0){
                            provincia=comuniRequest.features[0].properties.provincia;
                            comune=comuniRequest.features[0].properties.istat;
                            demRequest=getFeatureInfo(DEM,point);
                            quota=demRequest.features[0].properties.GRAY_INDEX;

                            Ext.getCmp('ridisegnasito').setDisabled(false);

                            Ext.getCmp('sitiprovincia').setValue(provincia);
                            Ext.getCmp('siticomune').setDisabled(false);
                            Ext.getCmp('siticomune').getStore().load();
                            Ext.getCmp('siticomune').setValue(comune);
                            Ext.getCmp('quota').setValue(quota);
                            Ext.getCmp('superficie').setValue(area);

                            removeInteraction('map');

                            Ext.getCmp('sitizoom').setDisabled(false);
                        }else{
                            features.clear();
                            /*removeInteraction();
                            addInteraction('Polygon','newSite2');
                            Ext.getCmp('sitizoom').setDisabled(true);*/
                            Ext.Msg.alert('ATTENZIONE','Il sito disegnato non risulta in campania! Ridisegnare il sito (il vecchio sito disegnato potrebbe rimanere in mappa fino a quando non si disegna l&apos;altro)');
                        }
                        break;
                    case 'newSite2':
                        type= e.feature.getGeometry().getType();
                        switch(type){
                            case "Polygon":
                                point= e.feature.getGeometry().getFlatInteriorPoint();
                                area=Number(e.feature.getGeometry().getArea().toFixed(0));
                                break;
                            case "Point":
                                point= e.feature.getGeometry().getCoordinates();
                                area=null;
                                break;

                        }

                        comuniRequest=getFeatureInfo(Comuni,point);
                        provincia=comuniRequest.features[0].properties.provincia;
                        comune=comuniRequest.features[0].properties.istat;
                        demRequest=getFeatureInfo(DEM,point);
                        quota=demRequest.features[0].properties.GRAY_INDEX;

                        Ext.getCmp('ridisegnasito1').setDisabled(false);

                        Ext.getCmp('sitiprovincia1').setValue(provincia);
                        Ext.getCmp('siticomune1').setDisabled(false);
                        Ext.getCmp('siticomune1').getStore().load();
                        Ext.getCmp('siticomune1').setValue(comune);
                        Ext.getCmp('quota1').setValue(quota);
                        Ext.getCmp('superficie1').setValue(area);

                        removeInteraction('map');

                        Ext.getCmp('sitizoom1').setDisabled(false);
                        break;
                    case 'osservazioni':
                    default:
                        removeInteraction('map');
                        break;
                }
            });
            map.addInteraction(draw);
            break;
    }
}

function formatArea(polygon)
{
    var area;
    if (true /*geodesicCheckbox.checked*/) {
        //var sourceProj = MM.map.getView().getProjection();
        //var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326'));
        //var coordinates = geom.getLinearRing(0).getCoordinates();
        //area = Math.abs(ol.sphere.getArea(geom));//this.wgs84Sphere.geodesicArea(coordinates));
        area= ol.Sphere.getArea(polygon);
    } else {
        area = polygon.getArea();
    }
    var output;
    /*if ((area > 10000)&&(area < 1000000)) {
        output = (Math.round(area / 10000 * 100) / 100) + ' ' + 'hectares';
    } else if(area >= 1000000){
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 10) / 10) + ' ' + 'm<sup>2</sup>';
    }*/
    output = (Math.round(area / 10000 * 100) / 100) + ' ' + 'hectares';
    return output;
}

var wgs84radius=6378137;

function formatLength(line)
{
    var length;
    if (true /*geodesicCheckbox.checked*/) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = this.map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += this.wgs84Sphere.haversineDistance(c1, c2);//ol.Sphere.getDistance(c1, c2, wgs84radius); //
        }
    } else {
        length = Math.round(line.getLength() * 100) / 100;
    }
    var output;
    if (length > 1000) {
        output = (Math.round((length / 1000) * 1000) / 1000) + ' ' + 'km';
    } else {
        output = (Math.round(length * 10) / 10) + ' ' + 'm';
    }
    return output;
}

function formatLength2(polygon, coordinates)
{
    var length;
    //debugger;
    var line = new ol.geom.LineString(coordinates);    
    if (true /*geodesicCheckbox.checked*/) {
        //var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = this.map.getView().getProjection();
        for (var i = 0; i < coordinates.length - 2; i+=2) {
            var c1 = ol.proj.transform([coordinates[i], coordinates[i + 1]], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform([coordinates[i + 2], coordinates[i + 3]], sourceProj, 'EPSG:4326');
            length += ol.Sphere.getDistance_(c1, c2, wgs84radius); //wgs84Sphere.haversineDistance(c1, c2);
        }
    } else {
        length = Math.round(line.getLength() * 100) / 100;
    }
    var output;
    if (length > 1000) {
        output = (Math.round((length / 1000) * 1000) / 1000) + ' ' + 'km';
    } else {
        output = (Math.round(length * 10) / 10) + ' ' + 'm';
    }
    return output;
}

function getFeatureInfo(layer,point,witchMap)
{
    witchMap=(witchMap===undefined)?'map':witchMap;
    var view,viewResolution,url;
    switch(witchMap){
        case 'map':
        default:
            view=map.getView();
            viewResolution = /** @type {number} */ (view.getResolution());
            url = layer.getSource().getGetFeatureInfoUrl(
                point, viewResolution, map.getView().getProjection().getCode(),
                {'INFO_FORMAT': 'application/json'}
            );
            break;
        case 'map1':
            view=map1.getView();
            viewResolution = /** @type {number} */ (view.getResolution());
            url = layer.getSource().getGetFeatureInfoUrl(
                point, viewResolution, map1.getView().getProjection().getCode(),
                {'INFO_FORMAT': 'application/json'}
            );
            break;
        case 'map3':
            view=map3.getView();
            viewResolution = /** @type {number} */ (view.getResolution());
            url = layer.getSource().getGetFeatureInfoUrl(
                point, viewResolution, map3.getView().getProjection().getCode(),
                {'INFO_FORMAT': 'application/json'}
            );
            break;
    }

    var response=null;
    Ext.Ajax.request({
        url: url,
        method:'GET',
        async:false,
        success: function(resp) {
            response= Ext.util.JSON.decode(resp.responseText);
        },
        failure: function(response, opts) {
            console.error('server-side failure with status code ' + response.status);
        }
    });
    return response;
}

function removeInteraction(whichMap,extra)
{
    switch(whichMap){
        case 'map1':
            features1.clear();
            if(typeof(draw1)!="undefined") map1.removeInteraction(draw1);
            break;
        case 'map':
        default:
            features.clear();
            map.removeInteraction(draw);
            break;
        case 'map4':
            features1.clear();
            map4.removeInteraction(draw1);
            break;
        case 'map2':
            if(typeof extra=='undefined'){
                features2.clear();
                map2.removeInteraction(draw2);
                map2.removeOverlay(featureOverlay2);
            }
            else{
                features2M.clear();
                map2.removeInteraction(draw2M);
                helpTooltipElement= null;
                measureTooltipElement = null;
                ol.Observable.unByKey(pointerMoveHandler);
                //this.map.unByKey(this.pointerMoveHandler);
                createHelpTooltip(false);
                map2.removeOverlay(featureOverlay2M);
                //var openOverlays = map2.getOverlays().clear();
            }
            break;
    }
}

function feat2GeoJson(feat)
{
    var mapCrs=map.getView().getProjection().getCode();
    var geoJson={crs:{type:"name",properties:{name:mapCrs}}};
    geoJson.type=feat.getGeometry().getType();
    geoJson.coordinates=feat.getGeometry().getCoordinates();
    return geoJson;
}

function legendAdd(layer, title, id)
{
    lURL=legendURL(layer);

    var legendRecord=Ext.create('SIMFito.model.LegendsModel',{
        src : lURL,
        caption: title,
        id:  id
    });
    var store=Ext.StoreMgr.get('LegendsStore');
    store.add(legendRecord);
    store.commitChanges();
}

function legendRemove(layer, id)
{
    var legendStore=Ext.StoreMgr.get('LegendsStore');
    var toRemoveRecId=legendStore.findExact('id',id);
    if(toRemoveRecId!=-1) {
        legendStore.remove(legendStore.getAt(toRemoveRecId));
        legendStore.commitChanges();
    }
}

function legendURL(layer)
{
    var lURL="";

    var urls = layer.getSource().getUrls();
    if(typeof urls[0]!='undefined'){
        lURL=urls[0] + "?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png" + "&WIDTH=20&HEIGHT=20&LAYER="+layer.getSource().getParams().LAYERS;
    }

    return lURL;
}

function setAEOpacity(value)
{
    /*switch (mapNumber){
        case 0:
            map.getLayers().Array_[1].setOpacity(value/100);
            map.getLayers().Array_[1].setOpacity(value/100);
            break;
        case 1:
            map1.getLayers().Array_[1].setOpacity(value/100);
            map1.getLayers().Array_[1].setOpacity(value/100);
            break;
        case 2:
            map2.getLayers().Array_[1].setOpacity(value/100);
            map2.getLayers().Array_[1].setOpacity(value/100);
            break;
        case 3:
            map3.getLayers().Array_[1].setOpacity(value/100);
            map3.getLayers().Array_[1].setOpacity(value/100);
            break;
        case 4:
            map4.getLayers().Array_[1].setOpacity(value/100);
            map4.getLayers().Array_[1].setOpacity(value/100);
            break;
        default:
            aeCat.setOpacity(value/100);
            aeFab.setOpacity(value/100);
            break;
        
    }*/
    aeCat.setOpacity(value/100);
    aeFab.setOpacity(value/100);
    aeCod.setOpacity(value/100);
    aeCat1.setOpacity(value/100);
    aeFab1.setOpacity(value/100);
    aeCod1.setOpacity(value/100);
}

var measureTooltip, measureTooltipElement=null, helpTooltipElement=null, helpTooltip;

function createHelpTooltip(bool)
{
    if(bool){
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltipElement.id ='helpTooltipElement';
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map2.addOverlay(helpTooltip);
    }
    else {
        map2.removeOverlay(helpTooltip);
    }
}

function createMeasureTooltip(bool)
{
    if(bool){
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map2.addOverlay(measureTooltip);
    }
    else{
        map2.removeOverlay(measureTooltip);
    }
}

function feats2GeoJson(feats)
{
    var mapCrs=map.getView().getProjection().getCode();
    var geoJson={};
    geoJson.crs={type:"name",properties:{name:mapCrs}};
    geoJson.geometry={"type":"MultiPolygon","coordinates":[]};
    for (var i in feats){
        /*var feature={"type": "Feature","geometry": {}};
        feature.geometry.type=feats[i].getGeometry().getType();
        feature.geometry.coordinates=feats[i].getGeometry().getCoordinates();
        geoJson.features.push(feature);*/
        if(feats[i].get('geometry') instanceof ol.geom.Polygon){
            geoJson.geometry.coordinates.push(feats[i].getGeometry().getCoordinates());
        }
        else{
            geoJson.geometry.coordinates=feats[i].getGeometry().getCoordinates();
        }
    }
    return geoJson;
}