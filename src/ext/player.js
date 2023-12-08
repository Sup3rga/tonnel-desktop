import State from "../lib/stater";
import Equalizer from "./equalizer";
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
    _source = [null,null];
    _activeSource = -1;
    _queueProvider = Library.allPath.bind(Library);
    _queueIndex = 0;
    _events = [];
    _queue = [];
    _looping = PlayerLoop.ALL;
    _queuing = PlayerQueuing.ALONG;
    _fadeoutTiming = 5000;
    _preloadTime = 5000;
    _transitionning = false;
    _fadeoutMode = FadeoutMode.SAME_LEVEL;
    _playing = false;
    _currentPath = null;
    _timer = [null,null];
    _volume = 1;
    _allowedEvents = ['play', 'pause', 'end', 'progress', "meta-loaded"];
    _equalizer = null;

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
        this._queueIndex = 0;
        this._queue.push(this._currentPath);
        const list = await this._queueProvider(),
              index = list.indexOf(this._currentPath);
        for(let i = index + 1; i < list.length; i++){
            this._queue.push(list[i]);
        }
    }

    setQueueProvider(providerFunc = null){
        this._queueProvider = providerFunc ? providerFunc : Library.allPath.bind(Library);
        return this;
    }

    initQueue(startElement){
        this._currentPath = startElement;
        this.__createQueue();  
        return this;
    }

    __passNext(blob){
        const audio = new Audio();
        // console.log('[Blob]',blob, URL.createObjectURL(blob));
        try{
            audio.src = URL.createObjectURL(blob);
        }catch(e){
            console.log('[Err]',e);
        }

        const diff = this._fadeoutMode;
        const count = this._fadeoutTiming / 70;
        let extreme = Math.floor(count);

        let oldAudio = this._audio;
        const oldSource = this._activeSource;
        this._audio = audio;

        if(this._transitionning && oldSource >= 0){
            // this._source[oldSource].disconnect();
            // oldAudio = null;
            // this._transitionning = false;
        }

        for(let i in this._timer){
            clearInterval(this._timer[i]);
        }

        this._audio.volume = this._volume * (1 - diff[1]);
        this._audio.play();
        
        const amount = {
            up : (this._volume - this._audio.volume) / count,
            down: oldAudio ? oldAudio.volume / count : 0
        };
        console.warn('[Count]', {count,extreme}, amount);
        // console.log('[Volumes]', this._audio.volume, oldAudio.volume, amount, "[times]", );
        this._activeSource = (this._activeSource + 1 ) % 2;
        if(this._source[this._activeSource]){
            this._source[this._activeSource].disconnect();
        }
        this._source[this._activeSource] = this._ctx.createMediaElementSource(this._audio);
        this.__applyEffect(this._source[this._activeSource])
        // this._source[this._activeSource] = this._ctx.createMediaElementSource(this._audio);

        this._transitionning = true;
        this._timer[0] = setInterval(()=>{
            if(!extreme){
                console.warn('[end][0]',0);
                clearInterval(this._timer[0]);
                if(oldSource >= 0){
                    this._source[oldSource].disconnect();
                }
                this._transitionning = false;
                return;
            }
            if(oldAudio){
                if(oldAudio.volume - amount.down < 0){
                    oldAudio.volume = 0;
                }
                else oldAudio.volume -= amount.down;
            }
            if(this._audio.volume + amount.up > this._volume){
                this._audio.volume = this._volume;
            }
            else this._audio.volume += amount.up;
            // console.log('[Volumes]', {
            //     old: oldAudio.volume,
            //     next: this._audio.volume
            // });
            extreme--;
        }, count);
        this._timer[1] = setTimeout(()=>{
            console.warn('[end][1]',1);
        //     if(oldSource >= 0){
        //         this._source[oldSource].disconnect();
        //     }
        //     clearInterval(this._timer[1]);
        //     this._transitionning = false;
        }, this._fadeoutTiming);
    }

    __applyEffect(source){
        if(!this._equalizer) return source.connect(this._ctx.destination);
        this._equalizer.input = source;
        this._equalizer.start();
    }

    setEqualizer(equalizer){
        this._equalizer = equalizer;
        this._equalizer.init(this._ctx);
    }

    async setPath(path){
        console.log('[Path]',path);
        const music = Library.getByPath(path);
        this._currentPath = path;
        this._playing = false;
        State.set("app", {parallax: music.albumart});
        this.__dispatch("meta-loaded", music);
        const musicBuffer = await Library.getSong(path);
        // console.log('[buffer]',musicBuffer);
        const blob = new Blob([musicBuffer]);
        this.__passNext(blob);
        State.broadcast("song-start", path);
        // console.log('[Audio]',this._audio);
        this._audio.addEventListener('timeupdate', ()=>{
            this.__dispatch('progress');
            if(this._audio.currentTime >= this._audio.duration - this._preloadTime / 1000){
                this.__dispatch("end");
                this.next();
            }
        });
    }

    async next(){
        if(this._looping !== PlayerLoop.SINGLE){
            if(this._queueIndex < this._queue.length - 1){
                this._queueIndex++;
            }
            else if(this._looping === PlayerLoop.ALL){
                this._queueIndex = 0;
            }
        }
        await this.setPath(this._queue[this._queueIndex]);
    }

    async back(){
        if(this._looping !== PlayerLoop.SINGLE){
            if(this._queueIndex > 0){
                this._queueIndex--;
            }
            else if(this._looping === PlayerLoop.ALL){
                this._queueIndex = this._queue.length - 1;
            }
        }
        await this.setPath(this._queue[this._queueIndex]);
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

    getCurrentPath(){
        return this._currentPath;
    }

    seek(point){
        // this.pause();
        this._audio.currentTime = point;
        return this;
    }

    setVolume(volume){
        this._volume = volume;
        this._audio.volume = this._volume;
        return this;
    }

    getVolume(){
        return this._volume;
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
export const defaultEqualizer = new Equalizer();
defaultPlayer.setEqualizer(defaultEqualizer);