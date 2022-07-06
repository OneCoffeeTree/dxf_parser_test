import './Header.css'
import { useEffect, useRef, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import DxfParser from "dxf-parser";
import { DxfContext } from '../../common/context/DxfContext';
import { groupByLayer } from './Utils';
import { checkGeometryType } from './GeometryType';
import { defsData } from '../../data/proj';


function Header(props) {

    const { state, setState } = useContext(DxfContext);
    const fileRef = useRef(null);
    
    useEffect(() => {
        
        setState({
            ...state,
            coordSys : defsData[0][0],
        })

        if(!fileRef.current) {
            fileRef.current = document.querySelector('#dxf_parser');
        }

        return () => {
            fileRef.current = null;
        }
    }, [])

    const onClickFileUpload = () => {
        if(!!fileRef.current.value) {
            fileRef.current.value = null;
            setState({
                ...state,
                file: null,
                dxfObject: null,
            })
        } else {
            fileRef.current.click();
        }
    }

    const handleCoordSysSelect = (e) =>{
        setState({
            ...state,
            coordSys: e.target.value,
        });
    }

    const handleFileChange = (e) => {
        
        props.setOpen(true);
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]); 
        reader.onloadend = () => {
            const parser = new DxfParser();
            const _dxfObject = parser.parseSync(reader.result);
            debugger;
            delete _dxfObject.blocks; // 사용하는것은 tables, entities
            delete _dxfObject.header;

            const dxfObject = groupByLayer(_dxfObject);

            
            
            /**
             * 1. dxfObject key가 레이어 1개
             * 2. 레이어 배열 하나가 모여서 피쳐컬렉션이 됨
             * 3. vertices는 geometry, 나머지는 속성값으로
             * 4. vertices 시작과 끝이 같은 경우, 폴리곤 취급을 한다. 이것에 대한 판단 필요
             * 5. text는 라벨이라서 포인트로, insert는 ??
             * 6. 각각의 dxfObject를 순환하면서 
             */

            // Object.keys(dxfObject).forEach(key => {
            //     const obj = {};
            //     obj.layer = key;
            //     obj.features = [];
            //     const geometryType = checkGeometryType(dxfObject[key]);
            //     obj.geometry_type = geometryType;
            //     dxfObject[key].forEach(feature => {
            //         if(!feature.vertices) {
                        
            //         } else if(feature.vertices.length === 1) {
                        
            //         } else if(feature.vertices.length > 1) {

            //         }
            //     })
            // })
            

            setState({
                ...state,
                dxfObject,
                file: e.target.files[0],
            });
            props.setOpen(false);
        }
    }

    

    return(
        <header className='Header'>
            <Typography variant='h5' className='Title'>DXF viewer</Typography>
            
            <select className="CoordSys" onChange={handleCoordSysSelect}>
                {
                    defsData.map(ele => (
                        <option key={ele[0]} value={ele[0]}>{ele[0]}</option>
                    ))   
                }
            </select>
            
            <Icon fontSize='small' className='FolderIcon'>folder</Icon>
            <input type='file' id='dxf_parser' onChange={handleFileChange} accept='.dxf'/>
            <div className='FileInfoDiv' onClick={onClickFileUpload} >{state.file ? state.file.name : ""}</div>
            <Button variant='contained' style={{ backgroundColor: '#009688' }} onClick={onClickFileUpload}>{state.file ? "파일 수정" : "파일 업로드"}</Button>

        </header>
    )
}

export default Header;