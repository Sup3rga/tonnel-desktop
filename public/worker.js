const {exchange} = require("./exchange");
const id3 = require("node-id3");
const lf = require('localforage');

lf.config({
    driver      : lf.INDEXEDDB,
    name        : 'TonneL',
    version     : 1.0,
    storeName   : 'TonneL DataBase',
    description : 'for storage of Muse it data'
});
lf.ready();

function readTag(url){
    return id3.read(url, {
        noRaw: true
    });
}

const sorter = {
    __library: [],
    __albums: [],
    __artists: [],
    __rawLibrary: {},
    __rawArtists: {},
    __rawAlbums: {},

    __sort(data,primaryIndex, provider, debug = false){
        const list = [];
        let sortables = [];
        let refs = [];
        let index;
        let sortable;
        /**
         * Let's group indexes of song to make easy the sorting.
         */
        for(let i in data){
            index = primaryIndex ? data[i][primaryIndex] : i;
            if(index){
                sortable = index.replace(/^([^a-z]*?)?([a-z].+?)$/i, '$2');
            }
            sortables.push(sortable);
            refs.push({
                index : i,
                sortable
            });
        }
        sortables.sort();
        for(let sortable of sortables){
            for(let i in refs){
                if(sortable === refs[i].sortable){
                    list.push(provider(data[refs[i].index], refs[i]));
                    delete refs[i];
                    break;
                }
            }
        }
        sortables = null;
        refs = null;
        return list;
    },

    async library(reset = false){
        if(this.__library.length === 0 || reset){
            this.__rawLibrary = await lf.getItem("library");
            this.__library = this.__sort(this.__rawLibrary, "title", data => data);
        }
        return this.__library;
    },

    async album(reset = false){
        if(this.__albums.length === 0 || reset){
            this.__rawAlbums = await lf.getItem("albums");
            this.__albums = this.__sort(
                this.__rawAlbums,
                null,
                (data,refs) => ({
                    albumart: data.albumart,
                    title: refs.index,
                    list: data.list
                })
            );
        }

        return this.__albums;
    },

    async artist(reset = false){
        if(this.__artists.length === 0 || reset){
            this.__rawArtists = await lf.getItem("artists");
            this.__artists = this.__sort(
                this.__rawArtists,
                null,
                (data,refs) => ({
                    avatar: data.albumart,
                    name: refs.index,
                    list: data.list,
                    albums: null
                })
            );
        }

        return this.__artists;
    },
}

exchange.src = "worker";

exchange.on("tagreading", (url)=>{
    exchange.bridge("tagreading", readTag(url));
});

exchange.on("sortLibrary", async (reset = false)=>{
    exchange.bridge("check", true);
    exchange.bridge("sortLibrary", await sorter.library(reset))
});

exchange.on("sortAlbums", async (reset = false)=>{
    exchange.bridge("sortAlbums", await sorter.album(reset))
});

exchange.on("sortArtists", async (reset = false)=>{
    exchange.bridge("sortLibrary", await sorter.artist(reset))
});