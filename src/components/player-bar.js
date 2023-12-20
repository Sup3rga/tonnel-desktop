import Icon from "./icon";
import { defaultPlayer, PlayerLoop, PlayerQueuing } from "../ext/player";
import State from "../lib/stater";
import { useState, useEffect } from "react";
import EqualizerBox from "./equalizer-box";
import Menu from "./menu";
import responsive from "../lib/responsive";
import SongProgression from "./song-progression";
import PlayerControls from "./player-controls";

const shuffleList = [
    {
        name: "Shuffle",
        icon: <Icon icon="shuffle"/>,
        value: PlayerQueuing.SHUFFLE
    },
    {
        name: "In order",
        icon: <Icon icon="exchange"/>,
        value: PlayerQueuing.ALONG
    },
    {
        name: "Let's mix",
        icon: <Icon icon="analysis"/>,
        value: PlayerQueuing.MIX
    }
]

const loopList = [
    {
        name: "Loop play",
        icon: <Icon icon="sync"/>,
        value: PlayerLoop.ALL
    },
    {
        name: "Single one",
        icon: (
            <div className="ui-element loop-single">
                <Icon icon="sync"/>
                <label>1</label>
            </div>
        ),
        value: PlayerLoop.SINGLE,
    },
    {
        name: "Loopless",
        icon: <Icon icon="arrow-to-right"/>,
        value: PlayerLoop.NONE
    }
]

const searchLoopIndex = value => {
    let index = 0;
    for(index in loopList){
        if(loopList[index].value === value)break;
    }
    return index;
}, searchShuffleIndex = value => {
    let index = 0;
    for(index in shuffleList){
        if(shuffleList[index].value === value) break;
    }
    return index;
}

export default function PlayerBar({
    floating = false
}){
    const [state] = State.init("playerbar", useState({
        title: "",
        artist: "",
        albumart: null,
        play: false,
        volume : 1,
        playingMenu: null,
        shuffleMenu: null,
        shuffleIndex: searchShuffleIndex(defaultPlayer.getQueuing()),
        loopMenu: null,
        loopIndex: searchLoopIndex(defaultPlayer.getLooping()),
        updated: null,
        equalizerVisible: false,
    })).get("playerbar");

    useEffect(()=>{
        responsive(()=>{
            State.set("playerbar", {updated: new Date()});
        })
        defaultPlayer.on("meta-loaded", (music)=>{
            console.log('[Music]',music);
            document.querySelector('title').innerText = music.title;
            State.set("playerbar", {
                title: music.title,
                artist: music.artist,
                albumart: music.albumart
            });
        })
        .on('play', ()=> State.set("playerbar", {play : true}))
        .on('pause', ()=> State.set("playerbar", {play : false}))
    }, []);

    return (
        <div className={`ui-container control-bar ${floating ? 'floating-bar' : 'ui-size-fluid'}`}>
            <Menu
                anchor={state.playingMenu}
                top={-145}
                left={40}
                width={140}
                onClose={()=> State.set("playerbar", {playingMenu: null})}
                origin="0 100%"
                childrenMap={[
                    {icon : <Icon icon="plus"/>, name: "Add to playlist", value: "add"},
                    {icon : <Icon icon="list-ul"/>, name: "See the queue", value: "queue"},
                    {icon: <Icon icon="thumbs-up"/>, name: "Like", value: "like"},
                    {icon: <Icon icon="thumbs-down"/>, name: "Dislike", value: "dislike"}
                ]}
            />
            <div className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2 ui-unwrap" 
                onClick={()=> defaultPlayer.isEmpty() ? null : State.set("app", {playerUiActive: true})}
                onContextMenu={e => defaultPlayer.isEmpty() ? null : State.set("playerbar", {playingMenu: e.target})}
            >
                <div className="ui-container album-art ui-all-center ui-all-center" style={{backgroundImage: `url(${state.albumart})`}}>
                    {state.albumart ? null : <Icon icon="music-note"/>}
                </div>
                <div className="ui-container ui-size-8 music-info">
                    <label className="ui-container ui-size-fluid title">{state.title}</label>
                    <label className="ui-container ui-size-fluid artist">{state.artist}</label>
                </div>
            </div>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-1 ui-unwrap ui-vertical-center controls">
                <PlayerControls/>
            </div>
            <SongProgression name="song-playbar-progress" className="ui-size-4 ui-md-size-5 ui-lg-size-8"/>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-1 ui-vertical-center ui-horizontal-right queue-control ui-unwrap">
                <Menu 
                    top={-145} 
                    left={-60}
                    width={125} 
                    origin = "0 100%"
                    anchor={state.loopMenu} 
                    title="Loop"
                    onClose={()=>State.set("playerbar", {loopMenu: null})}
                    childrenMap = {loopList}
                    onItemSelect={(val)=> {
                        defaultPlayer.setLooping(val);
                        State.set("playerbar", {loopIndex: searchLoopIndex(val), loopMenu: false})
                    }}
                />
                <button 
                    onContextMenu={(e)=>{
                        State.set("playerbar", {loopMenu : e.target})
                    }}
                    onClick={(e)=>{
                        const loopIndex = (state.loopIndex + 1) % loopList.length;
                        State.set("playerbar", {loopIndex})
                        defaultPlayer.setLooping(loopList[loopIndex].value);
                    }}
                >
                    {loopList[state.loopIndex].icon}
                </button>
                <Menu 
                    top={-145} 
                    left={-60}
                    width={120} 
                    origin = "0 100%"
                    anchor={state.shuffleMenu} 
                    title="Shuffle"
                    onClose={()=>State.set("playerbar", {shuffleMenu: null})}
                    childrenMap = {shuffleList}
                    onItemSelect={(val)=> {
                        defaultPlayer.setQueuing(val);
                        State.set("playerbar", {shuffleIndex: searchShuffleIndex(val), shuffleMenu: null})
                    }}
                />
                <button 
                    onContextMenu={(e)=>{
                        State.set("playerbar", {shuffleMenu : e.target})
                    }}
                    onClick={(e)=>{
                        const shuffleIndex = (state.shuffleIndex + 1) % shuffleList.length;
                        State.set("playerbar", {shuffleIndex});
                        defaultPlayer.setQueuing(shuffleList[shuffleIndex].value);
                    }}
                >
                    {shuffleList[state.shuffleIndex].icon}
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