import {memo} from "react";
import Icon from "./icon";

const MusicItem = memo(function({
    forwardRef,
    className = "",
    title = "",
    artist = "",
    album = "",
    albumart = ""
}){
    return (
        <div className={"music-item ui-column "+className} ref={forwardRef}>
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

export default MusicItem;