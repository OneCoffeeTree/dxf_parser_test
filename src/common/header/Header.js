import './Header.css'
import { useEffect, useRef, useContext } from 'react';
import { Button,  Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import DxfParser from "dxf-parser";
import { DxfContext } from '../../common/context/DxfContext';
import { getLayers, groupByLayer } from '../Utils';
import { checkGeometryType } from './GeometryType';
import { defsData } from '../../data/proj';
import { GML, WFS } from 'ol/format';
import axios from 'axios';

import { proj } from '../../data/proj';
import proj4 from 'proj4';


function Header(props) {

    const { setFile, setEntities, setLayers, setCoordSys, getFile, layers, coordSys, getMap } = useContext(DxfContext);
    const fileRef = useRef(null);
    
    proj();
    
    useEffect(() => {

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
            setEntities(null);
            setLayers(null);
            setFile(null);
        } else {
            fileRef.current.click();
        }
    }

    const onClickDownload = () =>{

        const layers_ = getMap().getLayers().getArray()[1].getLayers().getArray();
        // console.log(layers_);
        layers_.forEach( layer_ =>{
            let payload;
            let url;
            // console.log( `${layer_} : ${layer_.values_.type}`);
            const type = layer_.values_.type;
            let featureType;
            
            if(type === 'MultiPoint'){
                featureType = 'dxf_point';
            }else if(type === 'MultiLineString'){
                featureType = 'dxf_line';
            }else if(type === 'MultiPolygon'){
                featureType = 'dxf_polygon';
            }
            const formatWFS = new WFS();
            const formatGML = new GML({
                featureNS : 'demo.com' , // 사용할 작업공간의 네임스페이스 URI?
                featureType ,   // 레이어 이름 (ex. demo:dxf_line 이면 dxf_line 만)
                srsName : coordSys // 좌표계 명칭 
            })
            layer_.getSource().getFeatures()[0].getProperties().geometry.transform('EPSG:3857',coordSys);
            layer_.getSource().getFeatures()[0].setProperties({geom:layer_.getSource().getFeatures()[0].getProperties().geometry}); // 얕은 복사임 나중에 수정 필요
            
            
            // delete layer_.getSource().getFeatures()[0].getProperties().geometry;    // 삭제 안되는 이유?
            
            payload= new XMLSerializer().serializeToString(
                formatWFS.writeTransaction(layer_.getSource().getFeatures(), null, null, formatGML)  // 하나의 레이어에 피쳐를 추가/수정/삭제
                );
                
            console.log(payload);
            // payload = <Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"/>
            // <Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd http://192.168.4.33:9090/geoserver/grp/wfs/DescribeFeatureType?typename=fiware:nyc_buildings"> <Insert> <nyc_buildings> <geometry> <Polygon xmlns="http://www.opengis.net/gml" srsName="EPSG:3857"> <exterior> <LinearRing srsName="EPSG:3857"> <posList>-12682023.77343518 4567060.841291264 -11077457.675672762 2571137.15870874 -9629434.611838378 5819405.112715591 -12682023.77343518 4567060.841291264 </posList> </LinearRing> </exterior> </Polygon> </geometry> <bin>0</bin> </nyc_buildings> </Insert></Transaction>
            url = 'http://localhost:8080/geoserver/wfs/';   // ???
            

            
            
            axios ({    // 형식이 이게 맞는지?
                url,
                method: 'POST',
                dataType: 'xml',
                processData: false,
                data: payload,
                headers:{
                    "Content-Type": 'text/xml',
                    
            },
            }).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err);
            })

            // layer_.getSource().refresh(); 아닌듯

        })
        

    }

    const handleCoordSysSelect = (e) =>{
        setCoordSys(e.target.value);
    }

    const handleFileChange = (e) => {
        
        props.setOpen(true);
        const reader = new FileReader(); 
        // FileReader 로 진행시 운영체제의 기본 한글 인코딩을 기본으로 인식하여 한글 깨짐 => FileReader의 문제가 아니라 readAsBinaryString의 문제
        // readAsBinaryString 에서는 인코딩 타입을 지정 할수 없기때문, readAsText 클래스로 변경후 인코딩 타입을 "windows-949" 로 지정하여 해결
        // 추후 헤더에서 인코딩 타입을 받아 받은 인코딩타입으로 진행 가능 ( 인코딩 종류 적은 콤보박스 + 값 선택시 값 받아서 아래 readAsText에 인코딩 타입 입력? )(좌표계처럼 처리하면 될듯?)

        // reader.readAsBinaryString(e.target.files[0]); 
        reader.readAsText(e.target.files[0],"windows-949"); 

        reader.onloadend = () => {
            const parser = new DxfParser();
            const _dxfObject = parser.parseSync(reader.result); 
            
            delete _dxfObject.blocks; // 사용하는것은 tables, entities
            delete _dxfObject.header;
            
            const result = groupByLayer(_dxfObject)
            
            const _entities = result.entities;
            const _layers = result.layers;
            // const layers = getLayers(_dxfObject);
            
            
            
            
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
            
            setEntities(_entities);
            setLayers(_layers);
            setFile(e.target.files[0]);
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
            <div className='FileInfoDiv' onClick={onClickFileUpload} >{getFile() ? getFile().name : ""}</div>
            <div className='btnDiv' ><Button variant='contained' style={{ backgroundColor: '#009688' }} onClick={onClickFileUpload}>{getFile() ? "파일 수정" : "파일 업로드"}</Button></div>
            <div className='btnDiv' ><Button variant='contained' style={{ backgroundColor: '#009688' }} onClick={onClickDownload}>다운로드</Button></div>
        </header>
    )
}

export default Header;
