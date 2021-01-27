
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
        },
        updateGroup:(state,payload)=>{
            var groups=state.groups.map(group=>{
                if(group.id==payload.groupId){
                    group.groupName=payload.groupName
                    group.description=payload.groupDescription
                }
                return group
            })
            state.groups=groups
        },

    },
    actions:{
        updateGroup:(context,payload)=>{
            context.commit("updateGroup",payload)
        },
    },
}