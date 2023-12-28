import { useState, useEffect } from "react";
import { Library } from "../ext/library";
import State from "../lib/stater";
import ExposedView from "../layout/exposedview";
import InfiniteScrolView from "../layout/infinitescrollview";
import MusicItem from "../components/musicitem";
import Icon from "../components/icon";
import {exchange} from "../ext/bridge";
import Router from "../components/router";


export default function AlbumInfo({
    style = {},
    albumart = "",
    title = "",
    list = []
}){
    const [{minimal}] = State.init("albuminfo", useState({
        minimal: State.get("app")[0].minimal
    })).get("albuminfo");
    const context = list;
    const [albumList, setAlbumList] = useState( Library.getByPaths(list));

    useEffect(()=>{
        // console.log('[List]',list);
        State.watch("app", ({minimal})=>{
            State.set("albuminfo", {minimal});
        });
        exchange.on("albums-update", (album)=>{
            console.log('[Album Update]', {album, title});
            if(title === album){
                const list = Library.getAlbum(title);
                if(!list.length){
                    return Router.back();
                }
                setAlbumList(list);
            }
        });
    }, []);
    return (
        <ExposedView 
            title={title} 
            wall={albumart} 
            className={["albuminfo", minimal ? "minimal" : ""].join(" ")} 
            style={style}
            wallActions={(
                <div className="ui-container header-actions ui-vertical-center">
                    <button>
                        <Icon icon="play"/>
                    </button>
                    <button className="min">
                        <Icon icon="shuffle"/>
                    </button>
                </div>
            )}
        >
            <div className="ui-element ui-size-8">
                <InfiniteScrolView
                    name="album-content"
                    data={albumList}
                    render={(song, key)=>{
                        if(!song) return null;
                        return (
                            <div className="ui-element ui-size-fluid">
                                <div className="ui-container ui-size-fluid music-row-wrapper ui-vertical-center ui-unwrap">
                                    <label className="ui-container ui-all-center count">{key + 1}</label>
                                    <MusicItem
                                        {...song}
                                        albumartless={true}
                                        cell={false}
                                        contextParent={context}
                                        className="ui-container ui-size-fluid"
                                    />
                                </div>
                            </div>
                        )
                    }}
                />
            </div>
            <div className="ui-container ui-size-4">

            </div>
        </ExposedView>
    )
}