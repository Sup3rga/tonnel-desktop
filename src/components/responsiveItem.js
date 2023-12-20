import {useEffect, useState} from "react";
import responsive, {defaultResponsivness, defineDimension} from "../lib/responsive";
import State from "../lib/stater";


export default function ResponsiveItem({
    children =  [],
    forwardRef = null,
    responsiveness = {},
    additionnal = 0,
    phantom = false,
    padding = 40
}){
    const child = Array.isArray(children) ? children[0] : children;
    const [minimalMode, setMinimalMode] = useState(State.get("ui")[0].minimal);
    const [dimension, setDimension] = useState(defineDimension(defaultResponsivness(responsiveness), additionnal, padding));
    const style = 'style' in child.props ? child.props.style : {};

    useEffect(()=>{
        responsive(()=> {
            setDimension(defineDimension(defaultResponsivness(responsiveness), additionnal, padding));
        })
        State.watch("ui", ({minimal})=>{
            if(minimal !== minimalMode){
                setMinimalMode(minimal);
                setDimension(defineDimension(defaultResponsivness(responsiveness), additionnal, padding));
            }
        });
    }, [phantom]);

    if(!child) return child;

    if(!phantom) {
        style.width = `${dimension.width}px`;
        style.height = `${dimension.height}px`;
    }

    return <child.type
        {...child.props}
        ref={forwardRef}
        style={style}
    />
}