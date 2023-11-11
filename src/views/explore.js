import WithinSearch from "../components/withinsearch";
import {useEffect, useState, useRef} from "react";
import State from "../lib/stater";
import Player from "../ext/player";
import MusicItem from "../components/musicitem";
import { storage } from "../ext/bridge";
import { useCallback } from "react";
import { Library } from "../ext/library";
import InfiniteScrolView from "../components/infinitescrollview";

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
        <WithinSearch title="Explore" style={style}>
            <InfiniteScrolView
                data={state.list}
                limit={50}
                sortFactor="title"
                grouped={true}
                render={(song, key)=>{
                    return (
                        <MusicItem className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" {...song}/>
                    )
                }}
            />
        </WithinSearch>
    )
}