import WithinSearch from "../layout/withinsearch";
import {useEffect, useState} from "react";
import State from "../lib/stater";
import MusicItem from "../components/musicitem";
import { Library } from "../ext/library";
import InfiniteScrolView from "../layout/infinitescrollview";
import { MusicItemList } from "../components/itemlist";
import Menu from "../components/menu";
import Icon from "../components/icon";
import Router from "../components/router";

const {bridge : {fetchLibrary, exchange} } = window;

export default function Explore({
    style = {}
}){
    const [state] = State.init("exp", useState({
        list: [],
        currentItem: null,
        currentItemData: {}
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
                        <MusicItem 
                            className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" 
                            key={key} 
                            {...song}
                            onRightClick={(currentItem)=>{
                                console.log('[Set]')
                                State.set("exp", {
                                    currentItem,
                                    currentItemData: {
                                        path: song.path,
                                        album: song.album,
                                        artist: song.artist
                                    }
                                });
                            }}
                        />
                    )
                }}
            />
            <Menu
                anchor={state.currentItem}
                width={150}
                top={50}
                left={20}
                childrenMap={[
                    {name: "Add to playlist", value: state.currentItemData.path, icon : <Icon icon="plus"/>},
                    {name: "Edit tags", value: state.currentItemData.path, icon: <Icon icon="tag-alt"/>},
                    {name: "See artist", value: state.currentItemData.artist, icon: <Icon icon="microphone"/>, 
                        onClick: val => {
                            State.set("exp",{currentItem: null});
                            Router.push("/artist/"+val, Library.getArtist(val))
                        }
                    },
                    {name: "Go to album", value: state.currentItemData.album, icon: <Icon icon="compact-disc"/>, 
                        onClick: val => {
                            console.log('[Val]',val);
                            State.set("exp",{currentItem: null})
                            Router.push("/album/"+val, Library.getAlbum(val))
                        }
                    }
                ]}
                onClose={()=>State.set("exp",{currentItem: null})}
            />
        </WithinSearch>
    )
}