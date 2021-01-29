
export default {
    // requests:[
    //     groupId1:[],
    //     groupId2:[],
    // ]
    namespaced: true,
    state:{
        requests:[]
    },
    getters:{
        getAllTheRequests:(state)=>{
            return state.requests
        },
    },
    mutations:{
        addToRequests:(state,payload)=>{
            if(payload.length!=0){
                state.requests=[
                    {
                        [payload[0].group_id]:payload
                    }
                ]
            }
        },
        RemoveMemberFromRequest:(state,payload)=>{
            state.requests=state.requests.map((request,key)=>{
                if(key==payload.group_id){
                    request=request.filter(member=>{
                        return member.student_id!=payload.student_id
                    })

                    return request
                }
                return request
            })
        }

    },
    actions:{
        // updateGroup:(context,payload)=>{
        //     context.commit("updateGroup",payload)
        // },
    },
}