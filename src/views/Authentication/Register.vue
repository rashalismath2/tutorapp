<template>
    <ion-page>
        <ion-content>
            <div id="register-cont">
                <div id="master-icon">
                    <img src="../../src/icons/professor.png" />
                </div>
                <ion-text color="secondary">
                    <h2>Sign Up</h2>
                    <p>Register yourself</p>
                </ion-text>
                <div class="ion-margin">
                    <form v-on:submit.prevent="register" class="ion-margin">
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">First Name</ion-label>
                            <ion-input v-on:change="texChanged" type="text" v-model="firstName" required  />
                        </ion-item>
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">Last Name</ion-label>
                            <ion-input v-on:change="texChanged" type="text"  v-model="lastName" required  />
                        </ion-item>
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">Email</ion-label>
                            <ion-input v-on:change="texChanged" type="email" autocomplete="email" v-model="email" required inputmode="email" />
                        </ion-item>
                        <ion-item>
                            <ion-label v-bind:class="error_text" position="floating">Password</ion-label>
                            <ion-input v-on:change="texChanged" v-model="password" required type="password" />
                        </ion-item>
                        <ion-button class="ion-margin-top" type="submit" expand="full">SIGN UP</ion-button>
                    </form>
                    <div id="sign-in-options">
                        <ion-text class="ion-margin-top">
                            <p>Already have an account? </p>
                        </ion-text>
                        <ion-text class="ion-margin-top" color="warning">
                            <router-link :to="{name:'Login'}">Sign In</router-link>
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

        </ion-content>
    </ion-page>
</template>

<script>

// import axios from 'axios'

import {IonButton,
        IonItem,
        IonLabel,
        IonText, 
        IonInput, 
        IonPage,
        IonContent,
        IonToast } from "@ionic/vue"

export default{
    components:{
        IonInput,
        IonPage,
        IonContent,
        IonButton,
        IonItem,
        IonLabel,
        IonText,
        IonToast 
    },
    data() {
        return {
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            error_text:"",
            error_message:null
        }
    },
    methods: {
        texChanged(){
            this.error_message=null
            this.error_text=""
        },
        //TODO- how to use config file to get values
        register(){
            // axios.post("http://127.0.0.1:8000/api/auth/master/register",{
            //     email:this.email,
            //     password:this.password
            // })
            // .then(res=>{
            //     console.log(res)
            // })
            // .catch(()=>{
            //     this.error_text="error-text"
            //     this.password=""
            //     this.error_message="Incorrect email or password"
            // })
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

#register-cont{
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

a{
    text-decoration: none;
    color: inherit;
}

</style>