import State from "../lib/stater";
import { toArrayBuffer } from "./bridge";
import { Library } from "./library";

export const PlayerLoop = {
    ALL : 1,
    NONE : 0,
    SINGLE: 2
};

export const PlayerQueuing = {
    SHUFFLE : 1,
    ALONG : 0,
    MIX : 2
};

export const FadeoutMode = {
    SAME_LEVEL : [0.5,0.5],
    HIGH_OUT: [0.7, 0.3],
    HIGH_IN: [0.5,0.7]
}

export default class Player{
    _audio = new Audio();
    _ctx = new AudioContext();
    _source = null;
    _events = [];
    _queue = [];
    _looping = PlayerLoop.ALL;
    _queuing = PlayerQueuing.ALONG;
    _fadeoutTiming = 2000;
    _fadeoutMode = FadeoutMode.HIGH_IN;
    _playing = false;
    _currentPath = null;
    _timer = [null,null];
    _volume = 1;
    _allowedEvents = ['play', 'pause', 'end', 'progress', "meta-loaded"]

    constructor() {
        this.ready = false;
    }

    setSource(src){
        this._audio = new Audio();
        this._audio.src = URL.createObjectURL(src);
        this.ready = true;
        return this;
    }

    __timeupdate(callback){
        const runner = ()=>{
            callback();
            requestAnimationFrame(runner);
        }
        requestAnimationFrame(runner);
    }

    setLooping(looping){
        this._looping = looping;
        return this;
    }

    setQueuing(queuing){
        this._queuing = queuing;
        return this;
    }

    async __createQueue(){
        this._queue = [];
        this._queue.push(this._currentPath);
        const list = await Library.allPath(),
              index = list.indexOf(this._currentPath);
        for(let i = index + 1; i < list.length; i++){
            this._queue.push(list[i]);
        }
    }

    __passNext(blob){
        const audio = new Audio();
        console.log('[Blob]',blob, URL.createObjectURL(blob));
        try{
            audio.src = URL.createObjectURL(blob);
        }catch(e){
            console.log('[Err]',e);
        }

        const diff = this._fadeoutMode;
        const count = this._fadeoutTiming / 30;
        let extreme = Math.floor(count);

        const oldAudio = this._audio;
        this._audio = audio;
        const oldSource = this._source;
        for(let i in this._timer){
            clearInterval(this._timer[i]);
        }

        this._audio.volume = this._volume * (1 - diff[1]);
        
        const amount = {
            up : (this._volume - this._audio.volume) / count,
            down: oldAudio ? oldAudio.volume / count : 0
        };
        // console.log('[Volumes]', this._audio.volume, oldAudio.volume, amount, "[times]", );
        this._source = this._ctx.createMediaElementSource(this._audio);
        this._source.connect(this._ctx.destination);

        this._timer[0] = setInterval(()=>{
            if(!extreme){
                clearInterval(this._timer);
                return;
            }
            if(oldAudio){
                oldAudio.volume -= amount.down;
            }
            this._audio.volume += amount.up;
            extreme--;
        }, count);
        this._timer[1] = setTimeout(()=>{
            if(oldSource){
                oldSource.disconnect();
            }
        }, this._fadeoutTiming);
    }

    async setPath(path){
        const music = await Library.getByPath(path);
        // console.log('[Path]',path, music);
        this._currentPath = path;
        this._playing = false;
        State.set("app", {parallax: music.albumart});
        this.__dispatch("meta-loaded", music);
        const musicBuffer = await Library.getSong(path);
        console.log('[buffer]',musicBuffer);
        const blob = new Blob([musicBuffer]);
        this.__passNext(blob);
        // console.log('[Audio]',this._audio);
        this._audio.addEventListener('timeupdate', ()=>{
            this.__dispatch('progress');
            if(this._audio.currentTime >= this._audio.duration - this._fadeoutTiming / 1000){
                this.__dispatch("end");
                this.next();
            }
        });
    }

    async next(){
        await this.__createQueue();
        if(this._queue.length > 1){
            await this.setPath(this._queue[1]);
            this.play();
        }
    }

    play(){
        if(!this._audio) return;
        if(!this._playing){
            this._audio.play(); 
            this._playing = true;
            this.__dispatch('play');
        }
        return this;
    }

    pause(){
        if(!this._audio) return;
        if(this._playing){
            this._audio.pause();
            this._playing = false;
            this.__dispatch('pause');
        }
        return this;
    }

    seek(point){
        console.log('[Point]',point);
        // this.pause();
        this._audio.currentTime = point;
        return this;
    }

    setVolume(volume){
        this._volume = volume;
        this._audio.volume = this._volume;
        return this;
    }

    on(event, callback){
        if(typeof callback !== 'function'){
            throw new Error("argument 2 is expected to be a function");
        }
        this._events.push({
            event,
            callback
        });
        return this;
    }

    __defaultResponse(){
        return {
            currentTime : this._audio.currentTime,
            duration : this._audio.duration,
            progression: Math.round(this._audio.currentTime / this._audio.duration * 1000) / 10
        }
    }
    
    __dispatch(_eventType, arg = null){
        for(let event of this._events){
            if(_eventType == event.event){
                event.callback(arg ? arg : this.__defaultResponse());
            }
        }
    }
}

export const defaultPlayer = new Player();