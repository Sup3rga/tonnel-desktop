import Icon from "./icon";
import LineTimer from "./line-timer";
import { defaultPlayer } from "../ext/player";
import State from "../lib/stater";
import { useState, useEffect } from "react";
import { toTimeString } from "../ext/bridge";
import EqualizerBox from "./equalizer-box";

export default function PlayerBar({
    floating = false
}){
    const [state] = State.init("playerbar", useState({
        title: "",
        artist: "",
        albumart: null,
        play: false,
        progression : 0,
        elapsed: "00 : 00",
        duration: 0,
        volume : 1,
        bound: "00 : 00",
        equalizerVisible: false,
    })).get("playerbar");

    useEffect(()=>{
        defaultPlayer.on("meta-loaded", (music)=>{
            console.log('[Music]',music);
            State.set("playerbar", {
                title: music.title,
                artist: music.artist,
                albumart: music.albumart,
                progression: 0,
                elapsed: "00 : 00",
                bound: "00 : 00",
                duration: 0,
            });
        })
        .on("progress", (data)=>{
            State.set("playerbar", {
                elapsed: toTimeString(data.currentTime),
                duration: data.duration,
                bound: toTimeString(data.duration),
                progression: data.progression
            });
        })
        .on('play', ()=> State.set("playerbar", {play : true}))
        .on('pause', ()=> State.set("playerbar", {play : false}))
    }, []);

    return (
        <div className={`ui-container control-bar ${floating ? 'floating-bar' : 'ui-size-fluid'}`}>
            <div className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2 ui-unwrap">
                <div className="ui-container album-art ui-all-center ui-all-center" style={{backgroundImage: `url(${state.albumart})`}}>
                    {state.albumart ? null : <Icon icon="music-note"/>}
                </div>
                <div className="ui-container ui-size-8 music-info">
                    <label className="ui-container ui-size-fluid title">{state.title}</label>
                    <label className="ui-container ui-size-fluid artist">{state.artist}</label>
                </div>
            </div>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-1 ui-unwrap ui-vertical-center controls">
                <button onClick={()=>{
                    defaultPlayer.back();
                }}>
                    <Icon mode="line" icon="step-backward"/>
                </button>
                <button onClick={()=>{
                    if(state.play)
                        return defaultPlayer.pause()
                    defaultPlayer.play();
                }}>
                    <Icon icon={`${state.play ? 'pause' : 'play'}`}/>
                </button>
                <button onClick={()=>{
                    defaultPlayer.next();
                }}>
                    <Icon mode="line" icon="step-forward"/>
                </button>
            </div>
            <div className="ui-container ui-size-4 ui-md-size-5 ui-lg-size-8 ui-unwrap time-control ui-vertical-center">
                <label className="ui-container ui-all-center ui-size-3 time ui-unwrap ui-horizontal-right">
                    {state.elapsed}
                </label>
                <div className="ui-container ui-all-center ui-size-6">
                    <LineTimer 
                        progression={state.progression}
                        onChange = {(progression)=>{
                            console.log('[Progression]',progression, state.duration);
                            defaultPlayer.seek(state.duration * progression);
                            State.set("playerbar", {
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
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-1 ui-vertical-center ui-horizontal-right queue-control ui-unwrap">
                <button>
                    <Icon icon="sync"/>
                </button>
                <button>
                    <Icon icon="shuffle"/>
                </button>
                <button className="ui-container" style={{rotate: '90deg'}} onClick={()=>{
                    State.set("playerbar", {equalizerVisible: !state.equalizerVisible})
                }}>
                    <Icon mode="ion" icon="ios-settings-strong"/>
                </button>
            </div>
            <EqualizerBox open={state.equalizerVisible} onClose={()=>{
                 State.set("playerbar", {equalizerVisible: !state.equalizerVisible})
            }}/>
        </div>
    )
}