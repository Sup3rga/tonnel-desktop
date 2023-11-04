import WithinSearch from "../components/withinsearch";
import {useEffect, useState, useRef} from "react";
import State from "../lib/stater";
import Player from "../ext/player";
import MusicItem from "../components/musicitem";
import { storage } from "../ext/bridge";
import { useCallback } from "react";

const {bridge : {fetchLibrary, exchange} } = window;

export default function Explore(){
    const [state] = State.init("exp", useState({
        list: [],
        page : 100
    })).get("exp");
    const limit = 100;

    const observer = useRef(),
          lastItem = useCallback(node => {
              console.log('[Node]',node);
              if(observer.current) observer.current.disconnect();
              observer.current = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting){
                    console.log('Item visible...');
                    state.page += limit;
                    retrieve(state.page).then(list => {
                        console.log('[List]', list.length);
                        State.set("exp", {page : state.page, list});
                        console.log('[List]',list);
                    }).catch(err=>{
                        console.log('[Err]',err);
                    })
                }
              });
              if(node) observer.current.observe(node);
          }, [state.page]);

    const retrieve = useCallback(async (page)=>{
        try{
            const data = await storage.getItem("library");
            const list = [];
            const keys = Object.keys(data);
            for(let i = 0, j = page; i < j; i++){
                list.push(data[keys[i]])
            }
            // console.log('[List]',list);
            // State.set("exp", {list});
            return list;
        }catch(err){
            console.log('[Err]',err);
        } 
        return [];
    }, []);

    useEffect(()=>{
        console.log('[Fetch...]');
        retrieve(state.page).then((list)=>{
            console.log('[List]',list);
            State.set("exp", {list});
        }).catch((err)=>{
            console.log('[Err]',err);
        })
    }, []);
    return (
        <WithinSearch>
            {
                
                state.list.map((song, key)=>{
                    // console.log('[Song]',key, state.list.length);
                    if(key == state.list.length - 1){
                        return (
                            <MusicItem className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" forwardRef={lastItem} {...song}/>
                        )
                    }
                    return (
                        <MusicItem className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2" {...song}/>
                    )
                })
            }
        </WithinSearch>
    )
}