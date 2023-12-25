import * as lf from "localforage";

lf.config({
    driver      : lf.INDEXEDDB,
    name        : 'TonneL',
    version     : 1.0,
    storeName   : 'TonneL DataBase',
    description : 'for storage of Muse it data'
});
lf.ready();

export const storage = lf;


export const sizes = {
    minimal : 90,
    maximal: 200
};


export function toArrayBuffer(buffer){
    const array = new ArrayBuffer(buffer.length);
    const raw = new Uint8Array(array);
    for(let i = 0; i < buffer.length; i++){
        raw[i] = buffer[i];
    }
    return array;
}

export function toTimeString(timefloat){
    let hour = Math.floor(timefloat / 3600),
          minute = Math.floor(timefloat % 3600 / 60),
          second = Math.floor(timefloat % 60);
    hour = isNaN(hour) ? 0 : hour;
    minute = isNaN(minute) ? 0 : minute;
    second = isNaN(second) ? 0 : second;

    let result = [];
    if(hour > 0){
        result.push(hour >= 10 ? hour : "0"+hour);
    }
    result.push( minute >= 10 ? minute : "0"+minute);
    result.push(second >= 10 ? second : "0"+second);

    return result.join(" : ");
}

export function round(number, precision = 1){
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}


export function rand(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

export function alphaNumber(number){
    if(number < 1000) return number;
    if(number < 1000000) return round(number / 1000, 2) + "K";
    if(number < 1000000000) return round(number / 1000000, 2) + "M";
    return round(number / 1000000000, 2) + "G";
}

export function extractSyncedLyrics(lyricsData){
    const result = {
        timestamps:[],
        texts: []
    };
    console.log('[data]', lyricsData)
    for(let lyric of lyricsData){
        result.timestamps.push(lyric.timeStamp);
        result.texts.push(lyric.text);
    }

    return result;
}