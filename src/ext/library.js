
import { storage } from "../ext/bridge";

const {getMusic} = window.bridge;

export const Library = {

    __library : [],
    __albums : [],

    async all(){
        if(this.__library.length !== 0){
            return this.__library;
        }
        const data = await storage.getItem("library");
        const list = [];
        let titles = [];
        let refs = [];
        let title;
        for(let i in data){
            if(data[i].title){
                title = data[i].title.replace(/^([^a-z]*?)?([a-z].+?)$/i, '$2');
            }
            titles.push(title);
            refs.push({
                path : i,
                title: title
            });
        }
        titles.sort();
        for(let title of titles){
            for(let i in refs){
                if(title === refs[i].title){
                    list.push(data[refs[i].path]);
                    delete refs[i];
                    break;
                }
            }
        }
        titles = null;
        refs = null;
        this.__library = list;
        return list;
    },

    async albumlist(){

    },

    async defaultAlbumAlbumArt(album){
        
    },

    async albums(){
        if(this.__albums.length !== 0){
            return this.__albums;
        }
        const data = await storage.getItem("albums");
    },

    async allPath(){
        const list = [];
        for(let music of this.__library){
            list.push(music.path);
        }
        return list;
    },

    async getByPath(path){
        for(let music of this.__library){
            if(music.path === path){
                return music;
            }
        }
    },

    async getSong(path){
        return await getMusic(path);
    }
}