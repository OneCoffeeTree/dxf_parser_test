import { useContext, useEffect, useRef } from 'react';
import './Map.css';
import 'ol/ol.css';
import { Feature, View } from 'ol';
import olMap from 'ol/Map';
import { Vector as VectorSource, OSM as OSMSource } from 'ol/source';
import { Vector as VectorLayer, VectorImage as VectorImageLayer, Tile as TileLayer } from 'ol/layer';
import { transform } from 'ol/proj';
import { GeoJSON } from 'ol/format';
import { MultiLineString,MultiPoint,MultiPolygon, Point } from 'ol/geom';
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style } from 'ol/style';

import { Select } from 'ol/interaction';

import { click } from 'ol/events/condition';

import { DxfContext } from '../../common/context/DxfContext';
import { proj } from '../../data/proj';

import proj4 from 'proj4';



function Map() {
    
    const { state, setState } = useContext(DxfContext);
    const mapRef = useRef(null);
    // const polygonFeature = new Feature({
    //     geometry: new MultiPolygon(
    //         [[[-3e6, -1e6], [-3e6, 1e6], [-1e6, 1e6], [-1e6, -1e6], [-3e6, -1e6]]]
    //     )
    // });
    
    // const pointFeature1 = new Feature({
    //     geometry: new Point([266182.87,553529.94]),
    //     name : 'test'
    // });
    // const pointFeature2 = new Feature({
    //     geometry: new Point([0.87,0.94]),
    //     name : 'test'
    // });
    // const pointFeature3 = new Feature({
    //     geometry: new MultiLineString([[[259529.7,548137.73],[259508.72,548103.37],[259484.75,548064.24],[259459.45,548028.04],[259442.84,547999.54],[259432.525,547981.886]]]),
    //     name : 'test'
    // });
    

    // const vectorsource = new VectorSource({
    // });
    // vectorsource.addFeatures(polygonFeature,pointFeature);

    // const vectorlayer = new VectorLayer({
    //     source: vectorsource,
    //     style: new Style({
    //         stroke: new Stroke({
    //             width: 3,
    //             color: [255, 0, 0, 1]
    //         }),
    //         fill: new Fill({
    //             color: [0, 0, 255, 0.6]
    //         })
    //     })
    // });

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
            const vectorLayer = new VectorLayer({
                imageRatio: 2,
                source: new VectorSource({
                    format: new GeoJSON(),
                }),
                style: function (feature) {            
                    return style;
                }
            })

            

            mapRef.current = new olMap({
                target: 'map',
                layers: [osmLyr, vectorLayer],
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
                // console.log(e.target.features_.array_);  // 선택시 해당 선택된 피쳐(들) 에 대한 정보 출력
            })
            


            
        }
    }, [mapRef])

    useEffect(()=>{ // 파일이 변경되거나 좌표계가 변경될 시
        mapRef.current.getLayers().getArray()[1].getSource().clear();

        if(state.entities){

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

            

            Object.keys(state.entities).forEach(key => { // 레이어 뽑기
                
                // const obj = {};
                // obj.layer = key;
                // obj.features = [];
                // const geometryType = checkGeometryType(state.dxfObject[key]);
                // obj.geometry_type = geometryType;
                const layerCoordArr =[] ; // 피쳐컬렉션 [[[x,y],[x,y],[x,y],[]],[]]
                state.entities[key].forEach(feature => { // 피쳐 뽑기

                    if(!feature.vertices) {
                        
                    } else {
                        
                        // state.dxfObject[key].forEach(feature => {
                        
                        

                        const featureCoordArr =[] ; // 피쳐
                        feature.vertices.forEach(coord=>{
                            
                            featureCoordArr.push(proj4(state.coordSys, 'EPSG:3857',[coord.x, coord.y]));
                            
                        })
                        layerCoordArr.push(featureCoordArr)
                        
                        // });
                    }
                    
                    
                })
                
                // Object.prototype.hasOwnProperty() 사용하여 key 값이 있는지 확인하고 이를 분기로 있을경우 속성 받고 없을경우 name:key, color:black ??
                // layer에 있는 color값이 10진이기 때문에 16진으로 변환후 적용이 필요ㅎ마

                // if(state.layers.hasOwnProperty(key)){
                
                const color = '#'+state.layers[key].color.toString(16).padStart(6,0);
                
                const newFeature = new Feature({
                    geometry: new MultiLineString(layerCoordArr),
                    name : key, 
                                
                });
                // }
                

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
            


                mapRef.current.getLayers().getArray()[1].getSource().addFeatures([newFeature]);
                
            })
            // console.log(mapRef.current.getLayers().getArray()[1].getSource().getFeatures());
            const extent = mapRef.current.getLayers().getArray()[1].getSource().getExtent();
            mapRef.current.getView().fit(extent, mapRef.current.getSize());
            mapRef.current.getView().setZoom(mapRef.current.getView().getZoom() - 1);

        } 
        
        
        
        
    },[state])

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