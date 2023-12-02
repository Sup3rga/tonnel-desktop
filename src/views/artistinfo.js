import { useEffect,useState } from "react";
import AlbumItem from "../components/albumitem";
import Appbar from "../components/appbar";
import { MusicItemList } from "../components/itemlist";
import ScrollWrapper from "../components/scrollwrapper";
import { Library } from "../ext/library";
import InfiniteScrolView from "../layout/infinitescrollview";
import State from "../lib/stater";


export default function ArtistInfo({
    style={},
    avatar = null,
    name= "",
    list= []
}){
    const [state] = State.init("artist-info", useState({
        loaded : false,
        albums: [],
        suggestions: []
    })).get("artist-info");
    useEffect(()=>{
        Library.extractArtistAlbums(list).then(albums => {
            const suggestions = Library.getByPaths(list.slice(0, 5));
            State.set("artist-info", {suggestions,albums, loaded: true});
        }).catch(err => console.log('[error]',err));
    },[]);
    return (
        <div className="ui-container ui-fluid discography" style={style}>
            <Appbar title="" withSearch={false}/>
            <div className="ui-container ui-size-fluid presentation ui-vertical-center">
                <div className="ui-container avatar" style={{backgroundImage: `url(${avatar})`}}/>
                <div className="ui-container info">
                    <label className="ui-container ui-size-fluid name">{name}</label>
                    <div className="ui-container ui-size-fluid meta ui-vertical-center">
                        {!state.loaded ? null :
                        <>
                            <label className="ui-container">{`${state.albums.length} album${state.albums.length > 1 ? 's': ''}`}</label>
                            <div className="dot"/>
                        </>
                        }
                        <label className="ui-container">{`${list.length} song${list.length > 1 ? 's': ''}`}</label>
                    </div>
                </div>
            </div>
            <ScrollWrapper className="disco-content">
                <div className="ui-element ui-size-fluid selection-music">
                    <div className="ui-container ui-size-fluid heading">We suggest you those...</div>
                    {
                        state.suggestions.map((songs,key)=>(
                            <MusicItemList contextParent={list.slice(0,5)} key={key} {...songs}/>
                        ))
                    }
                </div>
                <div className="ui-container ui-size-fluid disco">
                    <div className="ui-container ui-size-fluid heading">Discography</div>
                    <div className="ui-container ui-size-fluid">
                        <InfiniteScrolView
                            data={state.albums}
                            limit={20}
                            name="artist-album-list"
                            render={(album, key)=>{
                                return (
                                    <AlbumItem key={key} className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" {...album}/>
                                )
                            }}
                        />
                    </div>
                </div>
            </ScrollWrapper>
        </div>
    )
}