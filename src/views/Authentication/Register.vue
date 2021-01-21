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
                    v-on:submitVerificationCode="submitVerificationCode($event)"
                    v-bind:errorText="error_text"
                    v-on:errorTextChanged="errorTextChanged($event)"
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

                <ion-loading
                    :is-open="loadingDialog"
                    message="Please wait..."
                >
                </ion-loading>
            </div>

        </ion-content>
    </ion-page>
    <RegisterUploadPicture
        v-bind:email="email"
        v-bind:firstName="firstName"
        v-bind:lastName="lastName"
        v-show="hideUploadPicture"
        v-on:submitPictureWithData="submitPictureWithData($event)"
    />

</template>

<script>

import RegisterBasic from "./RegisterBasic.vue"
import RegisterActivation from "./RegisterActivation.vue"
import RegisterUploadPicture from "./RegisterUploadPicture.vue"

import axios from 'axios'

import {
        IonLoading,
        IonPage,
        IonContent,
        IonToast } from "@ionic/vue"

export default{
    components:{
        IonLoading,
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
            loadingDialog:false,

            firstName:"",
            lastName:"",
            email:"",
            password:"",

            error_text:"",
            error_message:null,
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
        submitVerificationCode(code){
            this.loadingDialog=true
            axios.post(process.env.VUE_APP_BACKEND_API+"/auth/master/verifyactivation",{
                activationCode:code,
                email:this.email
            })
            .then(()=>{
                this.loadingDialog=false
                this.hideRegisterActivation=false
                this.hideUploadPicture=true
                this.hideDefaultRegisterPage=false
            })
            .catch(()=>{
                this.loadingDialog=false
                this.error_text="error-text"
                this.error_message="Code does not match"                
            })
        },

        errorTextChanged(){
            this.error_message=null
            this.error_text=""
        },
        submitbasics(data){
            this.loadingDialog=true
            this.error_message=null

            var {firstName,lastName,email,password} =data
            this.firstName=firstName
            this.lastName=lastName
            this.email=email
            this.password=password


            axios.post(process.env.VUE_APP_BACKEND_API+"/auth/master/activationcode",{
                email:this.email
            })
            .then(()=>{
                this.loadingDialog=false
                this.hideRegisterBasic=false
                this.hideRegisterActivation=true
            })
            .catch((e)=>{
                this.loadingDialog=false
                this.error_text="error-text"
                this.error_message=e.message             
            })

        },
        submitPictureWithData(data){
            this.loadingDialog=true
            this.error_message=null
            
            var formData = new FormData();
            formData.append('email',this.email)
            formData.append('firstName',this.firstName)
            formData.append('lastName',this.lastName)
            formData.append('password',this.password)
            formData.append('education',data.education)
            
            if(data.photo!=null){
                formData.append('profile_picture',data.photo)
            }
            formData.append('_method', 'PATCH');

            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }

            axios({
                method: 'post',
                url: process.env.VUE_APP_BACKEND_API+"/auth/master/register",
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(()=>{
                this.loadingDialog=false
                this.$router.replace("/home")
            })
            .catch((e)=>{
                this.error_text="error-text"
                this.loadingDialog=false
                this.error_message=e.message
            })
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
    --border-radius:20px;
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



</style>