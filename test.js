
let timer = null;
function test(val){
    clearTimeout(timer);
    console.log('[Timer begin]', val);
    timer = setTimeout(()=>{
        console.log('[Timer finish]', val);
    }, 500);
}

const tab = [1,2,3,4,5];

for(let val of tab){
    test(val);
}