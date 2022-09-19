import { useContext, useEffect, useRef } from 'react';
import './Map.css';
import 'ol/ol.css';
import { Feature,  View } from 'ol';
import olMap from 'ol/Map';
import { Vector as VectorSource, OSM as OSMSource, ImageWMS, TileWMS } from 'ol/source';
import { Vector as VectorLayer, VectorImage as VectorImageLayer, Tile as TileLayer, Group as LayerGroup } from 'ol/layer';
import { transform } from 'ol/proj';
import { GeoJSON } from 'ol/format';
import { MultiLineString,MultiPoint,MultiPolygon, Point } from 'ol/geom';
import { createEmpty, extend } from 'ol/extent';
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style } from 'ol/style';

import { Select } from 'ol/interaction';

import { click } from 'ol/events/condition';

import { DxfContext } from '../../common/context/DxfContext';
import { defsData, proj } from '../../data/proj';
import { getParam } from '../../common/Utils';
import proj4 from 'proj4';


function Map(props) {
    
    const { file, entities, layers, coordSys, setMap, setCoordSys, setLayers } = useContext(DxfContext);
    const mapRef = useRef(null);

    proj();

    useEffect(() => {

        if(!mapRef.current) { 
            const osmLyr = new TileLayer({
                source: new OSMSource(
                    
                ),
            });

            const style = [
                
                new Style({
                    stroke: new Stroke({
                        width:2,
                    })
                }),
                new Style({
                    image: new CircleStyle({
                      radius: 5,
                      fill: new Fill({
                        color: 'orange',
                      }),
                    })
                })
            ]
            
            const lineLayer = new TileLayer({
                visible: true,
                source: new TileWMS({
                    url: 'http://localhost:8080/geoserver/demo/wms',
                    params: {
                        'FORMAT': 'image/png',
                        tiled: true,
                        "LAYERS": 'demo:dxf_line',
                        SRS : 'EPSG:5179'
                    },
                    serverType: 'geoserver',
                })
            });
            const polygonLayer = new TileLayer({
                visible: true,
                source: new TileWMS({
                    url: 'http://localhost:8080/geoserver/demo/wms',
                    params: {
                        'FORMAT': 'image/png',
                        tiled: true,
                        "LAYERS": 'demo:dxf_polygon',
                        SRS : 'EPSG:5179'
                    },
                    serverType: 'geoserver',
                    
                })
            });

            const pointLayer = new TileLayer({
                visible: true,
                source: new TileWMS({
                    url: 'http://localhost:8080/geoserver/demo/wms',
                    params: {
                        'FORMAT': 'image/png',
                        tiled: true,
                        "LAYERS": 'demo:dxf_point',
                        SRS : 'EPSG:5179'
                    },
                    serverType: 'geoserver',
                })
            });

            const vectorLayerGroup = new LayerGroup({
                layers: [],
            })
            
            mapRef.current = new olMap({
                target: 'map',
                layers: [osmLyr, vectorLayerGroup, polygonLayer],
                // layers: [osmLyr, vectorLayerGroup,  lineLayer, pointLayer],
                // layers: [osmLyr, vectorLayerGroup],
                view: new View({
                    center: [0,0],
                    zoom: 2,
                    projection: coordSys
                }),
            })

            const selectInteraction = new Select({
                condition: click,
                style: new Style({
                    stroke: new Stroke({
                        color: 'blue', 
                        width: '5', 
                    }),
                    fill: new Fill({
                        color:'red', 
                    })
                })
            })

            mapRef.current.addInteraction(selectInteraction);
            selectInteraction.on('select',(e)=>{
                // layer 선택시 동작해야할것 넣기?
                // console.log(e);
            })
        }
        setMap(mapRef.current);
        setCoordSys(defsData[0][0]);
    }, [])

    useEffect(()=>{ // 파일이 변경되거나 좌표계가 변경될 시
        mapRef.current.getLayers().getArray()[1].getLayers().clear(); 
        
        if(entities){
            Object.keys(entities).forEach(key => { // 레이어

                let layerCoordArr =[] ; 
                let _geometry;
                let type;
                let pol_chk =true; 
                
                entities[key].forEach(feature => { // 피쳐 
                    if(feature.type==='POINT' || feature.type==='TEXT' ||feature.type==='CIRCLE' ||feature.type==='INSERT'){
                        if(feature.position){
                            layerCoordArr.push(proj4(coordSys, 'EPSG:3857',[feature.position.x,feature.position.y]))
                        }else if(feature.endPoint){
                            
                            layerCoordArr.push(proj4(coordSys, 'EPSG:3857',[feature.endPoint.x,feature.endPoint.y]))
                        }
                        type = 'MultiPoint'
                    }else if(feature.type==='POLYLINE' || feature.type==='LWPOLYLINE'){
                        if(feature.vertices) {
                            const featureCoordArr =[] ; // 피쳐
                            feature.vertices.forEach(coord=>{
                                featureCoordArr.push(proj4(coordSys, 'EPSG:3857',[coord.x, coord.y]));
                            })
                            if(featureCoordArr[0][0] !== featureCoordArr[featureCoordArr.length-1][0] && featureCoordArr[0][1] !== featureCoordArr[featureCoordArr.length-1][1]){
                                pol_chk = false;
                            }
                            layerCoordArr.push(featureCoordArr);
                        }
                        type = 'MultiLineString'
                    }else if(feature.type==='POLYGON' || feature.type==='LWPOLYGON'){
                        type = 'MultiPolygon'
                    }                    
                })
                if(type === 'MultiLineString' && pol_chk){
                    type='MultiPolygon';
                    layerCoordArr = [layerCoordArr]
                }
                if(type === 'MultiPoint'){
                    _geometry = new MultiPoint(layerCoordArr)
                }else if(type === 'MultiLineString'){
                    _geometry = new MultiLineString(layerCoordArr);
                }else if(type === 'MultiPolygon'){
                    _geometry = new MultiPolygon(layerCoordArr);
                }
                
                const color = '#'+layers[key].color.toString(16).padStart(6,0);

                const newLayer = new VectorLayer({
                    id: key,
                    imageRatio: 2,
                    type ,
                    source: new VectorSource({
                        format: new GeoJSON(),
                    })
                })
                
                const newFeature = new Feature({
                    geometry: _geometry, 
                    geom: _geometry, 
                    layer : key,
                     
                    
                    color : getParam(entities, layers, key, 'color'),
                    colorindex : getParam(entities, layers, key, 'colorIndex'),
                    depth : getParam(entities, layers, key, 'depth'),
                    elevation : getParam(entities, layers, key, 'depth'),
                    extrusiondirectionx : getParam(entities, layers, key, 'extrusionDirectionX'),
                    extrusiondirectiony : getParam(entities, layers, key, 'extrusionDirectionY'),
                    extrusiondirectionz : getParam(entities, layers, key, 'extrusionDirectionZ'),
                    hascontinuouslinetypepattern : getParam(entities, layers, key, 'hasContinuousLinetypePattern'),
                    inpaperspace : getParam(entities, layers, key, 'inPaperSpace'),
                    linetype : getParam(entities, layers, key, 'lineType'),
                    linetypescale : getParam(entities, layers, key, 'lineTypeScale'),
                    lineweight : getParam(entities, layers, key, 'lineweight'),
                    ownerhandle : getParam(entities, layers, key, 'ownerHandle'),
                    shape : getParam(entities, layers, key, 'shape'),
                    type : getParam(entities, layers, key, 'type'),
                    visible : getParam(entities, layers, key, 'visible'),
                    select : getParam(entities, layers, key, 'select'),
                    
                });
                
                const featureStyle = [
                    new Style({
                        stroke: new Stroke({
                            color,
                            width:1,
                        })
                    }),
                    new Style({
                        image: new CircleStyle({
                          radius: 2,
                          fill: new Fill({
                            color,
                          }),
                        })
                    })
                ]

                newFeature.setStyle(
                    featureStyle
                )
                newLayer.getSource().addFeatures([newFeature]);
                mapRef.current.getLayers().getArray()[1].getLayers().push(newLayer);
                
            })

            const extent = new createEmpty();
            const layerGroupArr = mapRef.current.getLayers().getArray()[1].getLayers().getArray();

            layerGroupArr.forEach(vectorLayer => {
                extend(extent, vectorLayer.getSource().getExtent());
            });
            
            let pass = true;
            
            extent.forEach(ele=>{
                if(ele.toString().indexOf('Infinity') !== -1){
                    pass = false;
                }
            })
            if(pass){mapRef.current.getView().fit(extent, mapRef.current.getSize());}
            mapRef.current.getView().setZoom(mapRef.current.getView().getZoom() - 1);
         
        } 
        
    },[file, coordSys])

    useEffect(() => {
        if(mapRef.current) console.log(mapRef.current.getLayers().getArray()[2])
    }, [mapRef.current])

    return(
        <div id='map' />
    )
}

export default Map; 