import {useEffect, useRef, useState} from "react";
import Icon from "./icon";
import State from "../lib/stater";
import responsive from "../lib/responsive";
import Painter, {PaintControl, PaintDrawer} from "./Painter";
import ImageTheme from "../lib/imagetheme";
import Router from "./router";

const {bridge : {exchange} } = window;

const links = [
    {
        header: true,
        label: "Your library",
    },
    {
        icon: "books",
        label: "Explore",
        ref: "/explore"
    },
    {
        icon: "compact-disc",
        label: "Albums",
        ref: "/albums"
    },
    {
        icon: 'microphone',
        label: "Artists",
        ref: "/artist"
    },
];

function MenuItem({
    key,
    active = false,
    icon = "",
    label = "",
    onClick= ()=>{},
    path = "",
    _ref = ()=>{}
}){
    const ref = useRef();
    useEffect(()=>{
        _ref(ref.current);
    }, [ref]);
    return (
        <div
            ref={ref}
            key={key}
            className={`ui-container ui-size-fluid link ui-vertical-center ${active ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon icon={icon}/>
            <label>{label}</label>
        </div>
    )
}
export default function Sidemenu({
    width = 300,
    copyColor=null
}){
    const menuRef = useRef();
    const [state, setState] = State.init("menu", useState({
        current: "/explore",
        width: 300,
        height: '100%',
        restore: false,
        index: 1,
        refs : [],
        paintCtl : new PaintControl()
    })).get("menu");
    let theme = null;
    if(copyColor){
        const reach = new ImageTheme();
        theme = reach.setImageDataUrl(copyColor).get();
        console.log('[Copy]',theme)
    }

    const redraw = (ref, animate = false)=>{
        const design = new PaintDrawer();
        if(!menuRef.current){
            return;
        }
        let _state = {
            width: menuRef.current.offsetWidth,
            height: menuRef.current.parentElement.offsetHeight,
        };
        // console.log('[MenuRef..]', menuRef, ref);
        const width = _state.width,
              height = _state.height,
              top = ref.offsetTop,
              left = ref.offsetLeft,
              h = ref.offsetHeight,
              radius = 50,
              padding = 10;

        design.moveTo(0,0)
        .lineTo(width, 0)
        .lineTo(width, top - radius)
        .quadraticCurveTo(width, top, width - radius, top)
        .lineTo(left + radius - padding, top)
        .bezierCurveTo(radius - padding, top - 6, radius - padding, top + h + 6, left + radius - padding, top + h)
        .lineTo(width - radius, top + h)
        .quadraticCurveTo(width, top + h, width, top + h + radius)
        .lineTo(width, height)
        .lineTo(0, height)
        .moveTo(0,0)
        .setFillStyle(theme ? 'rgba('+theme.join(',')+', .5)' : 'rgba(225,214,203,0.5)')
        .setType('fill');

        // if(animate){
        //     setTimeout(()=>{
        //         state.paintCtl.animate(design, 500);
        //     }, 500);
        // }
        // else {
            state.paintCtl.draw(design);
        // }

        State.set("menu", _state);
    }

    useEffect(()=>{
        // console.log('[LinkRef]', state.refs.length, state.refs);
        redraw(state.refs[state.index]);
        responsive(menuRef.current, ()=>{
            redraw(state.refs[state.index]);
        })
        console.log('[Repaint]');
    }, [state.index, state.refs, menuRef]);

    return (
        <div className="ui-container app-sidemenu ui-relative" ref={menuRef} style={{width: width+'px', height: state.height+'px'}}>
            <Painter
                width={state.width}
                height={state.height}
                className="ui-container ui-fluid"
                paintControl={state.paintCtl}
            />
            <div className="ui-element ui-all-close ui-absolute app-drawer">
                <div className="ui-container header ui-size-fluid ui-unwrap ui-vertical-center">
                    <div className="ui-container ui-size-5 win-buttons ui-vertical-center">
                        <button className="ui-element win-button min"
                            onClick={()=>{
                                exchange.emit("win-action", 1)
                            }}
                        >
                            <Icon icon="minus"/>
                        </button>
                        <button className="ui-element win-button max"
                            style={{rotate: state.restore ? "-45deg" : "0deg"}}
                            onClick={()=>{
                                State.set("menu", {restore: !state.restore});
                                exchange.emit("win-action", state.restore ? 3 : 2)
                            }}
                        >
                            <Icon icon={state.restore ? "scroll-h" : "square"}/>
                        </button>
                        <button className="ui-element win-button close"
                            onClick={()=>{
                                exchange.emit("win-action", 0)
                            }}
                        >
                            <Icon icon="times"/>
                        </button>
                    </div>
                    <Icon icon="fire"/>
                    <h1 className="ui-container ui-horizontal-center">TonneL</h1>
                </div>
                <div className="ui-container ui-size-fluid links">
                    {
                        links.map((data, key)=>{
                            if(data.header){
                                return (
                                    <h2 className="ui-container ui-size-fluid link-header">{data.label}</h2>
                                )
                            }
                            return (
                                <MenuItem
                                    key={key}
                                    label={data.label}
                                    active={data.ref === state.current}
                                    path={state.current}
                                    icon={data.icon}
                                    onClick={()=>{
                                        state.current = data.ref;
                                        state.index = key;
                                        State.set("menu", {...state});
                                        redraw(state.refs[key], true);
                                        Router.push(data.ref);
                                    }}
                                    _ref={(ref)=>{
                                        // console.log('[item]',ref);
                                        state.refs[key] = ref;
                                        State.set("menu", {
                                            refs : state.refs
                                        })
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}