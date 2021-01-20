<template>
    <ion-page v-show="hideDefaultRegisterPage">
        <ion-content>
            <div id="register-cont">
                <div id="master-icon">
                    <img src="../../src/icons/professor.png" />
                </div>
                <RegisterBasic
                    v-show="hideRegisterBasic"
                    v-bind:errorText="error_text"
                    v-on:errorTextChanged="errorTextChanged($event)"
                    v-on:submitbasics="submitbasics($event)" />
                
                <RegisterActivation 
                    v-on:reEditDetails="reEditDetails($event)"
                    v-on:resendActivationCode="resendActivationCode($event)"
                    v-on:activationSuccess="activationSuccess($event)"
                    v-bind:verificationCode="verificationCode"
                    v-show="hideRegisterActivation" />

          
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

        </ion-content>
    </ion-page>
    <RegisterUploadPicture
        v-bind:email="email"
        v-bind:firstName="firstName"
        v-bind:lastName="lastName"
        v-show="hideUploadPicture"
    />

</template>

<script>

import RegisterBasic from "./RegisterBasic.vue"
import RegisterActivation from "./RegisterActivation.vue"
import RegisterUploadPicture from "./RegisterUploadPicture.vue"

// import axios from 'axios'

import {
        IonPage,
        IonContent,
        IonToast } from "@ionic/vue"

export default{
    components:{
        RegisterBasic,
        RegisterUploadPicture,
        RegisterActivation,
        IonPage,
        IonContent,

        IonToast 
    },
    data() {
        return {
            hideRegisterBasic:true,
            hideRegisterActivation:false,
            hideUploadPicture:false,
            hideDefaultRegisterPage:true,

            firstName:"",
            lastName:"",
            email:"",
            password:"",
            error_text:"",
            error_message:null,
            verificationCode:null
        }
    },
    methods: {
        reEditDetails(){
            this.hideRegisterBasic=true
            this.hideRegisterActivation=false

            console.log()
        },
        resendActivationCode(){
        
        },
        activationSuccess(){
            this.hideRegisterActivation=false
            this.hideUploadPicture=true
            this.hideDefaultRegisterPage=false
        },
        errorTextChanged(){
            this.error_message=null
            this.error_text=""
        },
        submitbasics(data){
            console.log(data)

            var {firstName,lastName,email,password} =data
            this.firstName=firstName
            this.lastName=lastName
            this.email=email
            this.password=password

            this.hideRegisterBasic=false
            this.hideRegisterActivation=true

            this.verificationCode=5555
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

<style >

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



</style>