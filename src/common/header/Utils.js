const groupByLayer = function dxfObjectGroupByLayer(object) {
    const keys = Object.keys(object.tables.layer.layers);
    const result = {};
    
    keys.forEach(key => {
        result[key] = [];
    });

    object.entities.forEach(entity => {
        result[entity.layer].push(entity);
    }); 

    

    return result;
}


export {
    groupByLayer,
}