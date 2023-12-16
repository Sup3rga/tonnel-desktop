import { useState } from "react";
import LineTimer from "./line-timer";
import Popup from "./popup";
import { defaultPlayer, defaultEqualizer } from "../ext/player";
import { alphaNumber, round } from "../ext/bridge";
import { Library } from "../ext/library";


export default function EqualizerBox({
    open = false,
    onClose = ()=>{}
}){
    const [preset, setPreset] = useState(Library.getCurrentPreset());
    const [inputs, setInputs] = useState(Library.getPresetValue(preset));
    const [volume, setVolume] = useState(defaultPlayer.getVolume());
    const presets = Library.getAllPresets();

    return (
        <Popup className="ui-size-7 ui-sm-size-6 ui-md-size-5 ui-lg-size-4 equalizer-box" name="equalizer" open={open}>
            <h1>Equalizer</h1>
            <div className="ui-container ui-size-fluid presets">
                <label className="ui-container">Presets</label>
                <select className="ui-container ui-size-5" value={preset} onChange={({target : {value}})=>{
                    console.log('[Val]',value);
                    setPreset(value);
                    const preset = Library.getPresetValue(value);
                    setInputs(preset);
                    for(const index in preset){
                        defaultEqualizer.getFilter(index).rate(preset[index]);
                    }
                }}>
                    {
                        Object.keys(presets).map((name, key)=>(
                            <option key={key} value={name}>{name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="ui-container ui-size-fluid inputs-wrapper ui-row ui-horizontal-center">
                {
                    inputs.map((val,key)=>{
                        return (
                            <div className="ui-container ui-size-1 wrapper ui-horizontal-center">
                                <LineTimer horizontal={false} progression={val * 100} onChange={(pos)=>{
                                    console.log('[Pos]',pos);
                                    defaultEqualizer.getFilter(key).rate(pos);
                                    // defaultEqualizer.getFilter(key).rate(1 - pos);
                                    inputs[key] = pos;
                                    setInputs([...inputs]);
                                }}/> 
                                <div className="ui-container ui-size-fluid info">
                                    <label className="primary ui-element ui-size-fluid">
                                        {alphaNumber(defaultEqualizer.getFilter(key).getBound())}
                                    </label>
                                    <label className="secondary ui-element ui-size-fluid">
                                        {round(defaultEqualizer.getFilter(key).getGain())}
                                    </label>
                                </div> 
                            </div>
                        )
                    })
                }
            </div>
            <div className="ui-container ui-size-fluid volume-zone">
                <label>Volume</label>
                <div className="ui-container ui-size-fluid">
                    <LineTimer 
                        progression={volume * 100} 
                        onChange={volume => {
                            defaultPlayer.setVolume(volume);
                            setVolume(volume);
                        }}
                    />
                </div>
            </div>
            <div className="ui-container ui-size-fluid actions ui-horizontal-right">
                <button onClick={onClose}>Close</button>
            </div>
        </Popup>
    )
}