import { createStore } from "vuex" 

import AuthUser from "./modules/AuthUser"


export default createStore({
    strict:true,
    modules:{
        AuthUser:AuthUser
    }
})
