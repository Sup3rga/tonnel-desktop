import { createPortal } from "react-dom";
import {useState,useEffect} from "react";

let timer = null;

export default function Popup({
    anchor = null,
    name = "popup",
    className = "",
    top = 0,
    width = null,
    left = 0,
    open = false,
    children = null,
    onClose = ()=>{},
    delay = 100,
    origin = 0
}){
    const style = !anchor ? {} : {
        top: anchor.getBoundingClientRect().top + top,
        left: anchor.getBoundingClientRect().left + left
    };
    const [animated, setAnimated] = useState(false);
    if(typeof width === 'number') style.width = width+'px';
    style.transitionDuration = (delay / 1000) + 's';
    style.transformOrigin = origin;
    useEffect(()=>{
        clearTimeout(timer);
        setAnimated(open);
    }, [open]);
    // if(anchor)    console.log('[Rect]',anchor.getBoundingClientRect());
    return createPortal(
        <div className={`${open ? 'ui-container' : 'ui-hide'} ui-absolute ui-all-close popup`}>
            <div className="ui-container ui-absolute ui-all-close popup-mask" onClick={()=> typeof onClose === "function" ? onClose() : null}/>
            <div style={style} className={[`ui-container ${delay ? 'delayed' : ''} ${animated ? 'animated' : ''} ui-absolute popup-box ${anchor ? '' : 'centered'}`, className].join(" ")}>
                {children}
            </div>
        </div>,
        document.querySelector("#root")
    );
}