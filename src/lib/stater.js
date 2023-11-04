
const State = {

    __workBook : {},
    __events: [],
    __modals: {},

    init(id, stateCtl){
        this.__workBook[id] = stateCtl;
        return this;
    },

    bind(id, controller){
        this.__modals[id] = controller;
        return this;
    },

    control(id, index, value){
        if(id in this.__modals){
            this.__modals[id].setModalControl(id, index, value);
        }
        return this;
    },

    get(id){
        if(id in this.__workBook){
            return this.__workBook[id];
        }
        return [null, ()=>{}];
    },

    set(id, state, update = true){
        if(id in this.__workBook){
            if(
                update && 
                typeof this.__workBook[id][0] === 'object' && typeof this.__workBook[id][0] &&
                typeof state == 'object' && state
            ){
                state = {...this.__workBook[id][0], ...state};
            }
            this.__workBook[id][1](state);
            this.broadcast(id, state);
        }
        return this;
    },

    broadcast(target, data){
        for(let event of this.__events){
            if(event.target === target){
                event.callback(data);
            }
        }
        return State;
    },

    watch(target, callback){
        this.__events.push({
            target,
            callback
        });
        return State;
    }
}

export default State;