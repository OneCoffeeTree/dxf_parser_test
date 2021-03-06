import { useContext, useEffect, useRef } from 'react';
import './Map.css';
import 'ol/ol.css';
import { Feature, View } from 'ol';
import olMap from 'ol/Map';
import { Vector as VectorSource, OSM as OSMSource } from 'ol/source';
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


function Map(props) {
    
    const { file, entities, layers, coordSys, setMap, setCoordSys } = useContext(DxfContext);
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
            // const vectorLayer = new VectorLayer({
            //     imageRatio: 2,
            //     source: new VectorSource({
            //         format: new GeoJSON(),
            //     }),
            //     style: function (feature) {            
            //         return style;
            //     }
            // })
            const vectorLayerGroup = new LayerGroup({
                layers: [],
            })
            

            mapRef.current = new olMap({
                target: 'map',
                // layers: [osmLyr, vectorLayer],
                layers: [osmLyr, vectorLayerGroup],
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
                // console.log(e.target.features_.array_);  // ????????? ?????? ????????? ??????(???) ??? ?????? ?????? ??????
            })
            


            
        }

        setMap(mapRef.current);
        setCoordSys(defsData[0][0]);

    }, [])

    useEffect(()=>{ // ????????? ??????????????? ???????????? ????????? ???
        mapRef.current.getLayers().getArray()[1].getLayers().clear();
        // props.setOpen(true);
        
        if(entities){
            

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

            Object.keys(entities).forEach(key => { // ????????? ??????
                
                // const obj = {};
                // obj.layer = key;
                // obj.features = [];
                // const geometryType = checkGeometryType(state.dxfObject[key]);
                // obj.geometry_type = geometryType;
                const layerCoordArr =[] ; // ??????????????? [[[x,y],[x,y],[x,y],[]],[]]

                entities[key].forEach(feature => { // ?????? ??????
                    if(!feature.vertices) {
                        
                    } else {
                        const featureCoordArr =[] ; // ??????
                        feature.vertices.forEach(coord=>{
                            featureCoordArr.push(proj4(coordSys, 'EPSG:3857',[coord.x, coord.y]));
                        })
                        layerCoordArr.push(featureCoordArr)
                    }
                })
                
                // Object.prototype.hasOwnProperty() ???????????? key ?????? ????????? ???????????? ?????? ????????? ???????????? ?????? ?????? ???????????? name:key, color:black ??
                // layer??? ?????? color?????? 10????????? ????????? 16????????? ????????? ????????? ????????????

                // if(state.layers.hasOwnProperty(key)){
                
                const color = '#'+layers[key].color.toString(16).padStart(6,0);
                
                const newLayer = new VectorLayer({
                    id: key,
                    imageRatio: 2,
                    source: new VectorSource({
                        format: new GeoJSON(),
                    })
                })


                const newFeature = new Feature({
                    geometry: new MultiLineString(layerCoordArr),
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
    //          * 1. dxfObject?????? 
    //          */





    //         // const coordArr = [];
    //         // props.state.dxfObject.entities[0].vertices.forEach(ele => { // object????????? ???????????? ?????? ????????? ??????
    //         //     coordArr.push([ele.x,ele.y]);
    //         // });


            

    //     //     props.state.dxfObject.entities.forEach(ele => {

    //     //     });

    //     // const writer = new GeoJSONWriter();  // jsts install ??????
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