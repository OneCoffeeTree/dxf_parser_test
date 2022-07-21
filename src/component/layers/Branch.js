import { useContext, useEffect, useState } from "react";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { DxfContext } from "../../common/context/DxfContext";


function Branch() {
    // https://github.com/vagran/dxf-viewer-example-src/blob/master/src/components/LayersList.vue 참고
    
    const { map, layers, setLayers } = useContext(DxfContext);
    const [allCheck, setAllCheck] = useState(true);

    // 각각의 레이어 이름을 받아와서 object로 layer와 체크박스 관리?

    // useEffect(()=>{
    //     if(state.layers){
    //         // console.log(state.layers);
    //         // Object.keys(state.layers).forEach(key=>{
    //         // })
            
            
    //         // console.log(checkedMap);
    //         // setChecked(pre => {
    //         //     checked = setChecked
    //         // }); // ? 조건문 내에서 react hooks 를 호출해서 안되는 것으로 추정..
    //         // console.log(checked);

    //         // console.log(Object.keys(state.layers).length);
    //         // const N = Object.keys(state.layers).length;
    //         // (arr = []).length = N;
    //         // arr.fill(false);
    //         // setChecked(arr);

    //         // 이 useEffect 가 실행되고 나서 다시 렌더링 할 방법?
    //         // checkedMap을 여기서 생성 하지 않고 상위 컴포넌트에서 생성후 props 로 넘기면?
    //         // debugger;

    //     }
        
    // },[state.layers])

    // const handleChange1 = (event) => {
    //     debugger;
    //     setChecked([event.target.checked, event.target.checked]);
    // };

    // const handleChange2 = (event) => {
    //     setChecked([event.target.checked, checked[1]]);
    // };

    // const handleChange3 = (event) => {
    //     setChecked([checked[0], event.target.checked]);
    // };

    // const layerCheckBox =(
    //     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
    //         {
    //             Object.keys(state.layers).map(ele=>{
    //                 console.log(checkedMap.get(ele));
    //                 return (
    //                     <FormControlLabel value={ele} control={<Checkbox checked={checkedMap.get(ele)} />} label={ele} />
    //                 )
    //             })
    //         }
    //     </Box>
    // );

    // useEffect(() => {
    //     if(state.map?.getLayers()?.getArray()[1]) {
    //         console.log(state.map.getLayers().getArray()[1].getLayers().getArray()[0].getVisible());
    //         debugger;
    //     }
    // }, [state.layers])

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
                                <FormControlLabel
                                    key={idx}
                                    value={ele}
                                    control={
                                        <Checkbox
                                            checked={layers[ele].select}
                                            onChange={(e) => handleCheckbox(e)}
                                        />
                                    }
                                    label={ele}
                                />
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