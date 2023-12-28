import { useEffect,useState } from "react";
import AlbumItem from "../components/albumitem";
import Appbar from "../components/appbar";
import Icon from "../components/icon";
import { MusicItemList } from "../components/itemlist";
import ScrollWrapper from "../components/scrollwrapper";
import { Library } from "../ext/library";
import InfiniteScrolView from "../layout/infinitescrollview";
import State from "../lib/stater";
import {exchange} from "../ext/bridge";


export default function ArtistInfo({
    style={},
    avatar = null,
    name= "",
    list= [],
    albums = [],
    suggestions = []
}){
    const [state] = State.init("artist-info", useState({
        loaded : false,
        albums: [],
        suggestions: []
    })).get("artist-info");

    const refresh = (list)=>{
        const albums = Library.extractArtistAlbums(list);
        const suggestions = Library.getByPaths(list.slice(0, 5));
        State.set("artist-info", {suggestions,albums, loaded: true});
    }

    useEffect(()=>{
        Library.albumlist().then(()=>{
            refresh(list);
        }).catch((err)=> console.log('[Err]',err));

        exchange.on("artists-update", (artist)=>{
            if(name === artist){
                refresh(Library.getArtist(name));
            }
        });
    },[]);

    return (
        <div className="ui-container ui-fluid discography" style={style}>
            <Appbar title="" withSearch={false}/>
            <div className="ui-container ui-size-fluid presentation ui-vertical-center">
                {
                    !avatar ? null :
                    <div className="ui-container avatar" style={{backgroundImage: `url(${avatar})`}}/>
                }
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
                <div className="ui-container header-actions ui-vertical-center">
                    <button>
                        <Icon icon="play"/>
                    </button>
                    <button className="min">
                        <Icon icon="shuffle"/>
                    </button>
                </div>
            </div>
            <ScrollWrapper className="disco-content">
                <div className="ui-element ui-size-fluid ui-md-size-7 ui-lg-size-6 selection-music">
                    <div className="ui-container ui-size-fluid heading">We suggest you those...</div>
                    {
                        state.suggestions.map((songs,key)=>(
                            <MusicItemList contextParent={list.slice(0,5)} key={key} {...songs}/>
                        ))
                    }
                </div>
                {
                    !state.albums.length ? null :
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
                }
            </ScrollWrapper>
        </div>
    )
}