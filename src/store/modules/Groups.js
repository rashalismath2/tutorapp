
export default {
    namespaced: true,
    state:{
        groups:[]
    },
    getters:{
        getGroups:(state)=>{
            return state.groups
        },
    },
    mutations:{
        setGroups:(state,payload)=>{
            state.groups=payload
        }
    },
    actions:{

    },
}