import {memo, useState} from "react";

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
    children
}){
    return (
        <div style={style} className="ui-container ui-size-fluid ui-absolute ui-all-close tab-body">
            {children}
        </div>
    )
}

const TabManager = /*memo(*/({
    headPosition = "top",
    children = [],
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
        <div className={`ui-container ui-size-fluid ui-absolute ui-all-close tab-manager`}>
            <div className={`ui-container ui-size-fluid tab-head-container ui-unwrap`}>
                {tabs.map((head, key)=>(
                    <head.type
                        {...head.props}
                        active={current === head.props.name}
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
                    style.zIndex = tabBody.props.name === current ? 2 : 1;
                    style.opacity = tabBody.props.name === current ? 1 : 0;
                    return <tabBody.type {...tabBody.props} style={style}/>
                })}
            </div>
        </div>
    )
}
//);

export default TabManager