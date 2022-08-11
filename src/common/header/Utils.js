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
    // console.log(entities);
    // console.log(layers);
    

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


export {
    groupByLayer,
    getLayers,
}