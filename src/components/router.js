import { useState , useEffect} from "react"
import State from "../lib/stater"

const queue = {};

export default function Router({
    id = "router",
    defaultRoute = "",
    children = []
}){
    const [route] = State.init(id, useState(defaultRoute)).get(id);
    useEffect(()=>{
        queue[id] = [defaultRoute];
    }, []);
    let child = null;
    children = Array.isArray(children) ? children : [children];
    for(let routeChild of children){
        if('route' in routeChild.props && routeChild.props.route == route){
            child = routeChild;
            break;
        }
    }
    return <>
        {
            children.map((child, key)=>{
                if(child.props.persistent){
                    if('route' in child.props && child.props.route == route){
                        return child;
                    }
                    else{
                        const style = child.props.style ? {...child.props.style} : {};
                        style.display = "none";
                        return <child.type {...child.props} style={style}/>;
                    }
                }
                else if('route' in child.props && child.props.route == route){
                    return child;
                }
                return null;
            })
        }
    </>;
}

Router.push = (path, id = "router")=>{
    State.set(id, path);
    queue[id].push(path);
}