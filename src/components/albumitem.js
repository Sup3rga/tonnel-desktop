import {memo} from "react";
import Icon from "./icon";

const AlbumItem = memo(function({
    forwardRef,
    className = "",
    title = "",
    artist = "",
    albumart = "",
    path = ""
}){
    return (
        <div className={"music-item ui-column "+className} ref={forwardRef}
            onClick={async ()=>{
                // console.log('[song]', path)
                // await defaultPlayer.setPath(path);
                // defaultPlayer.play();
                // console.log('Player', State.get("app")[0].player)
            }}
        >
            <div className="ui-container ui-size-fluid album-art ui-all-center" style={{backgroundImage: `url(${albumart})`}}>
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
    )
})

export default AlbumItem;