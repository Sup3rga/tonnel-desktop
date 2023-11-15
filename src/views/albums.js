import {useState, useEffect} from "react";
import State from "../lib/stater";
import WithinSearch from "../components/withinsearch";
import AlbumItem from "../components/albumitem";
import InfiniteScrolView from "../components/infinitescrollview";

export default function Albums({style}){
    const [state] = State.init("albums", useState({
        list: []
    })).get("albums");

    useEffect(()=>{

    }, []);

    return (
        <WithinSearch style={style} title="Albums">
            <InfiniteScrolView
                data={state.list}
                limit={50}
                sortFactor="title"
                grouped={true}
                render={(album, key)=>{
                    return (
                        <AlbumItem className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" {...album}/>
                    )
                }}
            />
        </WithinSearch>
    )
}