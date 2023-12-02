const { contextBridge, ipcRenderer, BrowserWindow } = require('electron');
const fs = require("fs/promises");
const id3 = require("node-id3");
let lf = require('localforage');

lf.config({
    driver      : lf.INDEXEDDB,
    name        : 'TonneL',
    version     : 1.0,
    storeName   : 'TonneL DataBase',
    description : 'for storage of Muse it data'
});
lf.ready();


const musicPath = "/home/superga/Musique";

async function isReady(){
    let data = await lf.getItem("library");
    if(!data) return false;
    data = typeof data === "object" ? data : JSON.parse(data);
    return Object.keys(data).length > 0;
}

async function init(){
    if(!(await lf.getItem("library"))){
        await lf.setItem("library", []);
    }
    if(!(await lf.getItem("albums"))){
        await lf.setItem("albums", []);
    }
    if(!(await lf.getItem("artists"))){
        await lf.setItem("artists", []);
    }
}

init();

function getImageDataUrl(e){
    let array = new Uint8Array(e),
        string = array.reduce((data,byte) => {
            return data + String.fromCharCode(byte);
        }, '');
    array = null;
    return typeof btoa == 'undefined' ? Buffer.from(string, 'binary').toString('base64') : btoa(string);
}

async function  getMusic(path){
    const file = fs.readFile(path);
    return file;
}

async function initialize(iteration = ()=>{}){
    const list = {}, albums = {}, artists = {};
    let count = {
        music: 0,
        album: 0,
        artist: 0
    };

    const run = async (path)=>{
        try{
            let files = await fs.readdir(path),
                stat, tags, idtag, filepath;
            for(let item of files){
                stat = await fs.stat(path+'/'+item);
                if(stat.isDirectory()){
                    await run(path+"/"+item);
                }
                else if(/\.(mp3|ogg|aac|wav)/.test(item)){
                    // library.push(e);
                    idtag = id3.read(path + "/" + item,{
                        noRaw: true
                    });
                    filepath = path + "/" + item;
                    // console.log('[Item]', item);
                    // iteration(tags);
                    tags = {
                        album: idtag.album ? idtag.album : "unknown",
                        title: idtag.title ? idtag.title : item,
                        artist: idtag.artist ? idtag.artist : "unknown",
                        gender: idtag.genre,
                        year: idtag.year,
                        path: filepath,
                        filename: item,
                        no: idtag.trackNumber,
                        albumart: !('image' in idtag) || idtag.image.mime == null ? '' : ("data:"+idtag.image.mime+";base64," + getImageDataUrl(idtag.image.imageBuffer))
                    };
                    
                    for(let id in idtag){
                        if(['album','title', 'artist', 'trackNumber', 'image'].indexOf(id) < 0 && idtag[id]){
                            tags[id] = idtag[id];
                        }
                    }

                    list[filepath] = tags;
                    count.music++;

                    if(!(tags.album in albums)){
                        albums[tags.album] = {
                            albumart: null,
                            list: []
                        };
                        count.album++;
                    }
                    if(!albums[tags.album].albumart && tags.albumart){
                        albums[tags.album].albumart = tags.albumart;
                    }
                    albums[tags.album].list.push(filepath);

                    if(!(tags.artist in artists)){
                        artists[tags.artist] = {
                            albumart: null,
                            list: []
                        };
                        count.artist++;
                    }
                    if(!artists[tags.artist].albumart && tags.albumart){
                        artists[tags.artist].albumart = tags.albumart;
                    }
                    artists[tags.artist].list.push(filepath);
                    iteration(count);
                }
            }
        }catch(err){
            console.log('[Read dir error]', err);
        }
    }
    await run(musicPath);
    await lf.setItem("library", list);
    await lf.setItem("albums", albums);
    await lf.setItem("artists", artists);
    
    return list;
}

function resize(){
    ipcRenderer.emit("resize", {
        width: 800,
        height: 600,
        resizable: true
    });
}

async function fetchLibrary(){
    const list = [];
    const data = await lf.getItem("library");
    for(let i in data){
        list.push(data[i]);
    }
    return list;
}

const exchange = {
    // From render to main.
    emit: (channel, args) => {
        console.log('[Cool]...');
        ipcRenderer.send(channel, args);
    },
    // From main to render.
    on: (channel, listener) => {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
    }
}

contextBridge.exposeInMainWorld('bridge', {
    fetchLibrary, resize, isReady, exchange, initialize,
    getMusic
})