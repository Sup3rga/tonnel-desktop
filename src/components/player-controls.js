import {defaultPlayer} from "../ext/player";
import Icon from "./icon";
import {useEffect, useState} from "react";


export default function PlayerControls(){
    const [play, setPlay] = useState(defaultPlayer.isPlaying());
    useEffect(()=>{
        defaultPlayer.on("play", ()=>{
            setPlay(true);
        })
        defaultPlayer.on("pause", ()=>{
            setPlay(false);
        })
    }, []);
    return (
        <>
            <button className="no-drag-zone" onClick={()=>{
                defaultPlayer.back();
            }}>
                <Icon mode="line" icon="step-backward"/>
            </button>
            <button className="no-drag-zone play" onClick={()=>{
                if(play)
                    return defaultPlayer.pause()
                defaultPlayer.play();
            }}>
                <Icon icon={`${play ? 'pause' : 'play'}`}/>
            </button>
            <button className="no-drag-zone" onClick={()=>{
                defaultPlayer.next();
            }}>
                <Icon mode="line" icon="step-forward"/>
            </button>
        </>
    )
}