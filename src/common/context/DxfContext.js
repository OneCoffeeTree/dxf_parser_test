import { createContext, useState } from 'react';

const DxfContext = createContext({
    entities: null,
    layers: null,
    file: null,
    coordSys: null,
});

const DxfProvider = ({ children }) => {
    const [state, setState] = useState({
        entities: null,
        file: null,
        coordSys: null,
    });

    const setEntities = (entities) => {
        setState({
            ...state,
            entities
        });
    }

    const getEntities = () => {
        return state.entities;
    }

    const setLayers = (layers) => {
        setState({
            ...state,
            layers
        });
    }

    const getLayers = () => {
        return state.layers;
    }

    const setFile = (file) => {
        setState({
            ...state,
            file
        })
    }

    const getFile = () => {
        return state.file;
    }

    const setCoordSys = (coordSys) => {
        setState({
            ...state,
            coordSys
        })
    }

    const getCoordSys = () => {
        return state.coordSys;
    }

    return (
        <DxfContext.Provider
            value={{
                state,
                setState,

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