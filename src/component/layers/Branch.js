import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Radio, RadioGroup } from "@mui/material";
import { useContext, useEffect } from "react";
import { DxfContext } from "../../common/context/DxfContext";


function Branch() {
    const { state, setState } = useContext(DxfContext);

    useEffect(()=>{
        if(state.layers){
            Object.keys(state.layers).forEach(key=>{
                console.log(key)
            })
        }
        
    },[state.layers])

    return(
        <>
            <div>
                <ul>
                {   //
                    state.layers ? 
                        Object.keys(state.layers).map(ele=>{
                            return <li>{ele}</li>
                        })
                        :
                        <li></li>
                }   
                </ul>

                <RadioGroup>
                    
                </RadioGroup>
            </div>
        
            
        </>
        
    )
}

export default Branch;