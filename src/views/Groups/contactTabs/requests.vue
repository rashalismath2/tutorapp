<template>
  <ion-page>

    <ion-content>
        <ion-spinner v-show="showLoading" name="crescent"></ion-spinner>
        <ion-list v-if="members.length!==0">
          <ion-item id="members-item"  v-bind:key="member.id" v-for="(member) in members">
            <ion-avatar>
              <img :src="member.student.profile_img">
            </ion-avatar>
            <div id="member-details">
              <ion-label>{{member.student.firstName}} {{member.student.lastName}}</ion-label>
              <ion-label>{{member.student.email}}</ion-label>
              <ion-label>{{member.group_student_id}}</ion-label>
              <ion-label>{{member.student.school}}</ion-label>
              <div id="requests-hidden-fields">
                  <ion-item>
                    <ion-label v-bind:class="error_text"  position="floating">Student ID</ion-label>
                    <ion-input v-on:ionBlur="validateId" v-model="studentId"></ion-input>
                  </ion-item>
                  <ion-item >
                    <ion-label>Allow in group</ion-label>
                    <ion-checkbox
                      slot="end"
                      @update:modelValue="isAllowed = $event"
                      :modelValue="isAllowed">
                    </ion-checkbox>
                  </ion-item>
              </div>
              <div id="requests-controls">
                  <ion-button v-on:click="submitAccept(member)" :fill="acceptLoading?'outline':'solid'" :disabled="studentId=='' || acceptLoading" color="success">
                    <ion-spinner v-if="acceptLoading" color="success" name="crescent"></ion-spinner>
                    <span v-else>Accept</span>
                  </ion-button>
                  <ion-button v-on:click="submitDelete" :fill="loadDelete?'outline':'solid'" :disabled="loadDelete" color="danger">
                    <ion-spinner v-if="loadDelete" color="danger" name="crescent"></ion-spinner>
                    <span v-else>Decline</span>
                  </ion-button>
              </div>
            </div>

          </ion-item>
        </ion-list>

       <div v-show="!showLoading && members.length==0" class="no-items" v-else>
          <p>No requests yet</p>
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

    </ion-content>
  </ion-page>
</template>

<script>

import axios from "axios"

import {
  IonCheckbox,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonSpinner,IonLabel,
  IonAvatar,
  IonContent,
  IonPage,
  IonToast

} from '@ionic/vue';

export default {

  components: {
    IonCheckbox,
    IonInput,
      IonButton,
      IonList,
      IonItem,
      IonSpinner,IonLabel,
      IonAvatar,
      IonContent,  
      IonPage,
      IonToast
      },
  
  data() {
    return {
      showLoading:false,
      members:[],
      error_message:null,
      studentId:"",
      acceptLoading:false,
      loadDelete:false,
      error_text:"",
      isAllowed:true,
      validated:false
    }
  },

  methods: {
    validateId(){
      if(this.studentId.length>2){
          this.error_message=null
          this.error_text=""
         axios.post(
          process.env.VUE_APP_BACKEND_API+"/master/request/validate/studentid",
          {
              "group_student_id":this.studentId
          },
          {
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            }
          })
          .then(res=>{
            if(res.data.Message=="Valid"){
              this.validated=true
              this.error_text=""
              this.error_message=null
            }
          })
          .catch((err)=>{
            if(err.response){
              
              if(
                err.response.data && err.response.data.group_student_id[0]=="The group student id has already been taken."
                ){
                    this.validated=false
                    this.error_message="Student Id already exists. Please choose a unique ID"
                    this.error_text="error-text"
                }
            }
            else{
              this.validated=false
              this.error_message="Something went wrong! Please try again."
              this.error_text="error-text"
            }

          })
      }

    },
    submitAccept(member){
      if(this.studentId!=="" && this.validated){
     
        this.acceptLoading=true
        this.error_message=null
        this.error_text=""

        axios.post(
          process.env.VUE_APP_BACKEND_API+"/master/request/accept",
          {
              "requestId":member.id,
              "group_id":member.group_id,
              "allowed":this.isAllowed,
              "student_id":member.student_id,
              "grpStdId":this.studentId
          },
          {
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            }
          })
          .then(()=>{
            
            this.members=this.members.filter(requests=>{
              return requests.student_id!==member.student_id
            })
            this.$store.commit("Requests/RemoveMemberFromRequest",member)
            this.student_id=""
            this.acceptLoading=false
            this.error_message="Request accepted"
            this.error_text=""
          })
          .catch(()=>{
            this.acceptLoading=false
            this.error_message="Something went wrong! Please try again."
            this.error_text="error-text"
          })
      }
      else{
        this.error_message="Please add a unique student ID"
        this.error_text="error-text"
      }
    },

    submitDelte(){}
  },
  created() {
        this.showLoading=true
        this.error_message=null

        var requests=this.$store.getters["Requests/getAllTheRequests"]
        
        if(requests.length!=0){
          this.members=requests.filter(req=>{
            return req.groupId==this.$route.params.group_id
          })[0]
        }
        console.log(this.members," mem")
        if(this.members!=null && this.members.length==0){
          axios.get(
            process.env.VUE_APP_BACKEND_API+"/master/request?group_id="+this.$route.params.group_id,
            {
              headers:{
                    Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
              }
            })
            .then(res=>{
              this.showLoading=false
              this.members=res.data
              this.$store.commit("Requests/addToRequests",res.data)
            })
            .catch((err)=>{
              console.log(err)
              this.showLoading=false
              this.error_message="Something went wrong! Please try again later"
              
            })
        }
   
  },

};

</script>

<style  scoped>

ion-content{
  --ion-background-color: var(--ion-background-color);
}

.error-text{
    color:var(--ion-color-danger)
}
ion-list{
      --ion-background-color: var(--ion-background-color);
}
ion-button ion-spinner{
      width: 50px !important;
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