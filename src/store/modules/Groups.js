
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
        AddNewGroup:(state,payload)=>{
           
            var newGroup={
                ...payload,
                "students":[],
                "allowed_std_count":0,
                "not_allowed_std_count":0
            }
            state.groups=[newGroup,...state.groups]
            
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
        RemoveGroup:(state,payload)=>{
            var groups=state.groups.filter(group=>{
                return group.id!=payload.id
            })
            state.groups=groups
        },
        updateGroupsToItsOriginalState:(state,payload)=>{
            var unChangedStudents=payload.group.students.filter(student=>{
                return !student.changed
            })
      
            var changedStudentsWithOriginalState=payload.changedStudents.map(student=>{
                student.changed=null
                student.pre_status=null
                return student
            })
             state.groups=state.groups.map((group)=>{
                if(group.id==payload.groupId.id){
                  group.students=[...unChangedStudents,...changedStudentsWithOriginalState]
                  return group
                }
                return group
              })
       
        },
        deleteUserFromTheGroup:(state,payload)=>{
            state.groups=state.groups.map((group)=>{
                if(group.id==payload.group_id){
                    group.students=group.students.filter(student=>{
                      return student.student_id!==payload.student_id
                  })
                  return group
                }
                return group
              })
        },
        AddRequestMemberToTheGroup:(state,payload)=>{

            state.groups=state.groups.map((group)=>{
                if(group.id==payload.group_id){
                    group.students=[payload,...group.students]
                  return group
                }
                return group
              })
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