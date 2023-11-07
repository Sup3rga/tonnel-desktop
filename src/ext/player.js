import State from "../lib/stater";
import { toArrayBuffer } from "./bridge";
import { Library } from "./library";

export default class Player{
    _audio = new Audio();
    _ctx = new AudioContext();
    _source = null;
    _events = [];
    _allowedEvents = ['play', 'pause', 'end', 'progress', "meta-loaded"]

    constructor() {
        this.ready = false;
    }

    setSource(src){
        this._audio = new Audio();
        this._audio.src = URL.createObjectURL(src);
        this.ready = true;
        console.log('[Audio]', src, {audio: this._audio});
    }

    __timeupdate(callback){
        const runner = ()=>{
            callback();
            requestAnimationFrame(runner);
        }
        requestAnimationFrame(runner);
    }

    async setPath(path){
        const music = await Library.getByPath(path);
        // console.log('[Path]',path, music);
        State.set("app", {parallax: music.albumart});
        this.__dispatch("meta-loaded", music);
        const musicBuffer = await Library.getSong(path);
        const blob = new Blob([musicBuffer]);
        this._audio.src = URL.createObjectURL(blob);
        // console.log('[Audio]',this._audio);
        this._audio.addEventListener('timeupdate', ()=>{
            this.__dispatch('progress');
        });
        if(!this._source){
            this._source = this._ctx.createMediaElementSource(this._audio);
            this._source.connect(this._ctx.destination);
        }
    }



    play(){
        if(!this._audio) return;
        this._audio.play();
        this.__dispatch('play');
        return this;
    }

    pause(){
        if(!this._audio) return;
        this._audio.pause();
        this.__dispatch('pause');
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