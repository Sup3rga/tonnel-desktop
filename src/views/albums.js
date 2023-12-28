import {useState, useEffect} from "react";
import State from "../lib/stater";
import WithinSearch from "../layout/withinsearch";
import AlbumItem from "../components/albumitem";
import { AlbumItemList } from "../components/itemlist";
import InfiniteScrolView from "../layout/infinitescrollview";
import { Library } from "../ext/library";
import {exchange} from "../ext/bridge";

export default function Albums({style}){
    const [state] = State.init("albums", useState({
        list: []
    })).get("albums");
    const refresh = ()=>{
        Library.albumlist()
        .then((list)=>{
            State.set("albums", {list})
        })
        .catch((err)=>console.log('[ERR]',err))
    }

    useEffect(()=>{
        refresh();
        exchange.on("albums-update", ()=>{
            console.log('[Updating albums list]')
            refresh();
        });
    }, []);

    return (
        <WithinSearch style={style} title="Albums" searchContentProvider={async (value,anyBound)=>{
            return (
                <InfiniteScrolView
                    data={Library.searchAlbumsByKey(value,anyBound)}
                    limit={10}
                    name="album-search"
                    render={(album, key)=>{
                        return (
                            <AlbumItemList key={key} {...album}/>
                        )
                    }}
                />
            );
        }}>
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