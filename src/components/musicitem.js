import {memo, useState, useEffect} from "react";
import { defaultPlayer } from "../ext/player";
import State from "../lib/stater";
import Icon from "./icon";
import responsive, {defaultResponsivness, defineDimension} from "../lib/responsive";
import ResponsiveItem from "./responsiveItem";

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
    responsiveness= {},
    onRightClick
}){
    const [active, setActive] = useState(defaultPlayer.getCurrentPath() === path);

    useEffect(()=>{
        State.watch("song-start", (songPath)=>{
            setActive(songPath === path);
        });
    }, []);

    const additionnal = 60;

    return (
        <>
            <ResponsiveItem phantom={albumartless} responsiveness={responsiveness} forwardRef={forwardRef} additionnal={additionnal}>
                <div
                    className={`music-item ui-column ${active ? "active" : ""} ${albumartless ? 'albumartless':''} ${cell ? '' : 'row-display'} ${className}`}
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
                            <div
                                className={`ui-container ${cell ? 'ui-size-fluid' : ''} album-art ui-all-center`}
                                style={{
                                    backgroundImage: `url(${albumart})`,
                                    height: `calc(100% - ${additionnal + 10}px)`
                                }}
                            >
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
            </ResponsiveItem>
        </>
    )
})

export default MusicItem;