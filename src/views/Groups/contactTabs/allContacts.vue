<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-searchbar placeholder="Student ID" v-on:ionChange="saveSearchText"></ion-searchbar>
        <ion-button  slot="end" v-on:click="closeContactsModel" fill="clear">Cancel</ion-button>
        
      </ion-toolbar>
    </ion-header>
    <ion-content >
        <ion-spinner v-show="showLoading" name="crescent"></ion-spinner>
        <ion-list v-if="members.length!==0">
          <div id="members-item"  v-bind:key="member.id" v-for="(member) in getStudentsFromSearchText">
            <div id="members-item-avatar">
              <ion-avatar>
                <img :src="member.student.profile_img">
              </ion-avatar>
            </div>
            <div id="member-details">
              <div id="member-details-header" >
                <ion-label>{{member.student.firstName}} {{member.student.lastName}}</ion-label>
              </div>
              
              <ion-label>{{member.group_student_id}}</ion-label>
              <ion-label>{{member.student.school}}</ion-label>
              <ion-button color="danger" :fill="startDelete==member.id?'outline':'solid'" :disabled="startDelete==member.id" v-on:click="deleteMemberConfirm(member)">
                <ion-spinner v-if="startDelete==member.id"  name="crescent"></ion-spinner>
                <span  v-else>DELETE</span>
              </ion-button>
            </div>

          </div>
        </ion-list>

       <div v-show="!showLoading && members.length==0" class="no-items" v-else>
          <p>No members yet</p>
        </div>

    </ion-content>

    <ion-toast
            class="ion-margin"
            color="secondary"
            position="middle"
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
      startDelete:"",
    }
  },
  methods: {
    saveSearchText(text){
      this.searchText=text.target.value
    },
    closeContactsModel(){
      this.$router.replace({name:"group",params:{id:this.$route.params.group_id}})
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
        this.startDelete=member.id
        this.error_message=null
        axios.delete(
        process.env.VUE_APP_BACKEND_API+"/master/groups/"+this.$route.params.group_id+"/students/"+member.student_id,
        {
          headers:{
                Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
          }
        })
        .then(()=>{
            this.startDelete=""
            this.$store.commit("Groups/deleteUserFromTheGroup",member)
            this.members=this.members.filter(student=>{
                return student.student_id!==member.student_id
            })
            this.error_message='User deleted'
        })
        .catch(()=>{
          this.startDelete=""
          this.error_message='Something went wrong. Please try again later!'
        })
    }
  },
  computed:{
    getStudentsFromSearchText(){
        return this.members.filter(student=>{
          return student.group_student_id.toLowerCase().match(this.searchText.toLowerCase())
        })
      },
  },
  created() {
      var group=this.$store.getters["Groups/getGroups"]
      
      group=group.filter(group=>{
          return group.id==this.$route.params.group_id
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
  width: 100%;
  display: flex;
  color:black
}

#members-item-avatar{
    width: 60px;
    margin: 5px;
}
#members-item-avatar ion-avatar{
    width: 100%;
    height: auto;
}
#member-details{
width: calc(100% - 70px);
    margin: 5px 5px 15px 8px;
    padding-right: 15px;
}

#member-details{
  border-bottom: 1px solid var(--ion-color-secondary);
    padding-bottom: 5px;
}

#member-details-header{
  font-weight: bold;
    font-size: 1.1rem;
  display: flex;
  width:fit-content;
}
#member-details ion-label{
  margin-bottom: 5px;
  font-family: monospace;
  
}
#member-details ion-button{
  float: right;
}
#member-details ion-label{
  display: block;
}

</style>