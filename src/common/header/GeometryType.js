const geometryObject = {
    multiPoint: {
        type: 'MULTIPOINT',
        case: ['POINT', 'TEXT', 'CIRCLE'],
    },
    multiLineString: {
        type: 'MULTILINESTRING',
        case: ['POLYLINE', 'LWPOLYLINE'],
    },
    multiPolygon: {
        type: 'MULTIPOLYGON',
        case: ['POLYGON', 'LWPOLYGON']
    },
    // INSERT는 어디로
}


const checkGeometryType = (layer) => {
    let type = null;
    
    layer.forEach(feature => {
        if(type === null) {
            type = feature.type
        } else if(type !== feature.type) {
            throw '한 레이어에 속한 피처의 타입이 다릅니다.';
        }
    })

    switch(type) {
        case geometryObject.multiPoint.case.includes(type):
            return geometryObject.multiPoint.type;
        case geometryObject.multiLineString.case.includes(type):
            return geometryObject.multiLineString.type;
        case geometryObject.multiPolygon.case.includes(type):
            return geometryObject.multiPolygon.type;
        default: return undefined;
    }
}

export {
    checkGeometryType,
}