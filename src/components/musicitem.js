import {memo, useState, useEffect} from "react";
import { defaultPlayer } from "../ext/player";
import State from "../lib/stater";
import Icon from "./icon";

const MusicItem = memo(function({
    forwardRef,
    className = "",
    title = "",
    artist = "",
    albumart = "",
    path = "",
    cell = true,
    albumartless = false,
    contextParent = null,
    onRightClick
}){
    const [active, setActive] = useState(defaultPlayer.getCurrentPath() === path);
    const [contextMenu, setContextMenu] = useState(null);
    useEffect(()=>{
        State.watch("song-start", (songPath)=>{
            setActive(songPath === path);
        })
    }, []);
    return (
        <>
            <div className={`music-item ui-column ${active ? "active" : ""} ${albumartless ? 'albumartless':''} ${cell ? '' : 'row-display'} ${className}`} ref={forwardRef}
                onClick={async (e)=>{
                    defaultPlayer.setQueueProvider(!contextParent ? null  : async () => contextParent);
                    defaultPlayer.initQueue(path);
                    await defaultPlayer.setPath(path);
                    defaultPlayer.play();
                    // console.log('Player', State.get("app")[0].player)
                }}
                onContextMenu={(e)=>onRightClick ? onRightClick(e.target) : null}
            >
                {
                    !cell && albumartless ? null :
                    <div className={`ui-container ${cell ? 'ui-size-fluid' : ''} album-art ui-all-center`} style={{backgroundImage: `url(${albumart})`}}>
                        {albumart ? null :
                            <Icon icon="music-note"/>
                        }
                    </div>
                }
                <div className={`ui-container ${cell ? 'ui-size-fluid' : ''} info`}>
                    <label className="ui-container ui-size-fluid title">{title}</label>
                    <div className="ui-container ui-size-fluid">
                        <label className="ui-container ui-size-fluid artist">{artist}</label>
                    </div>
                </div>
            </div>
        </>
    )
})

export default MusicItem;