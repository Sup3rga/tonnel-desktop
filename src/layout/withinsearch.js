import { useState } from "react";
import Appbar from "../components/appbar";
import Icon from "../components/icon";
import ScrollWrapper from "../components/scrollwrapper";

export default function WithinSearch({
    children, 
    title = "", 
    style = {}, 
    searchContentProvider = async ()=>{},
    placeholder=(
        <div className="ui-container ui-fluid empty ui-horizontal-center">
            <div className="ui-element">
                <Icon icon="search"/>
                <label className="ui-element ui-size-fluid">None to display</label>
            </div>
        </div>
    )
}){
    const [searching, setSearching] = useState(false);
    const [searchContent, setSearchContent] = useState(placeholder);
    return (
        <div className={`ui-container ui-fluid view-search ui-no-scroll ${searching ? 'searching' : ''}`} style={style}>
            <Appbar title={title} onSearching={async (val, anyBound)=>{
                if(!searching && val.length) setSearching(true);
                if(!val.length) return setSearching(false);
                const content = await searchContentProvider(val,anyBound);
                setSearchContent(Array.isArray(content) && content.length || !content ? placeholder : content);
            }}/>
            <div className={`ui-container ui-size-fluid search-view ui-no-scroll`}>
                <ScrollWrapper className="search-content">
                    {searchContent}
                </ScrollWrapper>
                {/* <div className="ui-element ui-size-fluid search-content ui-scroll-y">
                    {searchContent}
                </div> */}
                <div className="ui-container ui-size-fluid action ui-horizontal-right">
                    <button onClick={()=> setSearching(false)}>
                        <Icon icon="angle-up"/>
                    </button>
                </div>
            </div>
            <div className={`ui-container ui-size-fluid scroll-view ${searching ? 'ui-no-scroll' : 'ui-scroll-y'}`}>
                {children}
            </div>
        </div>
    )
}