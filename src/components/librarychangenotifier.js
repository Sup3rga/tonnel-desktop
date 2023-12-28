import Icon from "./icon";
import {useEffect, useState} from "react";
import {exchange} from "../ext/bridge";
import State from "../lib/stater";


export default function LibraryChangeNotifier(){
    const [added, setAdded] = useState(0);
    const [minus, setMinus] = useState(0);
    useEffect(()=>{
        let timer = null;
        State.watch("library-updated", (arg)=>{
            clearTimeout(timer);
            if(arg) setAdded(added + 1);
            else setMinus(minus + 1);
            timer = setTimeout(()=>{
                setAdded(0);
                setMinus(0);
            }, 1000);
        })
        return ()=>{
            clearTimeout(timer);
        }
    },[]);
    return(
        !added && !minus ? null :
        <button className="ui-container library-notifier">
            {!added ? null : <label className="ui-element ui-size-fluid">{added} added</label>}
            {!minus ? null : <label className="ui-element ui-size-fluid">{minus} deleted</label>}
        </button>
    );
}