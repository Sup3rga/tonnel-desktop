import {useEffect, useRef} from "react";


export class PaintDrawer{
    _queue = [];
    moveTo(x, y){
        this._queue.push({
            type: 'moveTo',
            arg : [x,y]
        });
        return this;
    }

    lineTo(x, y){
        this._queue.push({
            type: 'lineTo',
            arg : [x,y]
        });
        return this;
    }

    quadraticCurveTo(cpx, cpy, x, y){
        this._queue.push({
            type: 'quadraticCurveTo',
            arg : [cpx, cpy, x, y]
        });
        return this;
    }

    bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y){
        this._queue.push({
            type: 'bezierCurveTo',
            arg : [cpx1, cpy1, cpx2, cpy2, x, y]
        });
        return this;
    }

    setFillStyle(value){
        this._queue.push({
            type: 'fillStyle',
            arg : [value]
        });
        return this;
    }

    setType(type = "fill"){
        this._queue.push({
            type: 'close',
            arg : [type]
        });
        return this;
    }

    /**
     *
     * @param paintDrawer : PaintDrawer
     * @param ratio : number
     * @return {*}
     */
    computeDifference(paintDrawer, ratio = 1){
        const newqueue = paintDrawer._queue;
        const animation = [];
        const maxlength = newqueue.length > this._queue.length ? newqueue.length : this._queue.length;
        const defineIntervals = (start, stop)=>{
            const diff = {
                type: start.type,
                start: start.arg,
                stop: stop.arg,
                ratio: []
            };
            for(let i in start.arg){
                diff.ratio[i] = ["fillStyle", "close"].indexOf(start.type) >= 0 ? stop.arg[i] : (stop.arg[i] - start.arg[i]) / ratio * 60;
            }
            return diff;
        }

        for(let i = 0; i < maxlength; i++){
            if(i in this._queue){
                if(i in paintDrawer._queue){
                    if(this._queue[i].type === paintDrawer._queue[i].type){
                        animation.push(defineIntervals(this._queue[i], paintDrawer._queue[i]));
                    }
                    else{
                        animation.push(defineIntervals(paintDrawer._queue[i], paintDrawer._queue[i]));
                    }
                }
                else{
                    animation.push(defineIntervals(this._queue[i], this._queue[i]));
                }
            }
            else{
                animation.push(defineIntervals(paintDrawer._queue[i], paintDrawer._queue[i]));
            }
        }

        return animation;
    }
}

export class PaintControl{
    /**
     *
     * @type PaintDrawer|null
     * @private
     */
    _design = null;
    _canvas = null;
    _context = null;
    _animating = false;
    _timer = null;
    /**
     *
     * @param canvas : HTMLCanvasElement
     * @return {PaintControl}
     */
    defineCanvas(canvas){
        if(!(canvas instanceof HTMLElement) || canvas.tagName.toLowerCase() !== 'canvas'){
            throw new Error("canvas element required !");
        }
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        return this;
    }

    /**
     *
     * @param paintDrawer : PaintDrawer
     */
    draw(paintDrawer){
        // if(!(paintDrawer instanceof PaintDrawer)){
        //     console.log('[Object]', paintDrawer, typeof paintDrawer);
        //     throw new Error("[draw] PaintDrawer instance expected !");
        // }
        this._design = paintDrawer;
        console.log({width: this._canvas.width, height: this._canvas.height});
        this._context.clearRect(0,0,this._canvas.width, this._canvas.height);
        this._context.beginPath();
        for(let path of paintDrawer._queue){
            this._applier(path);
        }
        return this;
    }

    refresh(){
        if(!this._animating && this._design){
            this.draw(this._design);
        }
        return this;
    }

    /**
     *
     * @param path
     * @private
     */
    _applier(path){
        if(["fillStyle", "close"].indexOf(path.type) < 0){
            this._context[path.type].apply(this._context, path.arg);
        }
        else{
            switch (path.type){
                case "fillStyle":
                    this._context.fillStyle = path.arg[0];
                    break;
                case "close":
                    this._context[path.arg[0]]();
                    break;
            }
        }
        return this;
    }

    /**
     *
     * @param nextDrawer : PaintDrawer
     * @param duration : number
     */
    animate(nextDrawer, duration = 200){
        // if(!(nextDrawer instanceof PaintDrawer)){
        //     throw new Error("[animate] PaintDrawer instance expected !");
        // }
        const design = this._design.computeDifference(nextDrawer, duration);
        const requestAnimation = window.requestAnimationFrame;
        const time = {
            start : new Date().getTime(),
            stop: null
        }
        const constraintBound = (part, tolerance = 0.1)=>{
            const final = {
                type: part.type,
                arg : []
            }
            time.stop = new Date().getTime();
            for(let i in part.start){
                if(duration - (time.stop - time.start) > tolerance) {
                    if(["fillStyle", "close"].indexOf(part.type) >= 0){
                        final.arg[i] = part.stop[i];
                    }
                    else {
                        final.arg[i] = part.start[i] + part.ratio[i];
                        part.start[i] = part.start[i] + part.ratio[i];
                    }
                }
                else{
                    final.arg[i] = part.stop[i];
                    this._animating = false;
                }
            }
            return final;
        }
        console.log('[Initial]', this._design._queue, this._canvas.width, this._canvas.height);
        const drawFrame = ()=>{
            let part = null;
            // this._context.save();
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            // this._context.beginPath();
            console.log("==============================================")
            for(let draw of design) {
                part = constraintBound(draw);
                console.log('[part]',part.type, part.arg.join(","));
                this._applier(part);
            }
            // this._context.restore();
            if(!this._animating){
                this._design = nextDrawer;
                console.log('[Stop]...')
            }
            else{
                requestAnimation(()=> { drawFrame() });
            }
        }
        this._animating = true;
        // drawFrame();
        requestAnimation(()=> { drawFrame() });
        return this;
    }
}

export default function Painter({
    width = 200,
    height = 100,
    className = "",
    paintControl= null
}){
    const ref = useRef();
    useEffect(()=>{
        if(paintControl) {
            paintControl.defineCanvas(ref.current).refresh();
        }
    }, [ref, width, height]);
    return (
        <canvas ref={ref} className={className} width={width} height={height}/>
    )
}