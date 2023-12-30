const {ipcRenderer} = require("electron");

const internal = {
    ev: {},
    addListener: (ev, callback)=>{
        if(!(ev in internal.ev)){
            internal.ev[ev] = [];
        }
        internal.ev[ev].push(callback);
    },
    trigger: (ev, args, completion = ()=>{})=>{
        if(!(ev in internal.ev)) return;
        for(let callback of internal.ev[ev]){
            callback(args, completion);
        }
    }
}

const exchange = {
    src: null,
    // From render to main.
    emit: async (channel, args) => {
        return new Promise((res)=>{
            ipcRenderer.send(channel, args);
            ipcRenderer.on(channel, (emitter, ...args)=>{
                res(...args)
            })
        })
    },
    // From main to render.
    on: (channel, listener) => {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
        internal.addListener(channel, listener);
    },
    bridge: async (channel, args) => {
        return new Promise((res)=>{
            ipcRenderer.send("worker::render", {
                source : exchange.src,
                channel,
                args
            });
            ipcRenderer.on(channel, (emitter, response)=>{
                res(response);
            })
        })
    },
};

module.exports = {exchange, internal};