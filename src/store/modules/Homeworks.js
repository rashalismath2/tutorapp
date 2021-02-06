
export default {
    namespaced: true,
    state:{
        homeworks:[]
    },
    getters:{
        getHomewroks:(state)=>{
            return state.homeworks
        },
    },
    mutations:{
        setHomeworks:(state,payload)=>{
            state.homeworks=payload
        },
        addHomework:(state,payload)=>{
            state.homeworks=[payload,...state.homeworks]
        },
        startHomework:(state,payload)=>{
            state.homeworks=state.homeworks.map(homework=>{
                if(homework.id==payload.id){
                  homework={
                    ...homework,
                    status:"on",
                    started_at:payload.started_at
                  }
                  return homework
                }
                else{
                  return homework
                }
              })
        },
        endHomework:(state,payload)=>{
            state.homeworks=state.homeworks.map(homework=>{
                if(homework.id==payload.id){
                  homework={
                    ...homework,
                    status:"ended",
                    started_at:payload.ended_at
                  }
                  return homework
                }
                else{
                  return homework
                }
              })
        },
      
    },
    actions:{
        // updateGroup:(context,payload)=>{
        //     context.commit("updateGroup",payload)
        // },
    },
}