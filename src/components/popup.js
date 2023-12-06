import { createPortal } from "react-dom";

export default function Popup({
    anchor = null,
    name = "popup",
    className = "",
    open = false,
    children = null
}){
    return createPortal(
        <div className={`${open ? 'ui-container' : 'ui-hide'} ui-absolute ui-all-close popup-mask`}>
            <div className={[`ui-container ui-absolute popup-box ${anchor ? '' : 'centered'}`, className].join(" ")}>
                {children}
            </div>
        </div>,
        document.querySelector("#root")
    );
}