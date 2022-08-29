import { useContext, useEffect, useState } from "react";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { DxfContext } from "../../common/context/DxfContext";
import './Branch.css';
import { getLayerType } from "../../common/Utils";


function Branch() {
    // https://github.com/vagran/dxf-viewer-example-src/blob/master/src/components/LayersList.vue 참고
    
    const { map, layers, entities, setLayers } = useContext(DxfContext);
    const [allCheck, setAllCheck] = useState(true);

    // 각각의 레이어 이름을 받아와서 object로 layer와 체크박스 관리?

    

    const handleCheckbox = (event) => {
        /**
         * 목표. 체크박스 토글 시, 해당 레이어 그룹을 openlayers 레이어 컨트롤해서 레이어 visible 컨트롤
         * 1. 체크박스 만들기, 선택된 체크박스의 상태와 고유값을 알 수 있음
         * 2. 누르면 ol맵에서 해당 레이어 찾아서 토글, 여기까지 성공
         * 3. all버튼
         */
        // console.log(state);
        const targetCheckValue = event.currentTarget.checked;
        const uniqueKey = event.currentTarget.value;

        let keyIndex;
        
        map.getLayers().getArray()[1].getLayers().getArray().forEach((_layer, index) => {
            if(_layer.values_.id === uniqueKey) {
                keyIndex = index;
            }
        });

        map.getLayers().getArray()[1].getLayers().getArray()[keyIndex].setVisible(targetCheckValue);

        const _layers = { ...layers };
        _layers[uniqueKey].select = targetCheckValue;
        setLayers(_layers);

        if(!targetCheckValue & allCheck) { // false 2번 , 1번케이스때 allCheck = false, 2번케이스때 false;
            setAllCheck(prev => {
                if(targetCheckValue !== prev) {
                    return targetCheckValue;
                } 
                else {
                    return prev;
                }
            });
        }

    }

    const handleCheckAll = (event) => {
        const allCheckValue = event.currentTarget.checked;
        const _layers = { ...layers };
        Object.keys(_layers).forEach($ => _layers[$].select = allCheckValue);
        setAllCheck(allCheckValue);
        map.getLayers().getArray()[1].getLayers().getArray().forEach(_layer => _layer.setVisible(allCheckValue));
    }

    const layerLabel = (ele) => { // 타입을 받을 방법?

        const type = getLayerType(entities,ele);
        let thumnail;
        if(type === 'MultiPoint'){
            thumnail = '/img/w_point.png';
        }else if(type === 'MultiLineString'){
            thumnail = '/img/w_linestring.png';
        }else if(type === 'MultiPolygon'){
            thumnail = '/img/w_polygon.png';
        }
        const color = '#'+layers[ele].color.toString(16).padStart(6,0);
        return (
            <div className="labelBox">
                <div className="ColorBox" style={{ backgroundColor: color }} />
                
                <div className="thumnailBox" style={{ backgroundImage : `url(${process.env.PUBLIC_URL + thumnail})` }}></div>
                <Typography variant="caption">{ele}</Typography>
            </div>
        )
    }

    return(
        <>
            <FormGroup className="">
                {
                    layers &&
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={allCheck}
                                onChange={handleCheckAll}
                            />
                        }
                        label='all'
                    />
                }
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {   
                
                layers ? 
                        Object.keys(layers).map((ele, idx)=>{
                            return (
                                <>
                                    <FormControlLabel
                                        className="formControlLabelLayout"
                                        key={ele}
                                        value={ele}
                                        control={
                                            <Checkbox
                                                checked={layers[ele].select}
                                                onChange={(e) => handleCheckbox(e)}
                                            />
                                        }
                                        label={
                                            layerLabel(ele)
                                        }
                                    />
                                </>
                            )
                        })
                        : <Typography variant="subtitle2">레이어 없음</Typography>
                }   

                </Box>
            </FormGroup>
                        

            
        </>
        
    )
}

export default Branch;