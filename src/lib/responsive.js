
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