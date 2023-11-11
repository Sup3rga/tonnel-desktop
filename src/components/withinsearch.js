import Icon from "./icon";
import State from "../lib/stater";

export default function WithinSearch({children, title = "", style = {}}){
    const {darkMode} = State.get("app")[0];
    const {minimal} = State.get("app")[0]
    console.log('[Style]',style, darkMode);
    return (
        <div className="ui-container ui-fluid view-search" style={style}>
            <div className="ui-container ui-size-fluid search-zone ui-unwrap ui-vertical-center">
                <div className="ui-container nav-box ui-unwrap">
                    <Icon icon="angle-left"/>
                    <Icon icon="angle-right"/>
                </div>
                <button className="ui-container collapsable-btn no-drag-zone" onClick={()=> State.set("app", {minimal : !minimal})}>
                    <Icon icon="bars"/>
                </button>
                <label className="ui-container ui-size-2">{title}</label>
                <div className="ui-container ui-size-5 ui-unwrap field">
                    <Icon icon="search"/>
                    <input type="text" placeholder="search something" className="ui-container ui-size-fluid"/>
                </div>
                <div className="ui-container ui-size-3 misc ui-horizontal-right">
                    <button className={`ui-container ${darkMode ? 'to-light' : 'to-dark'}`} onClick={()=> State.set("app", {darkMode : !darkMode})}>
                        <Icon icon={!darkMode ? "moon" : "sun"}/>
                    </button>
                    <button className="ui-container">
                        <Icon icon="chart-bar"/>
                    </button>
                    <button className="ui-container">
                        <Icon mode="line" icon="cog"/>
                    </button>
                </div>
            </div>
            <div className="ui-container ui-size-fluid scroll-view ui-scroll-y">
                {children}
            </div>
        </div>
    )
}