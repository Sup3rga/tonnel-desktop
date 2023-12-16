import { memo } from "react";
import Popup from "./popup";

export const MenuItem = memo(function({
    name = "",
    value = null,
    icon = null,
    onClick
}){
    return (
        <div 
            className="ui-container ui-size-fluid menu-item" 
            onClick={()=> typeof onClick === 'function' ? onClick(value) : null}
        >
            {icon ? icon : null}
            <label className="ui-container">{name}</label>
        </div>
    )
});

export const MenuBuilder = function({list = [], onItemSelect}){
    return list.map((item,key)=>{
        return <MenuItem {...item} key={key} onClick={(e)=>{
            if(typeof item.onClick === 'function') item.onClick(e);
            if(typeof onItemSelect === 'function') onItemSelect(e); 
        }}/>
    })
};

const Menu = function({
    anchor = null,
    name = "menu",
    title = null,
    top = 0,
    width = null,
    className=null,
    left = 0,
    onClose,
    children = [],
    origin = "0 0",
    childrenMap = null,
    onItemSelect
}){
    return (
        <Popup
            name={name}
            onClose={onClose}
            top={top}
            left={left}
            width={width}
            className={["app-menu-popup", className].join(" ")}
            anchor={anchor}
            origin = {origin}
            open={anchor && anchor instanceof HTMLElement ? document.contains(anchor) : false}
        >
            {
                !title ? null :
                <h1 className="ui-container ui-size-fluid menu-title">{title}</h1>
            }
            <div className="ui-container ui-size-fluid items-wrapper">
                {
                    childrenMap && Array.isArray(childrenMap) ?
                    <MenuBuilder list={childrenMap} onItemSelect={onItemSelect}/> : children
                }
            </div>
        </Popup>
    )
}

export default Menu;