<template>
    <div class="ion-margin">
        <form v-on:submit.prevent="submitBasics"  class="ion-margin">
            <ion-item>
                <ion-label v-bind:class="errorText" position="floating">First Name</ion-label>
                <ion-input v-on:change="texChanged" type="text" v-model="firstName" required  />
            </ion-item>
            <ion-item>
                <ion-label v-bind:class="errorText" position="floating">Last Name</ion-label>
                <ion-input v-on:change="texChanged" type="text"  v-model="lastName" required  />
            </ion-item>
            <ion-item>
                <ion-label v-bind:class="errorText" position="floating">Email</ion-label>
                <ion-input inputmode="email" v-on:change="texChanged" type="email" autocomplete="email" v-model="email" required  />
            </ion-item>
            <ion-item>
                <ion-label v-bind:class="errorText" position="floating">Password</ion-label>
                <ion-input v-on:change="texChanged" v-model="password" required type="password" />
            </ion-item>
            <ion-button class="ion-margin-top" type="submit" expand="full">NEXT</ion-button>
        </form>
        <div id="sign-in-options">
            <ion-text class="ion-margin-top">
                <p>Already have an account? </p>
            </ion-text>
            <ion-text class="ion-margin-top" color="warning">
                <router-link :to="{name:'Login'}">Sign In</router-link>
            </ion-text>
        </div>
    </div>
</template>

<script>


import {IonButton,
        IonItem,
        IonLabel,
        IonText, 
        IonInput, 
        } from "@ionic/vue"

export default{
    components:{
        IonInput,
        IonButton,
        IonItem,
        IonLabel,
        IonText,
    },
    props:["errorText"],
    data() {
        return {
            firstName:"",
            lastName:"",
            email:"",
            password:"",
        }
    },
    methods: {
        texChanged(){
            this.$emit("errorTextChanged","");
        },

        submitBasics(){
            var data={
                firstName:this.firstName,
                lastName:this.lastName,
                email:this.email,
                password:this.password,
            }
            this.$emit("submitbasics",data);
        }
    },
}

</script>

<style scoped>


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
#sign-in-options{
    display: flex;
    justify-content: center;
}

a{
    text-decoration: none;
    color: inherit;
}
    
</style>