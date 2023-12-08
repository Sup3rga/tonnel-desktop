import {useRef, useEffect} from "react";
import Hammer from "react-hammerjs";


export default function LineTimer({
    progression = 0,
    horizontal = true,
    onChange = ()=>{}
}){
    const ref = useRef();
    const axes = {
        size: horizontal ? {width: progression+'%'} : {height: progression+'%'},
        marker: horizontal ? {
            left : progression+'%',
            transform: 'translate3d(-4px,-50%,0)'
        } : {
            top : (100 - progression)+'%',
            transform: 'translate3d(-50%,-4px,0)'
        }
    }

    useEffect(()=>{
        console.log('[Mounted]');
        onChange(progression / 100);
    }, []);
    const move = ev => {
        const el = document.querySelector('.line-container .line');
        const position = ref.current.getBoundingClientRect()[horizontal ? 'left' : 'top'],
            dimension = ref.current[horizontal ? 'offsetWidth' : 'offsetHeight'],
            clientPosition = horizontal ? ev.center.x : ev.center.y;
        let percent = (clientPosition - position) / dimension;
        // console.log({clientPosition,position, dimension, el, tar: ev.target});
        // console.log('Bound', {el,ev: ev.target}, {el : el.getBoundingClientRect(), ev: ev.target.getBoundingClientRect()});
        percent = percent < 0 ? 0 : percent > 1 ? 1 : percent;
        onChange(horizontal ? percent : 1 - percent);
    }
    return (
        <Hammer
            onTap={move}
            onPan={move}
        >
            <div className={`ui-container ui-size-fluid line-container ui-all-center ui-unwrap ${horizontal ? 'horizontal' : 'vertical'}`}>
                <div 
                    className={`ui-container ui-size-fluid line ${horizontal ? '' : 'ui-fluid-height'}`}
                    ref={ref}
                >
                    <div className="ui-container indicator" style={axes.size}/>
                </div>
                <Hammer 
                    onTap={move}
                    onPan={move}
                >
                    <div className="ui-container marker" style={axes.marker}/>
                </Hammer>
            </div>
        </Hammer>
    )
}