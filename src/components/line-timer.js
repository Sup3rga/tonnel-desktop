import {useRef} from "react";


export default function LineTimer({
    progression = 0,
    horizontal = true,
    onChange = ()=>{}
}){
    const ref = useRef();
    const getAbsolutePosition = (element)=>{
        let left = element[horizontal ? 'offsetLeft' : 'offsetTop'];
        // console.log('[ELement]',{element, left});
        if(element.tagName.toLowerCase() !== "body"){
            left += getAbsolutePosition(element.offsetParent);
        }
        return left;
    }
    const axes = {
        size: horizontal ? {width: progression+'%'} : {height: (100 - progression)+'%'},
        marker: horizontal ? {
            left : progression+'%',
            transform: 'translate3d(-4px,-50%,0)'
        } : {
            top : progression+'%',
            transform: 'translate3d(-50%,-4px,0)'
        }
    }
    return (
        <div className={`ui-container ui-size-fluid line-container ui-all-center ui-unwrap ${horizontal ? 'horizontal' : 'vertical'}`}
            ref={ref}
            onClick={(e)=>{
                console.log('[ref]', ref,e);
                const position = getAbsolutePosition(ref.current),
                      dimension = ref.current[horizontal ? 'offsetWidth' : 'offsetHeight'],
                      clientPosition = horizontal ? e.clientX : position + e.nativeEvent.offsetY,
                      percent = (clientPosition - position) / dimension;
                console.log({clientPosition,position, dimension})
                onChange(percent);
            }}
        >
            <div className={`ui-container ui-size-fluid line ${horizontal ? '' : 'ui-fluid-height'}`}>
                <div className="ui-container indicator" style={axes.size}/>
            </div>
            <div className="ui-container marker" style={axes.marker}/>
        </div>
    )
}