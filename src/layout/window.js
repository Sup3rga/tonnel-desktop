import {useEffect, useRef} from "react";

export default function Window({width = 800, height = 600}){
    const ref = useRef();

    useEffect(()=>{
        console.log('[Ref...]',ref.current);
    }, []);
    return (
        <div id="app-window" className="ui-container ui-vfluid app-window">
            <div className="ui-container ui-size-fluid app-title-bar" ref={ref}
                onDrag={()=>{
                    console.log('[Drag]...')
                }}
                 onDragCapture={()=>console.log('[Dragging]')}
            >
                <button onClick={async()=>{
                    console.log('[Clicked]');
                }}>close</button>
            </div>
        </div>
    )
}