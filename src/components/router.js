import { useState , useEffect, memo} from "react"
import State from "../lib/stater"

const queue = {};
const index = {};

export function Route({
    lazy = true,
    generic = false,
    route = "",
    persistent = false,
    edit = {},
    props = {},
    reference=null,
    component = null
}){
    return null;
}

function getComponentId(component, props){
    return component.type.toString() + JSON.stringify(props);
}

const lazies = {};

const Router = memo(({
    id = "router",
    defaultRoute = "",
    stack = false,
    children = []
})=>{
    const [currentRoute] = State.init(id, useState({
        path : defaultRoute,
        hydration: null
    })).get(id);

    useEffect(()=>{
        queue[id] = [{path: defaultRoute, hydration : null}];
        index[id] = queue[id].length - 1;
        console.error('[Router] start');
    }, []);

    children = Array.isArray(children) ? children : [children];

    return <>
        {
            children.map((child, key)=>{
                const {
                    persistent = false, 
                    generic = false, 
                    lazy = false, 
                    route = null,
                    edit = null
                } = child.props;
                const isRouteInstance = child.type.toString() == Route.toString();
                // console.log('[Props]', isRouteInstance, child.props);
                const {style = {}} = isRouteInstance ? 'props' in child.props ? child.props.props : {} : child.props;
                
                if(stack){
                    style.opacity = 0;
                    style.position = 'absolute';
                    style.left = 0;
                    style.top = 0;
                    style.zIndex = 0;
                    // style.transitionProperty = 'opacity, z-index';
                    // style.transitionDuration = '.2s';
                }
                const reference = child.props['reference' in child.props ? 'reference' : 'route'];

                if(persistent){
                    if(route && 
                        ((generic && new RegExp(route.replace(/(\/)/g, '\\/')).test(currentRoute.path))
                        || route == currentRoute.path)
                    ){
                        style.opacity = 1;
                        style.zIndex = 2; 
                        child = (
                            stack || isRouteInstance ? 
                            <child.props.component 
                                {...('props' in child.props ? child.props.props : {})} 
                                {...(currentRoute.hydration ? currentRoute.hydration : {})}
                                style={style}
                                key={key}
                            /> :
                            <child.type 
                                {...child.props} 
                                {...(currentRoute.hydration ? currentRoute.hydration : {})}
                                key={key} 
                                style={style}
                            />
                        ) 
                        const compid = getComponentId(child, ('props' in child.props ? child.props.props : {}));
                        if(lazy){
                            lazies[compid] = true;
                        }
                        State.broadcast('reference', reference);
                        return child;
                    }
                    else{
                        
                        if(!stack){
                            style.display = "none";
                        }
                        else{
                            style.zIndex = 0;
                            style.opacity = 0;
                        }
                        child = (
                            isRouteInstance ? 
                            <child.props.component 
                                {...('props' in child.props ? child.props.props : {})} 
                                style={style}
                                {...(currentRoute.hydration ? currentRoute.hydration : {})}
                                key={key}
                            /> :
                            <child.type 
                                {...child.props}
                                {...(currentRoute.hydration ? currentRoute.hydration : {})} 
                                key={key} 
                                style={style}
                            />
                        );
                        const compid = getComponentId(child, ('props' in child.props ? child.props.props : {}));
                        if(lazy && ( !(compid in lazies) || !lazies[compid]) ){
                            // console.log('[set] lazy', compid.substring(0, 20), lazies[compid]);
                            lazies[compid] = false;
                            return null;
                        }
                        
                        return child;
                    }
                }
                else if(
                    ((generic && new RegExp(route.replace(/(\/)/g, '\\/')).test(currentRoute.path))
                    || route == currentRoute.path)
                ){
                    style.opacity = 1;
                    style.zIndex = 2;
                    // console.log('[Non-persistent]', child);
                    child = (
                        stack || isRouteInstance ? 
                        <child.props.component 
                            {...('props' in child.props ? child.props.props : {})} 
                            {...(currentRoute.hydration ? currentRoute.hydration : {})}
                            style={style}
                            key={key}
                        /> :
                        <child.type 
                            {...child.props}
                            {...(currentRoute.hydration ? currentRoute.hydration : {})} 
                            key={key} 
                            style={style}
                        />
                    );
                    State.broadcast('reference', reference);
                    return child;
                }
                return null;
            })
        }
    </>;
});

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
    // console.log('[Back to]', id, queue[id][index[id]]);
    State.set(id, queue[id][index[id]]);
}

Router.forward = (id = "router") =>{
    if(!Router.forwardable(id)) return;
    index[id]++;
    // console.log('[Go to]', id, queue[id][index[id]]);
    State.set(id, queue[id][index[id]]);
}

Router.forwardable = (id = "router") =>{
   return queue[id] && index[id] < queue[id].length - 1; 
}

Router.backwardable = (id = "router") =>{
   return index[id] > 0; 
}

Router.push = (path, hydration=null, id = "router")=>{
    const current = Router.current(id);
    if(current && current.path == path) return;
    if(Router.forwardable(id)){
        let newQueue = queue[id].filter((value, index)=>{
            return index <= Router.index(id);
        });
        queue[id] = newQueue;
        newQueue = null;
    }
    // console.log('[Queue]',id, queue);
    queue[id].push({
        path,
        hydration
    });
    index[id] = queue[id].length - 1;
    // console.log('[...Index...]',queue);
    State.set(id, {path, hydration});
}

export default Router;