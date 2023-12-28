import { useState, useEffect } from "react";
import InfiniteScrolView from "../layout/infinitescrollview";
import WithinSearch from "../layout/withinsearch";
import State from "../lib/stater";
import { Library } from "../ext/library";
import ArtistItem from "../components/artistitem";
import {exchange} from "../ext/bridge";


export default function Artists({style}){
    const [state] = State.init("artists", useState({
        list: []
    })).get("artists");
    const refresh = ()=>{
        Library.artistList()
        .then((list)=>{
            State.set("artists", {list})
        })
        .catch((err)=>console.log('[ERR]',err))
    }

    useEffect(()=>{
        refresh();
        exchange.on("artists-update", (val)=>{
            console.log('[Updating artist list]', val);
            refresh();
        });
    }, []);

    return (
        <WithinSearch style={style} title="Artists">
            <InfiniteScrolView
                data={state.list}
                limit={20}
                name="artist-list"
                sortFactor="name"
                grouped={true}
                render={(artist, key)=>{
                    return <ArtistItem key={key} className="ui-container ui-size-fluid ui-md-size-6 ui-lg-size-3" {...artist}/>
                }}
            />
        </WithinSearch>
    )
}