import { useState, useCallback, useEffect, useRef } from "react";
import State from "../lib/stater";


function ScrollItem({
    width = 0,
    height = 0,
    children = null
}){
    const [show, setShow] = useState(true); 
    let observer = null,
         item = useCallback((node)=>{
            if(observer) observer.disconnect();
            observer = new IntersectionObserver(items =>{
                setShow(items[0].isIntersecting);
            });
            observer.observe(node);
         }, []);
    const style = children.props.style ? children.props.style : {};
    style.width = '100%';
    style.height = '100%';
    const newProps = {};
    for(let i in children.props){
        if(i !== 'className'){
            newProps[i] = children.props[i];
        }
    }
    
    return (
        <div className={children.props.className} ref={item}>
            {
                !show ? null :
                <children.type {...newProps} style={style}/>
            }
        </div>
    )
}

export default function InfiniteScrolView({
    data = [],
    render = ()=>{},
    name = "infinite",
    grouped = true,
    sortFactor = "",
    limit = 20
}){
    const [state] = State.init(name, useState({
        list: [],
        page: limit
    })).get(name);
    // console.log('[Data]',data);
    const observer = useRef(),
          lastItem = useCallback(node => {
              console.log('[Node]',node);
              if(observer.current) observer.current.disconnect();
              observer.current = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting){
                    // console.log('Item visible...');
                    state.page += limit;
                    if(state.page >= data.length) return;
                    retrieve(state.page).then(list => {
                        // console.log('[uc][List]', list);
                        State.set(name, {page : state.page, list});
                        // console.log('[List]',list);
                    }).catch(err=>{
                        console.log('[Err]',err);
                    })
                }
              });
              if(node) observer.current.observe(node);
          }, [state.page, data]);
          const retrieve = useCallback(async (page)=>{
            try{
                const list = [];
                for(let i = 0, j = page; i < j && i < data.length; i++){
                    list.push(data[i]);
                }
                // console.log('[uc2][List]',list, data);
                // State.set("exp", {list});
                return list;
            }catch(err){
                console.log('[Err]',err);
            } 
            return [];
        }, [data]);
        useEffect(()=>{
            // console.log('[Fetch...] data');
            retrieve(state.page).then((list)=>{
                // console.log('[ue][List]',list);
                State.set(name, {list});
            }).catch((err)=>{
                console.log('[Err]',err);
            })
        }, [data]);


        const group = {
            current : "",
            old : "",
            factor: ""
        };

        return state.list.map((data, key)=>{
            const child = render(data, key);
            if(!child){
                return null;
            }
            if(sortFactor){
                group.factor = data[sortFactor].trim();
                group.current = data[sortFactor].replace(/^([^a-z]*?)?([a-z].+?)$/i, '$2').toUpperCase()[0];
                group.current = /[a-z]/i.test(group.current) ? group.current.toUpperCase() : "#";
            }

            const result = (
                <>
                    {grouped && group.current === group.old ? null : 
                        <h1 className="ui-container ui-size-fluid group-tag">{group.current}</h1>
                    }
                    {
                        key == state.list.length - 1 ?
                        <child.type {...child.props} forwardRef={lastItem}/>
                        :
                        <child.type {...child.props}/>
                    }
                </>
            )
            if(sortFactor){
                group.old = group.current;
            }
            return result;
        });
}