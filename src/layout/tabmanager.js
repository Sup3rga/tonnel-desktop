import {useState} from "react";

export function Tab({
    name = "",
    label = "",
    active = false,
    onClick = ()=>{}
}){

    return (
        <div onClick={onClick} className={`ui-container ui-size-fluid no-drag-zone tab-head ui-all-center ui-unwrap ui-text-ellipsis ${active ? 'active' : ''}`}>
            {label}
        </div>
    )
}

export function TabBody({
    name = "",
    style = {},
    active = false,
    children
}){
    return (
        <div style={style} className="ui-container ui-size-fluid ui-absolute ui-all-close tab-body">
            {children}
        </div>
    )
}

const TabManager = ({
    headPosition = "top",
    children = [],
    manual = false,
    onHeadClick = ()=>{}
})=>{
    const tabs = [];
    const bodies = [];
    children = Array.isArray(children) ? children : [children];
    for(let child of children){
        if(child.type.toString() === Tab.toString()){
            tabs.push(child);
        }
        else if(child.type.toString() === TabBody.toString()){
            bodies.push(child);
        }
        else{
            throw new Error("TabBody or Tab child type are only allowed, reason : " + child.type + " [NOT] " + TabBody.toString() + " /// " + Tab.toString());
        }
    }

    const [current, setCurrent] = useState(tabs.length ? tabs[0].props.name : "");

    return (
        <div className={`ui-container ui-column ui-size-fluid ui-absolute ui-all-close tab-manager ${tabs.length ? '' : 'headless'}`}>
            <div className={`${tabs.length ? 'ui-container' : 'ui-hide'} ui-size-fluid tab-head-container ui-unwrap`}>
                {tabs.map((head, key)=>(
                    <head.type
                        {...head.props}
                        active={(manual && head.props.active) || (!manual && current === head.props.name)}
                        onClick={()=>{
                            setCurrent(head.props.name)
                            onHeadClick(head.props.name);
                        }}
                    />
                ))}
            </div>
            <div className={`ui-container ui-size-fluid tab-body-container ui-relative`}>
                {bodies.map((tabBody,key)=> {
                    const style = 'style' in tabBody.props ? tabBody.props.style : {};
                    style.zIndex = (manual && tabBody.props.active) || (!manual && tabBody.props.name === current) ? 2 : 1;
                    style.opacity = (manual && tabBody.props.active) || (!manual && tabBody.props.name === current) ? 1 : 0;
                    return <tabBody.type {...tabBody.props} style={style}/>
                })}
            </div>
        </div>
    )
}

export default TabManager