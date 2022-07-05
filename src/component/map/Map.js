import { useContext, useEffect, useRef } from 'react';
import 'ol/ol.css';
import olMap from 'ol/Map';
import { Vector as VectorSource, OSM as OSMSource } from 'ol/source';
import { Vector as VectorLayer, VectorImage as VectorImageLayer, Tile as TileLayer } from 'ol/layer';
import { Feature } from 'ol';
import { transform } from 'ol/proj';
import { GeoJSON } from 'ol/format';
import { MultiLineString,MultiPoint,MultiPolygon, Point } from 'ol/geom';

// import { GeoJSONWriter } from 'jsts/org/locationtech/jts/io';

import View from 'ol/View';
import './Map.css';
import { Fill, Stroke, Style } from 'ol/style';
import { useTabContext } from '@mui/base';
import { DxfContext } from '../../common/context/DxfContext';
import { checkGeometryType } from '../../common/header/GeometryType';
import proj4 from 'proj4';
import CircleStyle from 'ol/style/Circle';



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
    proj4.defs([
        [
           'EPSG:4326',
           '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
        ],
        [
           'EPSG:3857',
           '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
        ],
        [
           'EPSG:5173',
           '+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
        ],
        [
           'EPSG:5174',
           '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs' // 전라남도_담양군_고서면_산덕리_산19_28.dxf
        ],
        [
           'EPSG:5175',
           '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs'
        ],
        [
           'EPSG:5176',
           '+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
        ],
        [
           'EPSG:5177',
           '+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
        ],
        [
           'EPSG:5178',
           '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs'
        ],
        [
           'EPSG:5179',
           '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5180',
           '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5181',
           '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5182',
           '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5183',
           '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5184',
           '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5185',
           '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5186',
           '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs' // 수치지도_377074.dxf
        ],
        [
           'EPSG:5187',
           '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ],
        [
           'EPSG:5188',
           '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        ]
     ]);

    //  const pointFeature = new Feature({ // 5174?
    //         geometry: new Point(proj4('EPSG:5174', 'EPSG:3857',[294901.705,226626.314])),
    //         name : 'test'
    //     });

    
    

    useEffect(() => {
        if(!mapRef.current) { 
            const osmLyr = new TileLayer({
                source: new OSMSource(),
            });

            const style = [
                new Style({
                    fill: new Fill({
                    color: '#eeeeee',
                    }),
                }),
                new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        width:6,
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
                // background: '#1a2b39',
                imageRatio: 2,
                source: new VectorSource({
                    // url: 'https://openlayers.org/data/vector/ecoregions.json',
                    format: new GeoJSON(),
                }),
                style: function (feature) {
                    // const color = feature.get('COLOR') || '#eeeeee';
                    // style.getFill().setColor(color);
                    
                    return style;
                }
            })

            

            mapRef.current = new olMap({
                target: 'map',
                layers: [osmLyr, vectorLayer],
                view: new View({
                    center: [0,0],
                    
                    zoom: 7,
                    
                    
                    // projection: 'EPSG:4326',
                }),
            })

            

            
            


        }
    }, [mapRef])

    useEffect(()=>{
        
        if(state.dxfObject){
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



            Object.keys(state.dxfObject).forEach(key => { // 레이어 뽑기
                // const obj = {};
                // obj.layer = key;
                // obj.features = [];
                // const geometryType = checkGeometryType(state.dxfObject[key]);
                // obj.geometry_type = geometryType;
                const layerCoordArr =[] ; // 피쳐컬렉션 [[[x,y],[x,y],[x,y],[]],[]]
                state.dxfObject[key].forEach(feature => { // 피쳐 뽑기

                    if(!feature.vertices) {
                        
                    } else {
                        // state.dxfObject[key].forEach(feature => {
                        const featureCoordArr =[] ; // 피쳐

                        feature.vertices.forEach(coord=>{
                            featureCoordArr.push(proj4('EPSG:5186', 'EPSG:3857',[coord.x, coord.y]));
                            
                        })
                        layerCoordArr.push(featureCoordArr)
                            
                        // });
                    }
                    
                    
                })
                const newFeature = new Feature({
                    geometry: new MultiLineString(layerCoordArr),

                    name : 'test1'
                });
                mapRef.current.getLayers().getArray()[1].getSource().addFeatures([newFeature]);
                
            })
            console.log(mapRef.current.getLayers().getArray()[1].getSource().getFeatures());
            const extent = mapRef.current.getLayers().getArray()[1].getSource().getExtent();
            mapRef.current.getView().fit(extent, mapRef.current.getSize());
            mapRef.current.getView().setZoom(mapRef.current.getView().getZoom() - 1);
            debugger;
        }
    },[state.dxfObject])

    // useEffect(()=>{

    //     const pointFeature = new Feature({
    //         geometry: new Point([0, 0]),
    //         name : 'test'
    //     });

    //     debugger;
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