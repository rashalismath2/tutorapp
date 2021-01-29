import { createStore } from "vuex" 

import AuthUser from "./modules/AuthUser"
import Groups from "./modules/Groups"
import Requests from "./modules/Requests"


export default createStore({
    strict:true,
    modules:{
        AuthUser:AuthUser,
        Groups:Groups,
        Requests:Requests,
    }
})
