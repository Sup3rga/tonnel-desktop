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


export function toArrayBuffer(buffer){
    const array = new ArrayBuffer(buffer.length);
    const raw = new Uint8Array(array);
    for(let i = 0; i < buffer.length; i++){
        raw[i] = buffer[i];
    }
    return array;
}

export function toTimeString(timefloat){
    const hour = Math.floor(timefloat / 3600),
          minute = Math.floor(timefloat % 3600 / 60),
          second = Math.floor(timefloat % 60);
    let result = [];
    if(hour > 0){
        result.push(hour >= 10 ? hour : "0"+hour);
    }
    result.push( minute >= 10 ? minute : "0"+minute);
    result.push(second >= 10 ? second : "0"+second);

    return result.join(" : ");
}