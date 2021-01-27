<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
          <ion-buttons slot="start">
              <ion-back-button default-href="/home/TabGroups"></ion-back-button>
          </ion-buttons>
          <ion-buttons @click="presentActionSheet" slot="end">
              <ion-icon  :icon="ellipsisVerticalSharp"></ion-icon>
          </ion-buttons>
        <ion-title>{{ group.groupName}}</ion-title>
        
      </ion-toolbar>
    </ion-header>
        
    <ion-content class="ion-padding">
          <ion-item class="ion-margin-bottom">
            <ion-label v-bind:class="error_text" position="floating">Group name</ion-label>
            <ion-input v-on:change="dataChanged" v-model="groupName" name="groupName"   :readonly="readOnly"></ion-input>
          </ion-item>
          <ion-item class="ion-margin-bottom">
            <ion-label v-bind:class="error_text" position="floating">Description</ion-label>
            <ion-textarea v-on:change="dataChanged" v-model="groupDescription" name="groupDescription" :readonly="readOnly" >

            </ion-textarea>
          </ion-item>
          <ion-button v-if="readOnly" v-on:click="readOnly=!readOnly" expand="full" color="primary" >EDIT</ion-button>
          <ion-button :fill="openLoading?'outline':'solid'" :disabled="openLoading" v-else v-on:click="saveData" expand="full" color="primary" >
            <ion-spinner v-if="openLoading" color="primary" name="crescent"></ion-spinner>
            <span v-else>SAVE</span>
          </ion-button>

          <ion-button v-if="!readOnly" v-on:click="cancelEdit" expand="full" color="primary" >
            CANCEL
          </ion-button>

            <ion-toast
                class="ion-margin"
                color="secondary"
                keyboard-close=true
                :is-open="error_message!=null"
                v-bind:message="error_message"
                duration="3000"
            >
            </ion-toast>

            <ion-modal :is-open="openModel">
                <members v-on:cancelMembersModal="cancelMembersModal" />
            </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script >

import members from "./members.vue"

import {ellipsisVerticalSharp,
  close, 
  share, peopleCircle} from "ionicons/icons"

import axios from "axios"

import {
  IonModal,
  actionSheetController ,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonToast,
  IonItem,
  IonTextarea,
  IonInput,
  IonButton,
  IonButtons,IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';


export default {
  name: 'Home',
  components: {
    IonModal,
    members,
    IonIcon,
    IonLabel,
    IonSpinner,
    IonToast,
    IonButton,
    IonItem,
    IonTextarea,
    IonInput,
    IonButtons,IonBackButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  data() {
      return {
        ellipsisVerticalSharp,
        openModel:false,
          group:{},
          readOnly:true,
          groupName:"",
          groupDiscription:"",
          openLoading:false,
          error_message:null,
          error_text:""
      }
  },
  created() {
    var groups=this.$store.getters["Groups/getGroups"]
        
    this.group=groups.filter(group=>{
        return group.id==this.$route.params.id
    })[0]

    this.groupName=this.group.groupName
    this.groupDescription=this.group.description

      
  },
  methods: {
    cancelMembersModal(){
      this.openModel=false
    },
    cancelEdit(){
      this.readOnly=true
      this.groupName=this.group.groupName
      this.groupDescription=this.group.description

    },
    dataChanged(){
      this.error_message=null
      this.error_text=""
    },
    saveData(){
      if(!this.readOnly){
        this.openLoading=true
          axios.put(process.env.VUE_APP_BACKEND_API+"/master/groups",{
              groupId:this.group.id,
              groupName:this.groupName,
              groupDescription:this.groupDescription
          },
          {
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            }
          })
          .then(res=>{
            this.readOnly=true
            this.openLoading=false
            this.error_message="Updated"
            this.$store.dispatch("Groups/updateGroup",{
              groupId:res.data.Group.id,
              groupName:res.data.Group.groupName,
              groupDescription:res.data.Group.description,
            })

          })
          .catch(()=>{
            this.error_text="error-text"
            this.openLoading=false
            this.error_message="Something went wrong"
          })
      }
    },

  async presentActionSheet() {
      const actionSheet = await actionSheetController
        .create({
          header: 'Options',
          cssClass: 'actionSheetCss',
          buttons: [
            {
              text: 'Members',
              role: 'destructive',
              icon: peopleCircle,
              handler: () => {
                this.openModel=true
              },
            },
            {
              text: 'Share',
              icon: share,
              handler: () => {
                console.log('Share clicked')
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        });
      return actionSheet.present();
    },


  },
};
</script>

<style scoped>
.error-text{
    color:var(--ion-color-danger)
}
ion-content{
  --ion-background-color: var(--ion-background-color);
}

ion-action-sheet.actionSheetCss{
  --ion-background-color: var(ion-color-secondary) !important;
}




</style>