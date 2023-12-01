import {useEffect, useRef, useState} from "react";
import Icon from "./icon";
import State from "../lib/stater";
import responsive from "../lib/responsive";
import Painter, {PaintControl, PaintDrawer} from "./Painter";
import ImageTheme from "../lib/imagetheme";
import Router from "./router";

const {exchange}  = window.bridge;

const links = [
    {
        header: true,
        label: "Your library",
    },
    {
        icon: "compass",
        label: "Explore",
        ref: "/explore"
    },
    {
        icon: "compact-disc",
        label: "Albums",
        ref: "/albums"
    },
    {
        icon: 'microphone-alt',
        label: "Artists",
        ref: "/artists"
    },
    {
        icon: 'list-alt',
        label: "Playlists",
        ref: "/list"
    },
];

function MenuItem({
    key,
    active = false,
    icon = "",
    label = "",
    onClick= ()=>{},
    path = "",
    iconOnly =false,
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
            <Icon mode="line" icon={icon}/>
            {iconOnly ? null : <label>{label}</label>}
        </div>
    )
}

export default function Sidemenu({
    width = 300,
    copyColor=null,
    minimal=false
}){
    const menuRef = useRef();

    const [state] = State.init("menu", useState({
        current: "/explore",
        width: 200,
        height: '100%',
        restore: false,
        index: 1,
        refs : [],
        darkText: true,
        paintCtl : new PaintControl()
    })).get("menu");

    // console.log('[Current]', state.current);

    const redraw = (ref, animate = false)=>{
        const design = new PaintDrawer();
        if(!menuRef.current){
            return;
        }
        let _state = {
            width: menuRef.current.offsetWidth,
            height: menuRef.current.parentElement.offsetHeight,
            darkText: true
        };

        const imageTheme = new ImageTheme();
        let theme = !copyColor ? null : imageTheme.setImageDataUrl(copyColor).get();
        if(theme){
            exchange.emit("background-change", `rgb(${theme.join(',')})`);
            let sum = 0;
            for(let i in theme){
                sum += theme[i];
            }
            if(sum < 382.5){
                _state.darkText = false;
            }
            console.log('[Sum of theme]', sum, copyColor == null, theme);
        }
        // console.log('[MenuRef..]', menuRef, ref);
        const width = _state.width,
              height = _state.height,
              top = ref.offsetTop,
              left = ref.offsetLeft,
              h = ref.offsetHeight,
              radius = minimal ? 25 : 50,
              padding = minimal ? -5 : 10,
              ratio = minimal ? 16 : 0;

        design.moveTo(0,0)
        .lineTo(width, 0)
        .lineTo(width, top - radius)
        .quadraticCurveTo(width, top, width - radius, top)
        .lineTo(left + radius - padding, top)
        .bezierCurveTo(radius - padding - ratio, top - 6 , radius - padding - ratio, top + h + 6, left + radius - padding, top + h)
        .lineTo(width - radius, top + h)
        .quadraticCurveTo(width, top + h, width, top + h + radius)
        .lineTo(width, height)
        .lineTo(0, height)
        .moveTo(0,0)
        .setFillStyle(theme ? 'rgba('+theme.join(',')+', .5)' : 'rgba(235,224,213,0.6)')
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
        // console.log('[redrawing]');
        redraw(state.refs[state.index]);
        responsive(menuRef.current, ()=>{
            redraw(state.refs[state.index]);
        })
    }, [state.index, state.refs, menuRef, copyColor, minimal]);

    useEffect(()=>{
        let index = 0;
        for(let i in links){
            if(links[i].ref == state.current){
                index = i * 1;
            }
        }
        if(!state.refs[index]) return;
        state.index = index;
        redraw(state.refs[state.index]);
    }, [state.current]);

    useEffect(()=>{
        setTimeout(()=>{
            redraw(state.refs[state.index]);
        },100);
        State.watch("reference", (current)=>{
            State.set("menu", {current});
            // console.error('[path]', path);
        })
        // console.log('[static Refs]', state.refs);
    }, []);

    return (
        <div className="ui-container app-sidemenu ui-relative" ref={menuRef} style={{width: width+'px', height: state.height+'px'}}>
            <Painter
                width={state.width}
                height={state.height}
                className="ui-container ui-fluid"
                paintControl={state.paintCtl}
            />
            <div className={`ui-element ui-all-close ui-absolute app-drawer ${state.darkText ? 'dark-text' : ''}`}>
                <div className="ui-container header ui-size-fluid ui-unwrap ui-vertical-center">
                    <div className={`ui-container ${minimal ? 'ui-size-fluid' : 'ui-size-5'} win-buttons ui-vertical-center`}>
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
                    {minimal ? null : 
                        <div className="ui-container ui-all-center">
                            <Icon icon="fire"/>
                            <h1 className="ui-container ui-horizontal-center">TonneL</h1>
                        </div>
                    }
                </div>
                {!minimal ? null :
                    <div className="ui-container ui-size-fluid ui-all-center minimal-icon-zone">
                        <Icon icon="fire"/>
                    </div>
                }
                <div className={`ui-container ui-size-fluid links ${minimal ? 'minimal' : ''}`}>
                    {
                        links.map((data, key)=>{
                            if(data.header){
                                if(minimal) return <h2 className="ui-container ui-size link-header">&nbsp;</h2>;
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
                                    iconOnly={minimal}
                                    onClick={()=>{
                                        state.index = key;
                                        redraw(state.refs[key], true);
                                        State.set("menu", {current: data.ref});
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