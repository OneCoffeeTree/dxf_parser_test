import proj4 from 'proj4';
import { useContext } from 'react';
import { DxfContext } from './context/DxfContext';

const groupByLayer = function dxfObjectGroupByLayer(object, setter) {

    const keys = Object.keys(object.tables.layer.layers);
    const entities = {};
    const layers = JSON.parse(JSON.stringify(object.tables.layer.layers));

    keys.forEach(key => {
        entities[key] = [];
        layers[key].select = true;
    });

    object.entities.forEach(entity => {
        entities[entity.layer].push(entity);
    }); 
    
    

    keys.forEach(key => {
        if(entities[key].length === 0) {
            delete entities[key];
            delete layers[key];
        }
    })

    const result = {
        entities,
        layers,
    };

    return result;
}

const getLayers = (object) =>{
    const layers = object.tables.layer.layers;
    return layers;
}

const getLayerType = function(entities,key) {
    
    
    const layerCoordArr =[]
    let type;
    let polygonChk = true;
    
    
    entities[key].forEach(feature => {
        if(feature.type==='POINT' || feature.type==='TEXT' ||feature.type==='CIRCLE' ||feature.type==='INSERT'){
            
            type = 'MultiPoint'
            

        }else if(feature.type==='POLYLINE' || feature.type==='LWPOLYLINE'){
            if(feature.vertices) {
                const featureCoordArr =[] ; // 피쳐
                feature.vertices.forEach(coord=>{
                    featureCoordArr.push([coord.x, coord.y]);
                })
                

                
                if(featureCoordArr[0][0] !== featureCoordArr[featureCoordArr.length-1][0] && featureCoordArr[0][1] !== featureCoordArr[featureCoordArr.length-1][1]){
                    polygonChk = false;
                }
                
                layerCoordArr.push(featureCoordArr);
            }
            type = 'MultiLineString'
            
            
            
        }else if(feature.type==='POLYGON' || feature.type==='LWPOLYGON'){
            
            type = 'MultiPolygon'
        }    
    })
    if (type === 'MultiLineString' && polygonChk){
        type = 'MultiPolygon';
    }
    
    return type;
}
export {
    groupByLayer,
    getLayers,
    getLayerType,
}