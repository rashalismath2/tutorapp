import { createStore } from "vuex" 

import AuthUser from "./modules/AuthUser"
import Groups from "./modules/Groups"


export default createStore({
    strict:true,
    modules:{
        AuthUser:AuthUser,
        Groups:Groups,
    }
})
