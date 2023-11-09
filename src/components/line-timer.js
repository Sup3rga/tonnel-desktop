import {useRef} from "react";


export default function LineTimer({
    progression = 0,
    onChange = ()=>{}
}){
    const ref = useRef();
    const getAbsoluteX = (element)=>{
        let left = element.offsetLeft;
        // console.log('[ELement]',{element, left});
        if(element.tagName.toLowerCase() !== "body"){
            left += getAbsoluteX(element.offsetParent);
        }
        return left;
    }
    return (
        <div className="ui-container ui-size-fluid line-container ui-all-center ui-unwrap"
            ref={ref}
            onClick={(e)=>{
                const left = getAbsoluteX(ref.current),
                      width = ref.current.offsetWidth,
                      posX = e.clientX,
                      percent = (posX - left) / width;
                onChange(percent);
            }}
        >
            <div className="ui-container ui-size-fluid line">
                <div className="ui-container indicator" style={{width: progression+'%'}}/>
            </div>
            <div className="ui-container marker" style={{
                left : progression+'%',
                transform: 'translate3d(-4px,-50%,0)'
            }}/>
        </div>
    )
}