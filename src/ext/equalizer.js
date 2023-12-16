
class Filter{
    _bound = 0;
    _frequency = 0;
    _gain = 0;
    quality = 0;
    _type = "";
    _filter = null;
    
    constructor(filter){
        this._filter = filter;
    }

    setBound(bound){
        this._bound = bound;
        this._frequency = bound;
    }

    setType(type){
        this._type = type;
    }

    getGain(){
        return this._gain;
    }

    getFrequency(){
        return this._frequency;
    }

    getBound(){
        return this._bound;
    }

    rate(percent){
        // if(percent == 0.5) percent = 0;
        // else if(percent > 0.5) percent
        percent = 2 * percent - 1;
        this._frequency = this._bound * percent;
        this._gain = 15 * percent;
        // console.log('[frequency]', this._frequency);
        this._filter.frequency.value = this._frequency;
        this._filter.gain.value = this._gain;
    }

    accept(source){
        // console.log('[Source]',source, this._filter);
        source.connect(this._filter);
    }

    connect(destination){
        this._filter.frequency.value = this._frequency;
        this._filter.type = this._type;
        return this._filter.connect(destination);
    }
}

export default class Equalizer{
    input = null;
    _output = null;
    _ctx = null;
    _filters = [];

    init(audiocontext){
        this._ctx = audiocontext;

        const rates = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        
        for(let index in rates){
            this._filters[index] = new Filter(this._ctx.createBiquadFilter());
            // if(index == 0) this._filters[index].setType("lowpass");
            if(index == 0) this._filters[index].setType("lowshelf");
            else if(index == rates.length - 1) this._filters[index].setType("highshelf");
            // else if(index == rates.length - 1) this._filters[index].setType("highpass");
            else this._filters[index].setType("peaking");

            this._filters[index].setBound(rates[index]);
        }
    }

    getFilter(index){
        if(index in this._filters){
            return this._filters[index];
        }
        return new Filter();
    }

    start(destination = null){
        let source = this.input;
        for(let filter of this._filters){
            if(source){
                filter.accept(source);
            }
            source = filter;
        }
        // console.log('[INputs]', this.input, source);
        source.connect(destination ? destination : this._ctx.destination);
    }
}