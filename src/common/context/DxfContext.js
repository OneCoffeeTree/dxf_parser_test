import { createContext, useState } from 'react';

const DxfContext = createContext({
    map: null,
    entities: null,
    layers: null,
    file: null,
    coordSys: null,
});

const DxfProvider = ({ children }) => {
    const [map, setMap] = useState(null);
    const [entities, setEntities] = useState(null);
    const [layers, setLayers] = useState(null);
    const [file, setFile] = useState(null);
    const [coordSys, setCoordSys] = useState(null);

    const getMap = () => {
        return map;
    }


    const getEntities = () => {
        return entities;
    }


    const getLayers = () => {
        return layers;
    }


    const getFile = () => {
        return file;
    }


    const getCoordSys = () => {
        return coordSys;
    }

    return (
        <DxfContext.Provider
            value={{
                map,
                entities,
                layers,
                file,
                coordSys,

                setMap,
                getMap,

                setEntities,
                getEntities,

                setLayers,
                getLayers,
                
                setFile,
                getFile,

                setCoordSys,
                getCoordSys,
            }}
        >
            {children}
        </DxfContext.Provider>
    )
}

export { DxfContext, DxfProvider }