import {useState, useEffect} from "react";
import State from "../lib/stater";
import WithinSearch from "../components/withinsearch";
import AlbumItem from "../components/albumitem";
import InfiniteScrolView from "../components/infinitescrollview";
import { Library } from "../ext/library";

export default function Albums({style}){
    const [state] = State.init("albums", useState({
        list: []
    })).get("albums");
    console.log('[Albums] called');
    useEffect(()=>{
        console.log('[Mounted] albums list');
        Library.albumlist()
        .then((list)=>{
            // console.log('[List]',list);
            State.set("albums", {list})
        })
        .catch((err)=>console.log('[ERR]',err))
    }, []);

    return (
        <WithinSearch style={style} title="Albums">
            <InfiniteScrolView
                data={state.list}
                limit={20}
                name="album-list"
                sortFactor="title"
                grouped={true}
                render={(album, key)=>{
                    return (
                        <AlbumItem key={key} className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" {...album}/>
                    )
                }}
            />
        </WithinSearch>
    )
}