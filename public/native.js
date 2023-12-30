const { contextBridge, ipcRenderer, ipcMain } = require('electron');
const fs = require("fs/promises");
const id3 = require("node-id3");
const lf = require('localforage');
const {watch} = require('chokidar');
const {internal, exchange} = require("./exchange");
const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./cache.db", (err)=>{
    console.log('[Err]', err);
})

console.log('[DB]',db);

lf.config({
    driver      : lf.INDEXEDDB,
    name        : 'TonneL',
    version     : 1.0,
    storeName   : 'TonneL DataBase',
    description : 'for storage of Muse it data'
});
lf.ready();

exchange.src = "render";

const allowedType = /\.(mp3|ogg|aac|wav)/;

const musicPath = "/home/superga/Music";
async function isReady(){
    let data = await lf.getItem("library");
    if(!data) return false;
    data = typeof data === "object" ? data : JSON.parse(data);
    return Object.keys(data).length > 0;
}

async function getTags(url){
    return await exchange.bridge("tagreading", url);
}

const useSchedule = (()=>{
    const works = [];
    const waitings = [];
    async function worker(deadline){
        if(deadline.timeRemaining() > 1 && works.length){
            const func = works[0];
            const waiter = waitings.length && waitings[0].func === func ? waitings[0] : null;
            const result = await func();
            if(waiter){
                waiter.callback(result);
            }
            works.shift();
            waitings.shift();
        }
        if(works.length){
            requestIdleCallback(worker);
        }
    }

    return (func)=>{
        return new Promise((res)=>{
            const launchAgain = works.length === 0;
            works.push(func);
            // console.log('[Len]', works.length);
            waitings.push({
                func,
                callback: (result)=>{
                    res(result);
                }
            })
            if(launchAgain){
                requestIdleCallback(worker);
            }
        })
    }
})();


const useCache = (()=>{
    let library = {};
    let albums = {};
    let artists = {};
    let timer = null;

    lf.getItem("library").then((val)=>{
        if(!val) return lf.setItem("library", {});
        library = val;
    });
    lf.getItem("albums").then((val)=>{
        if(!val) return lf.setItem("albums", {});
        albums = val;
    });
    lf.getItem("artists").then((val)=>{
        if(!val) return lf.setItem("artists", {});
        artists = val;
    });

    async function save(){
        // console.error("[SAVE]",{library,albums,artists})
        await lf.setItem("library", library);
        await lf.setItem("albums", albums);
        await lf.setItem("artists", artists);
    }

    /**
     *
     * @param filepath
     * @param add
     * @param autosave
     * @param lazy
     * @param alternative
     * @returns {Promise<unknown>}
     */
    async function write(filepath, add = true, autosave = true, lazy = true, alternative = false){
        // console.log('[Start] file', filepath);
        const func = async ()=>{
            let idtag = null;
            const count = {
                music : 0, album : 0, artist: 0,
                albumName: "", artistName: "", musicName: ""
            };

            idtag = add ? alternative ? await getTags(filepath) : id3.read(filepath, {
                    noRaw: true
                }) : library[filepath];

            let filename = filepath.split("/");
            filename = filename[filename.length - 1];

            if(add) {

                const tags = {
                    album: idtag.album ? idtag.album : "unknown",
                    title: idtag.title ? idtag.title : filename,
                    artist: idtag.artist ? idtag.artist : "unknown",
                    gender: idtag.genre,
                    year: idtag.year,
                    path: filepath,
                    filename: filename,
                    no: idtag.trackNumber,
                    albumart: !('image' in idtag) || idtag.image.mime == null ? '' : ("data:"+idtag.image.mime+";base64," + getImageDataUrl(idtag.image.imageBuffer))
                };

                count.musicName = tags.title;
                count.albumName = tags.album;
                count.artistName = tags.artist;

                for (let id in idtag) {
                    if (['album', 'title', 'artist', 'trackNumber', 'image'].indexOf(id) < 0 && idtag[id]) {
                        tags[id] = idtag[id];
                    }
                }

                library[filepath] = tags;
                count.music++;

                if (!(tags.album in albums)) {
                    albums[tags.album] = {
                        albumart: null,
                        list: []
                    };
                    count.album++;
                }
                if (!albums[tags.album].albumart && tags.albumart) {
                    albums[tags.album].albumart = tags.albumart;
                }
                albums[tags.album].list.push(filepath);

                if (!(tags.artist in artists)) {
                    artists[tags.artist] = {
                        albumart: null,
                        list: []
                    };
                    count.artist++;
                }
                if (!artists[tags.artist].albumart && tags.albumart) {
                    artists[tags.artist].albumart = tags.albumart;
                }
                artists[tags.artist].list.push(filepath);
            }
            else{
                const tags = idtag;

                count.musicName = tags ? tags.title : null;
                count.albumName = tags ? tags.album : null;
                count.artistName = tags ? tags.artist : null;

                delete library[filepath];
                if(tags) {
                    if (tags.album in albums) {
                        albums[tags.album].list = albums[tags.album].list.filter((val) => {
                            return val !== filepath;
                        });
                        if (!albums[tags.album].list.length) {
                            delete albums[tags.album];
                        }
                    }
                    if (tags.artist in artists) {
                        artists[tags.artist].list = artists[tags.artist].list.filter((val) => {
                            return val !== filepath;
                        });
                        if (!artists[tags.artist].list.length) {
                            delete artists[tags.artist];
                        }
                    }
                }
            }
            if(autosave){
                await save();
            }
            return count;
        };
        if(!lazy) return await func();
        return await useSchedule(func);
    }


    return ()=> [
        write,
        async ()=>{
            library = await lf.getItem("library");
            albums = await lf.getItem("albums");
            artists = await lf.getItem("artists");
        },
        save,
        (index)=>{
            switch (index){
                case "library": return library;
                case "albums": return albums;
                case "artists": return artists;
            }
        },
        (path)=>{
            clearTimeout(timer);
            write(path, false, false, false);
            timer = setTimeout(()=>{
                save().then(()=>{
                    internal.trigger("library-update", null, ()=>{
                        internal.trigger("artists-update", null);
                        internal.trigger("albums-update", null);
                    });
                }).catch((err)=>{
                    console.log('[Commit error]',err);
                })
            }, 500);
        }
    ]
})();

const [updateCache, resetCache, saveCache, getCache, massDeletion] = useCache();

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
    const list = {};
    let count = {
        music: 0,
        album: 0,
        artist: 0
    };

    const run = async (path)=>{
        try{
            let files = await fs.readdir(path),
                stat;
            for(let item of files){
                stat = await fs.stat(path+'/'+item);
                if(stat.isDirectory()){
                    await run(path+"/"+item);
                }
                else if(allowedType.test(item)){
                    // console.warn('[Item].', path +"/"+item);
                    const {music, artist, album} = await updateCache(path + "/" + item, true, false);
                    count.music += music;
                    count.artist += artist;
                    count.album += album;
                    iteration(count);
                }
            }
        }catch(err){
            console.log('[Read dir error]', err);
        }
    }
    await run(musicPath);
    await saveCache();
    
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

async function activateWatcher(){
    const library = getCache("library");

    const eye = watch(musicPath, {
        persistent: true
    });
    eye.on("all", async (paths, stats)=>{
        // console.log({paths, stats});
        if(allowedType.test(stats)){
            if(paths == "add" && !(stats in library)){
                const {music, artistName, albumName} = await updateCache(stats, true, true, true, true);
                if(music) {
                    internal.trigger("library-update", stats, ()=>{
                        internal.trigger("artists-update", artistName);
                        internal.trigger("albums-update", albumName);
                    });
                }
            }
            else if(paths == "change"){
                console.log('[Change]', stats)
            }
            else if(paths == "unlink" && stats in library){
                massDeletion(stats);
            }
        }
    });
}

contextBridge.exposeInMainWorld('bridge', {
    fetchLibrary, resize, isReady, exchange, initialize,
    getMusic, activateWatcher
})