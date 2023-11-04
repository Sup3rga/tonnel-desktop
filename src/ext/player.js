
export default class Player{
    _audio = null;

    constructor() {
        this.ready = false;
    }
    setSource(src){
        this._audio = new Audio();
        this._audio.src = URL.createObjectURL(src);
        this.ready = true;
        console.log('[Audio]', src, {audio: this._audio});
    }

    isReady(){
        return this._audio !== null;
    }

    play(){
        console.log('[Trying] to play');
        this._audio.play();
    }
}