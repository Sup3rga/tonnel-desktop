import State from "./stater";
import {sizes} from "../ext/bridge";

export default function responsive(dom, control = null){
    if(!(dom instanceof HTMLElement) && typeof dom !== 'function'){
        return;
    }
    if(typeof dom === 'function') control = dom;
    window.addEventListener('resize', ()=>{
        if(control){
            return control();
        }
        dom.style.width = dom.offsetParent.offsetWidth;
        dom.style.height = dom.offsetParent.offsetHeight;
    });
}

export const defaultResponsivness = user => {
    const def = {
        xs : 3,
        s : 4,
        m : 5,
        l : 6,
        xl : 8,
        xxl : 10
    };
    for(let i in user){
        if(i in def) def[i] = user[i];
    }
    return def;
}

export const responsiveReference = {
    xs : 0,
    s : 480,
    m : 768,
    l : 992,
    xl : 1200,
    xxl : 1670
}

export const screenWidth = () => window.innerWidth;

export const screenSizeMatch = sizeLabel => {
    let label = 'xxl';
    const viewport = screenWidth();
    if(viewport < responsiveReference.xxl) label = 'xl';
    if(viewport < responsiveReference.xl) label = 'l';
    if(viewport < responsiveReference.l) label = 'm';
    if(viewport < responsiveReference.m) label = 's';
    if(viewport < responsiveReference.s) label = 'xs';

    return label === sizeLabel.toLowerCase();
}

export const defineDimension = (responsiveness, additionnal = 0, padding = 0) => {
    const {minimal} = State.get("ui")[0]
    const dimension = {
        width: 0,
        height: 0
    };
    for(let sizeLabel in responsiveness){
        if(screenSizeMatch(sizeLabel)){
            dimension.width = (screenWidth() - sizes[minimal ? "minimal" : "maximal"] - padding) / responsiveness[sizeLabel];
            dimension.height = dimension.width + additionnal;
        }
    }
    return dimension;
}