import Icon from "./icon";
import State from "../lib/stater";
import Router from "./router";
import { useState } from "react";

export function AppbarNavButton({
    backward = false
}){
    const active = Router[backward ? 'backwardable' : 'forwardable']();
    return (
        <Icon 
            icon={backward ? "angle-left" : "angle-right"} 
            className={`no-drag-zone ${active ? 'active' : ''}`}
            onClick={()=>{
                if(backward && !Router.backwardable()) return;
                if(!backward && !Router.forwardable()) return;
                Router[backward ? 'back' : 'forward']();
                // console.log('[ROUTE]', Router.current());
                // State.set("menu", {current: Router.current()});
            }}
        />
    )
}

export default function Appbar({
    title = "",
    withSearch = true,
    style={},
    onSearching = ()=>{}
}){
    const {darkMode} = State.get("app")[0];
    const {minimal} = State.get("app")[0];
    const [keyword, setKeyword] = useState("");
    const [anyBound, setAnyBound] = useState(false);
    // console.log('[Style]',style, darkMode);
    return (
        <div className="ui-container ui-size-fluid search-zone appbar ui-unwrap ui-vertical-center" style={style}>
            <div className="ui-container nav-box ui-unwrap">
                <AppbarNavButton backward/>
                <AppbarNavButton/>
            </div>
            <button className="ui-container collapsable-btn no-drag-zone" onClick={()=> State.set("app", {minimal : !minimal})}>
                <Icon icon="bars"/>
            </button>
            <label className="ui-container ui-size-2">{title}</label>
            {
                !withSearch ? <div className="ui-container ui-size-5"/> :
                <div className="ui-container ui-size-5 ui-unwrap field">
                    <Icon icon="search"/>
                    <input 
                        type="search" 
                        placeholder="search something" 
                        className="ui-container ui-size-fluid"
                        value={keyword}
                        onChange={(ev)=>{
                            setKeyword(ev.target.value);
                            onSearching(ev.target.value, anyBound);
                        }}
                    />
                    {!keyword.length ? null :
                        <label 
                            className={`ui-container ui-vertical-center ui-unwrap ${!anyBound ? 'activated' : ''}`}
                            onClick={()=>{
                                setAnyBound(!anyBound);
                                onSearching(keyword, !anyBound);
                            }}
                        >
                            A<Icon icon="asterisk"/>
                        </label>
                    }
                </div>
            }
            <div className="ui-container ui-size-3 ui-lg-size-4 misc ui-horizontal-right">
                <button className={`ui-container ${darkMode ? 'to-light' : 'to-dark'}`} onClick={()=> State.set("app", {darkMode : !darkMode})}>
                    <Icon icon={!darkMode ? "moon" : "sun"}/>
                </button>
                <button className="ui-container">
                    <Icon mode="line" icon="cog"/>
                </button>
            </div>
        </div>
    )
}