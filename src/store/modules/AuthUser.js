import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


export default {
    namespaced: true,
    state:{
        authUser:{
            id:null,
            firstName:null,
            lastName:null,
            education :null,
            profile_img :null,
            access_token:null
        }
    },
    getters:{
        getAuthUser:(state)=>{
            return state.authUser
        },
        getAccessToken:(state)=>{
            return state.authUser.access_token
        }
    },
    mutations:{
        setAuthUser:(state,payload)=>{
            state.authUser.id=payload.id
            state.authUser.firstName=payload.firstName
            state.authUser.lastName=payload.lastName
            state.authUser.education=payload.education
        },
        setAccessToken:(state,payload)=>{
            state.authUser.access_token=payload.access_token
        },
        initiateAuthState:(state,payload)=>{
            
            state.authUser.id=payload.id
            state.authUser.firstName=payload.firstName
            state.authUser.lastName=payload.lastName
            state.authUser.education=payload.education
            state.authUser.access_token=payload.access_token
            
        }
    },
    actions:{
        initiateAuthState:async (context)=>{
            const id = await Storage.get({ key: 'id' });
            const firstName = await Storage.get({ key: 'firstName' });
            const  lastName = await Storage.get({ key: 'lastName' });
            const education  = await Storage.get({ key: 'education' });
            
            const access_token = await Storage.get({ key: 'access_token' });
            
            context.commit("initiateAuthState",{
                firstName:firstName.value,
                lastName:lastName.value,
                id:id.value,
                education:education.value,
                access_token:access_token.value
            })
        },
        setAuthUser:async (context,payload)=>{
            await Storage.set({
                key: 'firstName',
                value: payload.firstName
            });
            await Storage.set({
                key: 'lastName',
                value: payload.lastName
            });
            await Storage.set({
                key: 'id',
                value: payload.id
            });
            await Storage.set({
                key: 'profile_img',
                value: payload.profile_img 
            });
            await Storage.set({
                key: 'education',
                value: payload.education 
            });

            context.commit("setAuthUser",payload)
        },
        setAccessToken:async (context,payload)=>{
            await Storage.set({
                key: 'access_token',
                value: payload.access_token 
            });
            context.commit("setAccessToken",payload)
        }
    },
}