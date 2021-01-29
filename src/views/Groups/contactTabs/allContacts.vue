<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-searchbar v-on:ionChange="saveSearchText"></ion-searchbar>
        <ion-button  slot="end" v-on:click="closeContactsModel" fill="clear">Cancel</ion-button>
        
      </ion-toolbar>
    </ion-header>
    <ion-content >
        <ion-spinner v-show="showLoading" name="crescent"></ion-spinner>
        <ion-list v-if="members.length!==0">
          <ion-item id="members-item"  v-bind:key="member.id" v-for="(member) in getStudentsFromSearchText">
            <ion-avatar>
              <img :src="member.student.profile_img">
            </ion-avatar>
            <div id="member-details">
              <ion-label>{{member.student.firstName}} {{member.student.lastName}}</ion-label>
              <ion-label>{{member.student.email}}</ion-label>
              <ion-label>{{member.group_student_id}}</ion-label>
              <ion-label>{{member.student.school}}</ion-label>
              <ion-button color="danger" :fill="startDelete?'outline':'solid'" :disabled="startDelete" v-on:click="deleteMemberConfirm(member)">
                <ion-spinner v-if="startDelete"  name="crescent"></ion-spinner>
                <span  v-else>DELETE</span>
              </ion-button>
            </div>

          </ion-item>
        </ion-list>

       <div v-show="!showLoading && members.length==0" class="no-items" v-else>
          <p>No members yet</p>
        </div>

    </ion-content>

    <ion-toast
            class="ion-margin"
            color="secondary"
            keyboard-close=true
            :is-open="error_message!=null"
            v-bind:message="error_message"
            duration="3000"
    >
    </ion-toast>

  </ion-page>
</template>

<script>


import {
  IonLabel,
  IonItem,
  IonList,
  IonHeader,
  IonToolbar,
  IonSpinner,
  IonContent,
  IonButton,
  IonPage,
  IonAvatar,
  IonSearchbar,
  alertController,
  IonToast
} from '@ionic/vue';

import axios from "axios"

export default {
  components: {
    IonLabel,
    IonItem,
    IonList,
    IonToast,
    IonHeader,
    IonToolbar,
    IonSpinner,
    IonAvatar,IonSearchbar, IonContent,  IonPage,  IonButton},
  
  data() {
    return {
      members:[],
      error_message:null,
      searchText:"",
      showLoading:false,
      startDelete:false,
    }
  },
  methods: {
    saveSearchText(text){
      this.searchText=text.target.value
    },
    closeContactsModel(){
      this.$router.push({name:"group"})
      this.emitter.emit("closeContactsModel");
    },

    async deleteMemberConfirm(member) {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Delete',
          message: 'Are you sure? ',
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
                this.deleteMember(member)
              },
            },
          ],
        });
      return alert.present();
    },
    deleteMember(member){    
        this.startDelete=true
        this.error_message=null
        axios.delete(
        process.env.VUE_APP_BACKEND_API+"/master/groups/"+this.$route.params.id+"/students/"+member.student_id,
        {
          headers:{
                Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
          }
        })
        .then(()=>{
            this.startDelete=false
            this.$store.commit("Groups/deleteUserFromTheGroup",member)
            this.members=this.members.filter(student=>{
                return student.student_id!==member.student_id
            })
            this.error_message='User deleted'
        })
        .catch(()=>{
          this.startDelete=false
          this.error_message='Something went wrong. Please try again later!'
        })
    }
  },
  computed:{
    getStudentsFromSearchText(){
        return this.members.filter(student=>{
          return student.group_student_id.match(this.searchText)
        })
      },
  },
  created() {
      var group=this.$store.getters["Groups/getGroups"]
      
      group=group.filter(group=>{
          return group.id==this.$route.params.id
      })[0]
      this.members=group.students
  },
 

};
</script>

<style scoped>


--ion-color-base{
      --ion-background-color: var(--ion-background-color);
}
ion-searchbar{
  --ion-background-color: var(--ion-background-color);
  --color:var(--ion-color-secondary);
}
ion-button{
    --color:white;
}
ion-button ion-spinner{
      width: 50px !important;
    --color:var(--ion-color-danger) !important;
}
ion-content{
  --ion-background-color: var(--ion-background-color);
}

ion-list{
      --ion-background-color: var(--ion-background-color);
}
#members-item{
    display: flex;
    align-items: flex-start;
}
#members-item ion-avatar{
  width: 50px;
  height: auto;
}
#member-details{
  width: -webkit-fill-available;
  margin-left: 15px;
}
#member-details ion-button{
  float: right;
}
#member-details ion-label:first-child{
  font-weight: bold;
}
#member-details ion-label{
  font-family: monospace;
    margin-bottom: 2px;
    color: var(--ion-text-color);
    text-transform: capitalize;
}

</style>