<template>
    <div class="ion-margin">
        <ion-item color="secondary" class="ion-margin-top">
            <ion-text>
                <p>Activate Email</p>
            </ion-text>
        </ion-item>
        <p class="ion-margin-top verif-text">Please, enter the verification code we sent to your email</p>
        <form class="ion-margin" v-on:submit.prevent="submitVerificationCode">
            <ion-input v-bind:class="error_text" v-model="verficationEntered" maxlength=4 minlength=4 inputmode="numeric" placeholder="CODE" type="number" required ></ion-input>
            <ion-button class="ion-margin-top" type="submit" expand="full" color="primary">NEXT</ion-button>
        </form>
        <ion-text v-on:click="resendActivationCode" color="secondary">
            <p class="verif-text">Resend again?</p>
        </ion-text>
        <ion-text v-on:click="reEditDetails" color="secondary">
            <p class="verif-text">Re-enter email</p>
        </ion-text>
    </div>
</template>

<script>

import {IonButton,IonText,IonInput,IonItem} from "@ionic/vue"
 
export default {
    methods: {
        props:["verificationCode"],
        components:{
            IonButton,IonText,IonInput,IonItem
        },
        data() {
            return {
                verficationEntered:null,
                error_text:""
            }
        },
        submitVerificationCode(){
            if(this.verificationCode==this.verficationEntered){
                this.$emit("activationSuccess","")
            }
            else{
                this.error_text="error-text"
            }
        },
        resendActivationCode(){
            this.$emit("resendActivationCode","")
        },
        reEditDetails(){
            this.$emit("reEditDetails","")
        }
    },
}
</script>

<style scoped>
    
    ion-item{
        width: fit-content;
        margin: auto;
        border-radius: 50px;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .verif-text{
        color: var(--ion-color-secondary);
        margin: 25px auto;
        width: 80%;
        text-align: center;
    }

</style>