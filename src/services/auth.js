import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import axios from "axios"

import store from '../store/store'


class AuthUser{

    constructor(){
        this.authenticated=false
    }

    login(cb){
        this.setAuthUser()
        this.authenticated=true
        cb()
    }

    async setAuthUser(){
        const { id } = await Storage.get({ key: 'id' });
        if(id==null){
            axios.get(process.env.VUE_APP_BACKEND_API+"/auth/master/user-profile",{
                headers:{
                    Authorization:"Bearer "+store.getters.getAccessToken
                }
            })
            .then(res=>{
                store.dispatch("setAuthUser",res.data)
            })
            .catch(e=>{
                console.log(e)
            })
        }
        else{
            store.dispatch("initiateAuthState")
        }
    }

}

export default new AuthUser()