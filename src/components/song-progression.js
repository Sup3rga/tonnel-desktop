import { useEffect, useState } from "react";
import { defaultPlayer } from "../ext/player";
import State from "../lib/stater";
import { toTimeString } from "../ext/bridge";
import LineTimer from "./line-timer";


export default function SongProgression({
    name = "music-progress",
    className = "",
    lineColor = null
}){
    const [state] = State.init(name, useState({
        progression : 0,
        elapsed: "00 : 00",
        duration: 0,
        bound: "00 : 00",
    })).get(name);

    useEffect(()=>{
        defaultPlayer.on("progress", (data)=>{
            console.log('[Data]',data);
            State.set(name, {
                elapsed: toTimeString(data.currentTime),
                duration: data.duration,
                bound: toTimeString(data.duration),
                progression: data.progression
            })
        }).on("meta-loaded", ()=>{
            State.set(name, {
                progression: 0,
                elapsed: "00 : 00",
                bound: "00 : 00",
                duration: 0,
            });
        });
    }, []);
    return (
        <div className={["ui-container ui-unwrap time-control ui-vertical-center", className].join(" ")}>
            <label className="ui-container ui-all-center ui-size-3 time ui-unwrap ui-horizontal-right">
                {state.elapsed}
            </label>
            <div className="ui-container ui-all-center ui-size-6 line-container-wrapper">
                <LineTimer 
                    color={lineColor}
                    progression={state.progression}
                    onChange = {(progression)=>{
                        defaultPlayer.seek(state.duration * progression);
                        State.set(name, {
                            progression : state.duration ? progression * 100 : 0,
                            elapsed: toTimeString(state.duration * progression),
                        });
                    }}
                />
            </div>
            <label className="ui-container ui-all-center ui-size-3 time ui-horizontal-left">
                {state.bound}
            </label>
        </div>
    )
}