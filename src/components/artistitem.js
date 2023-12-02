import { Library } from "../ext/library"
import Icon from "./icon"
import Router from "./router"


export default function ArtistItem({
    forwardRef,
    className = "",
    name = "",
    avatar = "",
    list = [],
    albums = [] 
}){

    return (
        <div className={["ui-container person-item", className].join(" ")} ref={forwardRef} onClick={()=>{
            Router.push("/artist/"+name, Library.getArtist(name));
        }}>
            <div className="ui-container avatar ui-all-center" style={{backgroundImage: `url(${avatar})`}}>
                {avatar ? null :
                    <Icon icon="user"/>
                }
            </div>
            <div className="ui-container ui-column data">
                <label className="ui-container ui-size-fluid ui-text-ellipsis title">{name}</label>
                {!albums ? null :
                <div className="ui-container ui-size-fluid">
                    <label className="ui-container ui-size-fluid alt albums">{`${albums.length} album${albums.length > 1 ? 's' :''}.`}</label>
                </div>
                }
                <div className="ui-container ui-size-fluid">
                    <label className="ui-container ui-size-fluid alt participations">{`${list.length} part${list.length > 1 ? 's' :''}.`}</label>
                </div>
            </div>
        </div>
    )
}