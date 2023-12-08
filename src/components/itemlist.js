import { defaultPlayer } from "../ext/player";
import {memo} from "react";
import { Library } from "../ext/library";
import Router from "./router";

const ItemList = function({
    forwardRef,
    title = "",
    artist = "",
    albumart = null,
    onClick
}){
    return (
        <div className="ui-container ui-size-fluid search-item ui-unwrap ui-vertical-top" ref={forwardRef} onClick={onClick}>
            {albumart ? <div className="ui-container albumart" style={{backgroundImage: `url(${albumart})`}}/> : null}
            <div className={`ui-container info ${albumart ? '' : 'albumartless'}`}>
                <label className="ui-container ui-size-fluid main">{title}</label>
                <label className="ui-container ui-size-fluid second">{artist}</label>
            </div>
        </div>
    )
};

export const AlbumItemList = memo(function({
    forwardRef,
    title = "",
    artist = "",
    albumart = "",
    path = ""
}){
    return (
        <ItemList 
            forwardRef={forwardRef} 
            title={title}
            artist={artist}
            albumart={albumart}
            onClick={async ()=>{
                const data = Library.getAlbum(title);
                Router.push("/album/"+title, data);
            }}
        />
    )
});

export const MusicItemList = memo(function({
    forwardRef,
    title = "",
    artist = "",
    albumart = "",
    path = "",
    contextParent=null
}){
    return (
        <ItemList 
            forwardRef={forwardRef} 
            title={title}
            artist={artist}
            albumart={albumart}
            onClick={async ()=>{
                defaultPlayer.setQueueProvider(!contextParent ? null  : async () => contextParent);
                defaultPlayer.initQueue(path);
                await defaultPlayer.setPath(path);
                defaultPlayer.play();
            }}
        />
    )
});