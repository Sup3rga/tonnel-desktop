import { useState, useEffect } from "react";
import { Library } from "../ext/library";
import State from "../lib/stater";
import ExposedView from "../components/exposedview";
import InfiniteScrolView from "../components/infinitescrollview";
import MusicItem from "../components/musicitem";


export default function AlbumInfo({
    style = {},
    albumart = "",
    title = "",
    list = []
}){
    const [{minimal}] = State.init("albuminfo", useState({
        minimal: State.get("app")[0].minimal
    })).get("albuminfo");
    const context = [];
    // console.log('[BeforeList]',list);
    list = Library.getByPaths(list);
    for(let song of list){
        context.push(song.path);
    }

    useEffect(()=>{
        // console.log('[List]',list);
        State.watch("app", ({minimal})=>{
            State.set("albuminfo", {minimal});
        })
    }, []);
    return (
        <ExposedView title={title} wall={albumart} className={["albuminfo", minimal ? "minimal" : ""].join(" ")} style={style}>
            <div className="ui-element ui-size-8">
                <InfiniteScrolView
                    name="album-content"
                    data={list}
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