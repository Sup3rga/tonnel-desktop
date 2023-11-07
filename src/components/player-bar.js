import Icon from "./icon";
import LineTimer from "./line-timer";
import { defaultPlayer } from "../ext/player";
import State from "../lib/stater";
import { useState, useEffect } from "react";
import { toTimeString } from "../ext/bridge";

export default function PlayerBar(){
    const [state] = State.init("playerbar", useState({
        title: "",
        artist: "",
        albumart: null,
        play: false,
        progression : 0,
        elapsed: "00 : 00",
        duration: "00 : 00"
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
                duration: "00 : 00"
            });
        })
        .on("progress", (data)=>{
            State.set("playerbar", {
                elapsed: toTimeString(data.currentTime),
                duration: toTimeString(data.duration),
                progression: data.progression
            });
        })
        .on('play', ()=> State.set("playerbar", {play : true}))
        .on('pause', ()=> State.set("playerbar", {play : false}))
    }, []);

    return (
        <div className="ui-container ui-size-fluid ui-fluid-height control-bar">
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
                <button>
                    <Icon icon="step-backward"/>
                </button>
                <button onClick={()=>{
                    if(state.play)
                        return defaultPlayer.pause()
                    defaultPlayer.play();
                }}>
                    <Icon icon={`${state.play ? 'pause' : 'play'}`}/>
                </button>
                <button>
                    <Icon icon="skip-forward"/>
                </button>
            </div>
            <div className="ui-container ui-size-4 ui-md-size-5 ui-lg-size-6 ui-unwrap time-control ui-vertical-center">
                <label className="ui-container ui-all-center ui-size-3 time ui-unwrap ui-horizontal-right">
                    {state.elapsed}
                </label>
                <div className="ui-container ui-all-center ui-size-6">
                    <LineTimer progression={state.progression}/>
                </div>
                <label className="ui-container ui-all-center ui-size-3 time ui-horizontal-left">
                    {state.duration}
                </label>
            </div>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-3 ui-vertical-center queue-control ui-unwrap">
                <button>
                    <Icon icon="sync"/>
                </button>
                <button>
                    <Icon icon="shuffle"/>
                </button>
                <div className="ui-container ui-size-5 ui-all-center ui-unwrap">
                    <button>
                        <Icon icon="volume"/>
                    </button>
                    <div className="ui-container ui-size-7 volume">
                        <LineTimer/>
                    </div>
                </div>
            </div>
        </div>
    )
}