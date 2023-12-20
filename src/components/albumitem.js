import {memo} from "react";
import { Library } from "../ext/library";
import Icon from "./icon";
import Router from "./router";
import ResponsiveItem from "./responsiveItem";

const AlbumItem = memo(function({
    forwardRef,
    className = "",
    title = "",
    artist = "",
    albumart = "",
    path = "",
    responsiveness = {}
}){
    const additionnal = 30;
    return (
        <ResponsiveItem responsiveness={responsiveness} additionnal={additionnal} forwardRef={forwardRef}>
            <div className={"music-item ui-column "+className} ref={forwardRef}
                 onClick={async ()=>{
                     const data = Library.getAlbum(title);
                     // console.log('[Data]',data);
                     Router.push("/album/"+title, data);
                     // console.log('[song]', path)
                     // await defaultPlayer.setPath(path);
                     // defaultPlayer.play();
                     // console.log('Player', State.get("app")[0].player)
                 }}
            >
                <div className="ui-container ui-size-fluid album-art ui-all-center" style={{
                    backgroundImage: `url(${albumart})`,
                    height: `calc(100% - ${additionnal + 10}px)`
                }}>
                    {albumart ? null :
                        <Icon icon="music-note"/>
                    }
                </div>
                <div className="ui-container ui-size-fluid info">
                    <label className="ui-container ui-size-fluid title">{title}</label>
                    <div className="ui-container ui-size-fluid">
                        <label className="ui-container ui-size-fluid artist">{artist}</label>
                    </div>
                </div>
            </div>
        </ResponsiveItem>
    )
})

export default AlbumItem;