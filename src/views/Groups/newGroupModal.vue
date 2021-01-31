<template>
  <ion-modal
    :is-open="openCreateNewGroupModal">

    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-button  slot="end" v-on:click="closeCreateNewGroupModal(false)" fill="clear">Cancel</ion-button>
            </ion-toolbar>
        </ion-header>
    
        <ion-content >
            
            <ion-item>
                <ion-label position="floating">Group name</ion-label>
                <ion-input required=true v-model="groupName" minlength=2 type="text"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Group description</ion-label>
                <ion-textarea v-model="groupDescription" rows=7></ion-textarea>
            </ion-item>
            
            <ion-item>
                <ion-button v-on:click="closeCreateNewGroupModal(true)" color="primary" expand="full">CREATE</ion-button>
            </ion-item>
            
        </ion-content>
        
            <ion-toast
                class="ion-margin"
                position="middle"
                color="secondary"
                keyboard-close=true
                :is-open="error_message!=null"
                v-bind:message="error_message"
                duration="3000"
            >
            </ion-toast>
    </ion-page>
  </ion-modal>
</template>

<script>
import {
    IonToast,
    IonTextarea, 
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonModal, IonButton } from '@ionic/vue';


export default ({
    props:["openCreateNewGroupModal"],
    components: { 
        IonToast,
        IonTextarea,
        IonInput,
        IonItem,
        IonLabel,
        IonPage,
        IonHeader,
        IonToolbar,
        IonContent,
        IonModal, IonButton },
    
    data() {
        return {
            groupName:"",
            groupDescription:"",
            error_message:null
        }
    },
    created() {
        
    },
    methods: {
        closeCreateNewGroupModal(close){
            if(this.groupDescription.replace(/\s+/g, '')!="" && this.groupName.replace(/\s+/g, '')!=""){
                this.$emit("createNewGroup",{
                    data:close?true:false,
                    name:this.groupName,
                    description:this.groupDescription,
                })
            }
            else{
                this.error_message="Please dont not leave fileds empty"
            }
        }
    },
});
</script>