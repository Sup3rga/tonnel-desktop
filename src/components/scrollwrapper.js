import {useEffect, useRef} from "react";


export default function ScrollWrapper({
  className, children, scroll = 0, centered=false, padding=0
}){
    const ref = useRef();
    useEffect(()=>{
        if(!ref.current) return;
        ref.current.scrollTo({
            top: scroll - (centered ? ref.current.offsetHeight / 2.5 + padding : padding),
            behavior: "smooth",
            duration: 500
        })
        // ref.current.scrollTop = scroll - (centered ? ref.current.offsetHeight / 2.5 : 0);
    }, [scroll])
    return (
        <div className={["ui-container ui-size-fluid body ui-no-scroll",className].join(" ")}>
            <div ref={ref} className="ui-element ui-fluid-height ui-size-fluid content ui-scroll-y">
                {children}
            </div>
        </div>
    )
}