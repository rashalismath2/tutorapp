<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>

        <ion-buttons @click="jumpToHome" slot="start" >
          <ion-icon  :icon="arrowBack"></ion-icon>
        </ion-buttons >
          
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
            <ion-textarea rows=7 v-on:change="dataChanged" v-model="groupDescription" name="groupDescription" :readonly="readOnly" >

            </ion-textarea>
          </ion-item>
          <ion-spinner v-if="openDeleteGroupSpinner" color="primary" name="crescent"></ion-spinner>

          <ion-button :fill="openLoading?'outline':'solid'" :disabled="openLoading" v-show="!readOnly" v-on:click="saveData" expand="full" color="primary" >
            <ion-spinner v-if="openLoading" color="primary" name="crescent"></ion-spinner>
            <span v-else>SAVE</span>
          </ion-button>

          <ion-button v-show="!readOnly" v-on:click="cancelEdit" expand="full" color="primary" >
            CANCEL
          </ion-button>

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

            <ion-modal :is-open="openModel">
                <members  v-on:cancelMembersModal="cancelMembersModal" />
            </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script >

import members from "./members.vue"

import {ellipsisVerticalSharp,
  close, 
  trash,pencil,
  arrowBack,
  share, peopleCircle,at} from "ionicons/icons"

import axios from "axios"

import {
  alertController ,
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
  IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';


export default {
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
    IonButtons,
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
        openDeleteGroupSpinner:false,
        arrowBack,
          group:{},
          readOnly:true,
          groupName:"",
          groupDiscription:"",
          openLoading:false,
          error_message:null,
          error_text:"",
          groupId:this.$route.params.id
      }
  },

  mounted() {


  },
  created() {
    
    var groups=this.$store.getters["Groups/getGroups"]
        
    this.group=groups.filter(group=>{
        return group.id==this.$route.params.id
    })[0]

    this.groupName=this.group.groupName
    this.groupDescription=this.group.description

      
  },
    watch: {
       
    },
  methods: {
    cancelMembersModal(){
      this.openModel=false
    },
    jumpToHome(){
      this.$router.replace({name:"TabGroups"});
    },
    cancelEdit(){
      this.error_message=null
      this.error_text=""
      this.readOnly=true
      this.groupName=this.group.groupName
      this.groupDescription=this.group.description

    },
    dataChanged(){
      this.error_message=null
      this.error_text=""
    },
      async presentDeleteGroupAlertConfirm() {
        const alert = await alertController
          .create({
            header: 'Alert!',
            message: 'Are you sure?',
            buttons: [
              {
                text: 'CANCEL',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                },
              },
              {
                text: 'DELETE',
                handler: () => {
                  this.deleteGroup()
                },
              },
            ],
          });
        return alert.present();
    },
    deleteGroup(){
        this.error_message=null
        this.openDeleteGroupSpinner=true
        this.readOnly=true
        axios.delete(
          process.env.VUE_APP_BACKEND_API+"/master/groups/"+this.group.id,
          {
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            }
        })
        .then(()=>{
              this.openDeleteGroupSpinner=false
          this.readOnly=false
          this.$store.commit("Groups/RemoveGroup",this.group)
          this.$router.replace({name:"TabGroups"})
          this.error_message="Group was deleted"
        })
        .catch((err)=>{
          this.openDeleteGroupSpinner=false
          console.log(err)
          this.error_message="Something went wrong! Please try again."
        })
    },
    saveData(){
      if(this.groupName=="" || this.groupDescription==""){
        this.error_message="Please dont keep fields empty"
        this.error_text="error-text"
      }
      if(!this.readOnly && this.groupName!=="" && this.groupDescription!==""){
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
              text: 'Contacts',
              role: 'destructive',
              icon: at,
              handler: () => {
                this.$router.push({name:"TabAllContacts",params:{group_id:this.$route.params.id}})
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
              text: 'Edit',
              icon: pencil,
              handler: () => {
                this.readOnly=false
              },
            },
            {
              text: 'Delete',
              icon: trash,
              handler: () => {
                this.presentDeleteGroupAlertConfirm()
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