
import { storage } from "../ext/bridge";
import Presets from "./presets";

const {getMusic} = window.bridge;

export const Library = {

    __library : [],
    __albums : [],
    __artists : [],
    __rawAlbums: null,
    __rawLibrary: null,
    __rawArtists: null,

    __sort(data,primaryIndex, provider, debug = false){
        const list = [];
        let sortables = [];
        let refs = [];
        let index;
        let sortable;
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

    async all(){
        if(this.__library.length === 0){
            this.__rawLibrary = await storage.getItem("library");
            this.__library = this.__sort(this.__rawLibrary, "title", data => data);
        }
        return this.__library;
    },

    async albumlist(){
        if(this.__albums.length === 0){
            this.__rawAlbums = await storage.getItem("albums");
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

    searchAlbumsByKey(key, anyBound = false){
        const list = [];
        for(let album of this.__albums){
            if(
                (!anyBound && album.title.toLowerCase().indexOf(key.toLowerCase()) == 0) ||
                (anyBound && album.title.toLowerCase().indexOf(key.toLowerCase()) >= 0)
            ){
                list.push(album);
            }
        }
        return list;
    },


    searchSongByKey(key, anyBound = false){
        const list = [];
        for(let song of this.__library){
            if(
                (!anyBound && song.title.toLowerCase().indexOf(key.toLowerCase()) == 0) ||
                (anyBound && song.title.toLowerCase().indexOf(key.toLowerCase()) >= 0)
            ){
                list.push(song);
            }
        }
        return list;
    },

    getAlbum(title){
        this.albumlist();
        for(let album of this.__albums){
            if(album.title == title){
                return album;
            }
        }
        return null;
    },

    async artistList(){
        if(this.__artists.length === 0){
            this.__rawArtists = await storage.getItem("artists");
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

    getArtist(name){
        this.artistList();
        for(let artist of this.__artists){
            if(artist.name == name){
                return artist;
            }
        }
        return null;
    },

    extractArtistAlbums(songs){
        // const rawAlbums = await storage.getItem("albums");
        // const rawLibrary = await storage.getItem("library");
        const data = {};
        for(let song of songs){
            song = this.__rawLibrary[song];
            if(!(song.album in data)){
                for(let title in this.__rawAlbums){
                    if(song.album === title){
                        data[song.album] = this.__rawAlbums[title];
                        break;
                    }
                }
            }
        }
        return this.__sort(data, null, (data,refs) => ({
            albumart: data.albumart,
            title: refs.index,
            list: data.list
        }))
    },

    async allPath(){
        const list = [];
        for(let music of this.__library){
            list.push(music.path);
        }
        return list;
    },

    getByPath(path){
        for(let music of this.__library){
            if(music.path === path){
                return music;
            }
        }
    },

    getByPaths(paths){
        const list = [];
        // console.log('[Musics]',this.__library);
        let song;
        for(let path of paths){
            song = Library.getByPath(path);
            if(song) list.push(song);
        }
        return list;
    },

    async getSong(path){
        return await getMusic(path);
    },

    getCurrentPreset(){
        return "flat";
    },

    getPresetValue(name){
        return Presets[name];
    },

    getAllPresets(){
        return Presets;
    }
}