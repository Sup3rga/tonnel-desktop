import WithinSearch from "../layout/withinsearch";
import {useEffect, useState} from "react";
import State from "../lib/stater";
import MusicItem from "../components/musicitem";
import { Library } from "../ext/library";
import InfiniteScrolView from "../layout/infinitescrollview";
import { MusicItemList } from "../components/itemlist";

const {bridge : {fetchLibrary, exchange} } = window;

export default function Explore({
    style = {}
}){
    const [state] = State.init("exp", useState({
        list: []
    })).get("exp");
    
    useEffect(()=>{
        console.log('[Fetch...]');
        Library.all().then((list)=>{
            // console.log('[List]',list);
            State.set("exp", {list});
        }).catch((err)=>{
            console.log('[Err]',err);
        })
    }, []);

    return (
        <WithinSearch title="Explore" style={style} searchContentProvider={(val,anyBound)=>{
            return (
                <InfiniteScrolView
                    data={Library.searchSongByKey(val,anyBound)}
                    limit={10}
                    name="song-search"
                    render={(album, key)=>{
                        return (
                            <MusicItemList key={key} {...album}/>
                        )
                    }}
                />
            );
        }}>
            <InfiniteScrolView
                data={state.list}
                limit={20}
                sortFactor="title"
                name="library-explorer"
                grouped={true}
                render={(song, key)=>{
                    return (
                        <MusicItem className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" key={key} {...song}/>
                    )
                }}
            />
        </WithinSearch>
    )
}