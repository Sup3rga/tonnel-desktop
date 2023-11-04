import { useState, useEffect } from "react";


export function useViewportSize(){
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    useEffect(()=>{
        window.addEventListener('resize', ()=>{
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        })
    }, []);
    return [width, height];
}