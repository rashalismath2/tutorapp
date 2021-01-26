<template>
    <ion-page>
        <ion-content>
            <div id="login-cont">
                <div id="master-icon">
                    <img src="../../src/icons/professor.png" />
                </div>
                <ion-text color="secondary">
                    <h2>Sign In</h2>
                    <p>Please login to continue</p>
                </ion-text>
                <div class="ion-margin">
                    <form v-on:submit.prevent="login" class="ion-margin">
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">Email</ion-label>
                            <ion-input v-on:change="texChanged" type="email" autocomplete="email" v-model="email" required inputmode="email" />
                        </ion-item>
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">Password</ion-label>
                            <ion-input v-on:change="texChanged" v-model="password" required type="password" />
                        </ion-item>
                        <ion-button class="ion-margin-top" type="submit" expand="full">SIGN IN</ion-button>
                    </form>
                    <ion-text class="ion-margin" color="warning">
                        <p>Forgot password?</p>
                    </ion-text>
                    <div id="sign-in-options">
                        <ion-text class="ion-margin-top">
                            <p>Don't have an account? </p>
                        </ion-text>
                        <ion-text class="ion-margin-top" color="warning">
                            <router-link :to="{name:'Register'}"><span > Sign Up</span></router-link>
                        </ion-text>
                    </div>
                    <ion-toast
                        class="ion-margin"
                        color="secondary"
                        keyboard-close=true
                        :is-open="error_message!=null"
                        v-bind:message="error_message"
                        duration="3000"
                    >
                    </ion-toast>
                </div>
            </div>

                <ion-loading
                    :is-open="loadingDialog"
                    message="Please wait..."
                />
        </ion-content>
    </ion-page>
</template>

<script>

import AuthUser from "../../services/auth"

import axios from 'axios'

import {IonButton,
        IonItem,
        IonLabel,
        IonText, 
        IonInput, 
        IonPage,
        IonContent,
        IonToast,
        IonLoading,
         } from "@ionic/vue"

export default{
    components:{
        IonInput,
        IonPage,
        IonContent,
        IonButton,
        IonItem,
        IonLabel,
        IonText,
        IonToast ,
        IonLoading,

    },
    data() {
        return {
            email:"",
            password:"",
            error_text:"",
            error_message:null,
            loadingDialog:false
        }
    },
    methods: {
        texChanged(){
            this.error_message=null
            this.error_text=""
        },

        login(){
            this.loadingDialog=true
            axios.post(process.env.VUE_APP_BACKEND_API+"/auth/master/login",{
                email:this.email,
                password:this.password
            })
            .then(res=>{
                this.$store.dispatch("AuthUser/setAccessToken",res.data);
                AuthUser.login(()=>{
                    this.$router.replace({name:"Home"})
                })
            })
            .catch((err)=>{
                this.loadingDialog=false
                this.error_text="error-text"
                this.password=""
                this.error_message="Incorrect email or password"
            })
        }
    },
}

</script>

<style  scoped>

.md,.ios {
  --ion-background-color: var(--ion-color-primary);
}
.md ion-item,.ios ion-item{
  --ion-background-color: #fff;
  --ion-text-color: #000;
}

ion-toast{
    --border-radius:20px
}


a{
    text-decoration: none;
    color: inherit;
}

.error-text{
    color:var(--ion-color-danger)
}

ion-text{
    text-align: center;
}

ion-text h2{
    font-weight: bold;
}
ion-text p{
    margin: 0;
    text-align: center;
}

#login-cont{
    background: white;
    height: 75%;
    border-radius: 50px 50px 0 0;
    position: absolute;
    width: 100%;
    color: black;
    bottom: 0;
}
#master-icon {
    display: flex;
    justify-content: center;
    height: 80px;
}
#master-icon img{
    width: 120px;
    position: absolute;
    top: -50px;
    background: white;
    border-radius: 50%;
    padding: 10px;
    box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
    -webkit-box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
    -moz-box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
}

#sign-in-options{
    display: flex;
    justify-content: center;
}

</style>