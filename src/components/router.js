import { useState , useEffect} from "react"
import State from "../lib/stater"

const queue = {};
const index = {};

export default function Router({
    id = "router",
    defaultRoute = "",
    children = []
}){
    const [currentRoute] = State.init(id, useState(defaultRoute)).get(id);
    useEffect(()=>{
        queue[id] = [defaultRoute];
        index[id] = queue[id].length - 1;
    }, []);

    children = Array.isArray(children) ? children : [children];

    return <>
        {
            children.map((child, key)=>{
                const {persistent = false, generic = false, route = null, style = {}} = child.props;
                if(persistent){
                    if(route && 
                        ((generic && new RegExp(route.replace(/(\/)/g, '$\\/')).test(currentRoute))
                        || route == currentRoute)
                    ){
                        return child;
                    }
                    else{
                        style.display = "none";
                        return <child.type {...child.props} key={key} style={style}/>;
                    }
                }
                else if(route && route == currentRoute){
                    return child;
                }
                return null;
            })
        }
    </>;
}

Router.index = (id = "router")=>{
    if(!id in index) return 0;
    return index[id];
}

Router.current = (id = "router")=>{
    const index = Router.index(id);
    return queue[id] ? queue[id][index] : null;
}

Router.back = (id = "router") =>{
    if(!Router.backwardable(id)) return;
    index[id]--;
    State.set(id, queue[id][index[id]]);
}

Router.forward = (id = "router") =>{
    if(!Router.forwardable(id)) return;
    index[id]++;
    State.set(id, queue[id][index[id]]);
}

Router.forwardable = (id = "router") =>{
   return queue[id] && index[id] < queue[id].length - 1; 
}

Router.backwardable = (id = "router") =>{
   return index[id] > 0; 
}

Router.push = (path, id = "router")=>{
    if(Router.current(id) == path) return;
    if(Router.forwardable(id)){
        let newQueue = queue[id].filter((value, index)=>{
            return index < Router.index(id);
        });
        queue[id] = newQueue;
        newQueue = null;
    }
    queue[id].push(path);
    index[id] = queue[id].length - 1;
    console.log('[...Index...]',queue);
    State.set(id, path);
}