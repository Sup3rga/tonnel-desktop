
export default function responsive(dom, control = null){
    if(!(dom instanceof HTMLElement)){
        return;
    }
    window.addEventListener('resize', ()=>{
        // console.log('[Resize]');
        if(control){
            return control();
        }
        dom.style.width = dom.offsetParent.offsetWidth;
        dom.style.height = dom.offsetParent.offsetHeight;
    });
}