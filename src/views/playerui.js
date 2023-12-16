import { useEffect,useState } from "react";
import State from "../lib/stater";
import Icon from "../components/icon";
import ImageTheme from "../lib/imagetheme";
import { defaultPlayer } from "../ext/player";
import { Library } from "../ext/library";
import SongProgression from "../components/song-progression";

const {bridge : {exchange} } = window;

export default function PlayerUI({active = false, parallax = ""}){

    const [state] = State.init("playerui", useState({
        dark: false,
        theme: "unset",
        queue: [],
        current: {}
    })).get("playerui");

    console.log('[Active][PlayerUI]',active, parallax);

    const refresh = ()=>{
        const info = defaultPlayer.getPlayInfo();
        console.log('[Info]',info.current);
        State.set("playerui", {
            current: info.current ? info.current : {},
            queue: Library.getByPaths(info.queue)
        })
    }
    
    useEffect(()=>{
        if(!active){
            exchange.emit("resize", {
                resizable: true,
                restore: true
            });
            return;
        }
        exchange.emit("save-dimension");
        exchange.emit("resize", {
            width: 520,
            height: 540,
            minimal: {
                width: 320,
                height: 400
            },
            maximal: {
                width: 920,
                height: 700
            },
            resizable: true
        })

        State.watch("ui", ({parallax})=>{
            const colors = parallax ? new ImageTheme().setImageDataUrl(parallax).get() : [255,255,255];
            State.set("playerui", {
                theme: `rgb(${colors.join(",")})`
            });
        });

        State.watch("song-start", refresh)
        
    }, [active]);

    useEffect(()=>{
        if(defaultPlayer.isEmpty) return;
        refresh();
    }, []);

    return (
        <div style={{
            opacity : active ? 1 : 0, 
            zIndex : active ? 2 : 1,
            backgroundColor: state.theme
        }} className={`ui-container ui-absolute ui-all-close ui-column ui-vfluid player-ui ${active ? 'drag-zone' : ''} ${state.dark ? 'dark' : ''}`}>
            <div className="ui-container ui-absolute ui-size-fluid header">
                <button>
                    <Icon icon="arrow-left" className="no-drag-zone" onClick={()=> State.set("app", {playerUiActive: false})}/>
                </button>
            </div>
            <div className="ui-container ui-absolute ui-all-close mask">
                <div className="ui-container ui-column ui-fluid ui-all-center main-info">
                    <div className="ui-container albumart ui-all-center" style={{
                        backgroundImage: `url(${state.current.albumart})`
                    }}>
                        {state.current.albumart ? null : 
                            <Icon icon="music-note"/>
                        }
                    </div>
                    <div className="ui-container music-metadata">
                        <label className="ui-container ui-size-fluid title">
                            {state.current.title}
                        </label>
                        <label className="ui-container ui-size-fluid artist">
                            {state.current.artist}
                        </label>
                        <label className="ui-container ui-size-fluid album">
                            {state.current.album}
                        </label>
                    </div>
                    <div className="ui-container ui-size-fluid progression no-drag-zone">
                        <SongProgression lineColor={state.theme} name="song-playui-progress" className="ui-size-fluid"/>
                    </div>
                </div>
            </div>
        </div>
    )
}