
import { storage } from "../ext/bridge";

const {getMusic} = window.bridge;

export const Library = {

    __library : [],
    __albums : [],
    __artists : [],

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
            this.__library = this.__sort(await storage.getItem("library"), "title", data => data);
        }
        return this.__library;
    },

    async albumlist(){
        if(this.__albums.length === 0){
            this.__albums = this.__sort(
                await storage.getItem("albums"), 
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

    getAlbum(title){
        for(let album of this.__albums){
            if(album.title == title){
                return album;
            }
        }
        return null;
    },

    async artistList(){
        if(this.__artists.length === 0){
            this.__artists = this.__sort(
                await storage.getItem("artists"), 
                null, 
                (data,refs) => ({
                    avatar: data.albumart,
                    name: refs.index,
                    list: data.list,
                    soungsCount: data.list.length,
                    albums: null
                })
            );
        }

        return this.__artists;
    },

    async __extractArtistAlbums(songs){
        const rawAlbums = await storage.getItem("albums");
        const rawLibrary = await storage.getItem("library");
        const data = {};
        for(let song of songs){
            song = rawLibrary[song];
            if(!(song.album in data)){
                for(let title in rawAlbums){
                    if(song.album === title){
                        data[song.album] = rawAlbums[title];
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
    }
}