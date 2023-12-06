import { useState } from "react";
import LineTimer from "./line-timer";
import Popup from "./popup";


export default function EqualizerBox({
    open = false,
    onClose = ()=>{}
}){
    const [inputs, setInputs] = useState([
        0,0,0,0,0,0,0,0,0,0
    ])
    return (
        <Popup className="ui-size-6 equalizer-box" name="equalizer" open={open}>
            <h1>Equalizer</h1>
            <div className="ui-container ui-size-fluid inputs-wrapper ui-row ui-horizontal-center">
                {
                    inputs.map((val,key)=>(
                        <div className="ui-container ui-size-1 wrapper ui-horizontal-center">
                            <LineTimer horizontal={false} progression={val * 100} onChange={(pos)=>{
                                console.log('[Pos]',pos);
                                inputs[key] = pos;
                                setInputs([...inputs]);
                            }}/>   
                        </div>
                    ))
                }
            </div>
            <div className="ui-container ui-size-fluid actions ui-horizontal-right">
                <button onClick={onClose}>Close</button>
            </div>
        </Popup>
    )
}