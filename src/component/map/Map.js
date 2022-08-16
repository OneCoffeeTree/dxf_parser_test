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

import proj4 from 'proj4';
import { SetMealSharp } from '@mui/icons-material';
import ImageLayer from 'ol/layer/Image';


function Map(props) {
    
    const { file, entities, layers, coordSys, setMap, setCoordSys } = useContext(DxfContext);
    const mapRef = useRef(null);
    

    proj();

    useEffect(() => {

        

        if(!mapRef.current) { 
            const osmLyr = new TileLayer({
                source: new OSMSource(),
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
            // const vectorLayer = new VectorLayer({
            //     imageRatio: 2,
            //     source: new VectorSource({
            //         format: new GeoJSON(),
            //     }),
            //     style: function (feature) {            
            //         return style;
            //     }
            // })
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
                    serverType: 'geoserver'
                })
            });

            const vectorLayerGroup = new LayerGroup({
                layers: [],
                // visible: true
            })
            
            mapRef.current = new olMap({
                target: 'map',
                layers: [osmLyr,vectorLayerGroup, pointLayer],
                view: new View({
                    center: [0,0],
                    zoom: 2,
                    
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
        // mapRef.current.getLayers().getArray()[1]?.getLayers().clear();
        // props.setOpen(true);
        
        if(entities){
            // console.log(entities);

            // mapRef.current.getLayers().getArray()[1].getSource().addFeatures([pointFeature,pointFeature1,pointFeature2]);
            
            // mapRef.current.getLayers().getArray()[1].getSource().addFeature(pointFeature);


            
            // const featureCoordArrs =[] ;
            // state.dxfObject['A0013112'].forEach(feature => {
            //     const featureCoordArr =[] ;

            //     feature.vertices.forEach(coord=>{
            //         featureCoordArr.push([coord.x, coord.y]);
            //     })
            //     featureCoordArrs.push(featureCoordArr)
                
            // });
            // const newFeature = new Feature({
            //     geometry: new MultiLineString(featureCoordArrs),
            //     name : 'test1'
            // });

            // mapRef.current.getLayers().getArray()[1].getSource().addFeature(newFeature);
            Object.keys(entities).forEach(key => { // 레이어 뽑기
                

                // const obj = {};
                // obj.layer = key;
                // obj.features = [];
                // const geometryType = checkGeometryType(state.dxfObject[key]);
                // obj.geometry_type = geometryType;
                const layerCoordArr =[] ; // 피쳐컬렉션 [[[x,y],[x,y],[x,y],[]],[]]
                let _geometry;
                let type;
                let pol_chk =true; // cad파일의 구성이 폴리곤이 없기때문에 lineString이 polygon인지 아닌지 체크하기 위해 사용
                // lineStringg중에서 시작점과 끝점이 같으면 polygon? F0017111 경우에는 line+polygin 섞여있는데 이런경우에는?
                entities[key].forEach(feature => { // 피쳐 뽑기
                    
                    if(feature.type==='POINT' || feature.type==='TEXT' ||feature.type==='CIRCLE' ||feature.type==='INSERT'){
                        if(feature.position){
                            layerCoordArr.push(proj4(coordSys, 'EPSG:3857',[feature.position.x,feature.position.y]))
                        }else if(feature.endPoint){
                            
                            layerCoordArr.push(proj4(coordSys, 'EPSG:3857',[feature.endPoint.x,feature.endPoint.y]))
                        }
                        type = 'MultiPoint'
                        // _geometry = new MultiPoint(layerCoordArr)

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
                        // _geometry = new MultiLineString(layerCoordArr)
                        
                        
                    }else if(feature.type==='POLYGON' || feature.type==='LWPOLYGON'){
                        
                        type = 'MultiPolygon'
                    }                    
                })

                
                if(type === 'MultiPoint'){
                    _geometry = new MultiPoint(layerCoordArr)
                }else if(type === 'MultiLineString'){
                    
                    if(pol_chk){
                        _geometry = new MultiPolygon([layerCoordArr]);
                        
                    }else{
                        _geometry = new MultiLineString(layerCoordArr);
                    }
                }else if(type === 'MultiPolygon'){
                    _geometry = new MultiPolygon(layerCoordArr);
                }

                
                
                // Object.prototype.hasOwnProperty() 사용하여 key 값이 있는지 확인하고 이를 분기로 있을경우 속성 받고 없을경우 name:key, color:black ??
                // layer에 있는 color값이 10진이기 때문에 16진으로 변환후 적용이 필요ㅎ마

                // if(state.layers.hasOwnProperty(key)){
                
                const color = '#'+layers[key].color.toString(16).padStart(6,0);
                
                const newLayer = new VectorLayer({
                    id: key,
                    imageRatio: 2,
                    source: new VectorSource({
                        format: new GeoJSON(),
                    })
                })

                // entities[key][0].type 를 통해 타입 읽고 이를 MULTIPOINT, MULTILINESTRING, MULTIPOLYGON 으로 변경 필요
                // polygon도 type은 POLYLINE, LWPOLYLINE 로 올탠데? ex C0062243 => 가능한것만 바꾸는 걸로


                const newFeature = new Feature({
                    geometry: _geometry, 
                    name : key, 
                                
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

            mapRef.current.getView().fit(extent, mapRef.current.getSize());
            mapRef.current.getView().setZoom(mapRef.current.getView().getZoom() - 1);
         
            
        }
        
        
    },[file, coordSys])

    // useEffect(()=>{

    //     const pointFeature = new Feature({
    //         geometry: new Point([0, 0]),
    //         name : 'test'
    //     });


    // },[mapRef])
    // useEffect(() => {
    //     if(props.state.dxfObject) {

    //         /**
    //          * 1. dxfObject에서 
    //          */





    //         // const coordArr = [];
    //         // props.state.dxfObject.entities[0].vertices.forEach(ele => { // object형태의 좌표값을 배열 형태로 변경
    //         //     coordArr.push([ele.x,ele.y]);
    //         // });


            

    //     //     props.state.dxfObject.entities.forEach(ele => {

    //     //     });

    //     // const writer = new GeoJSONWriter();  // jsts install 필요
    //     // const geoJson = new GeoJSON();

    //     // const newFeature = new Feature(geoJson.readGeometry(writer.write(coordArr)));
    //     // mapRef.current.getLayers().getArray()[1].getSource().addFeature(newFeature);

    //     }
    // },[props.state.dxfObject])
    return(
        <div id='map' />
    )
}

export default Map; 