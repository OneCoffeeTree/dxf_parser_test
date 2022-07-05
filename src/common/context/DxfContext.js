import { createContext, useState } from 'react';

const DxfContext = createContext({
    dxfObject: null,
    file: null,
    coordSys: null,
});

const DxfProvider = ({ children }) => {
    const [state, setState] = useState({
        dxfObject: null,
        file: null,
        coordSys: null,
    });

    const setDxfObject = (dxfObject) => {
        setState({
            ...state,
            dxfObject
        });
    }

    const getDxfObject = () => {
        return state.dxfObject;
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

                setDxfObject,
                getDxfObject,
                
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