
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
        updateStudentStatus:(state,payload)=>{
            state.groups=state.groups.map(group=>{
                if(group.id==payload.groupId){
                    group.students=group.students.map(std=>{
                        if(std.id==payload.member.id){
                            //we here put a check if the status has been changed
                            //so that we dont have to change all the users status in db backend
                            if(std.pre_status==null){
                                std.pre_status=std.allowed
                            }

                            //reduce and add allowed and none allowed count
                            if(std.allowed){
                                group.allowed_std_count=group.allowed_std_count-1
                                group.not_allowed_std_count=group.not_allowed_std_count+1
                            }
                            else{
                                group.allowed_std_count=group.allowed_std_count+1
                                group.not_allowed_std_count=group.not_allowed_std_count-1
                            }

                            //change status
                            std.allowed=!std.allowed
                            //if pre status==current allowed, then its not changed
                            if(std.allowed!=std.pre_status){
                                std.changed=true
                            }
                            else{
                                std.changed=false
                            }
                            return std
                        }

                        return std
                    })

                    return group
                }
                return group
            })

        }
    },
    actions:{
        updateGroup:(context,payload)=>{
            context.commit("updateGroup",payload)
        },
    },
}