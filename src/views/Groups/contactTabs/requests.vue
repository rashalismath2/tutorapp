<template>
  <ion-page>

    <ion-content>
        <ion-spinner v-show="showLoading" name="crescent"></ion-spinner>
        <ion-list v-if="members.length!==0">
          <div id="members-item"  v-bind:key="member.id" v-for="(member) in members">
            <div id="members-item-avatar">
              <ion-avatar>
                  <img :src="member.student.profile_img">
              </ion-avatar>
            </div>
            <div id="member-details">
              <div id="member-details-header" >
                <ion-label>{{member.student.firstName}} {{member.student.lastName}}</ion-label>
                <ion-icon v-on:click="changeHiddenFields(member)" :icon="caretDown" slot="end"></ion-icon>
              </div>
              
              <ion-label>{{member.group_student_id}}</ion-label>
              <ion-label>{{member.student.school}}</ion-label>
              <div v-show="showHiddentFields==member.id" id="requests-hidden-fields">
                  <div>
                    <div id="student-id">
                        <ion-item >
                            <ion-label v-bind:class="error_text"  position="floating">Student ID</ion-label>
                            <ion-input  v-model="studentId"></ion-input>
                        </ion-item>
                    </div>
                    <div id="request-id-validate">
                      <ion-icon :class="'icon-validate '+ iconValidated" v-if="!validating" v-on:click="validateId" :icon="checkmark"></ion-icon>
                      <ion-spinner slot="end" v-if="validating" color="danger" name="crescent"></ion-spinner>
                    </div>
                  </div>
                  <ion-item id="allow-member-in">
                    <ion-label>Allow in group</ion-label>
                    <ion-checkbox
                      slot="end"
                      @update:modelValue="isAllowed = $event"
                      :modelValue="isAllowed">
                    </ion-checkbox>
                  </ion-item>

                  <div id="requests-controls">
                    <ion-button v-on:click="submitAccept(member)" :fill="acceptLoading==member.id?'outline':'solid'" :disabled="studentId=='' || !validated" color="success">
                      <ion-spinner v-if="acceptLoading==member.id" color="success" name="crescent"></ion-spinner>
                      <span v-else>Accept</span>
                    </ion-button>
                    <ion-button v-on:click="submitDelete(member)" :fill="loadDelete==member.id?'outline':'solid'" :disabled="loadDelete==member.id" color="danger">
                      <ion-spinner v-if="loadDelete==member.id" color="danger" name="crescent"></ion-spinner>
                      <span v-else>Decline</span>
                    </ion-button>
                  </div> 
              </div>

            </div>

          </div>
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
          position="middle"
          duration="3000"
      >
      </ion-toast>

    </ion-content>
  </ion-page>
</template>

<script>

import axios from "axios"

import {caretDown,checkmark} from 'ionicons/icons'

import {
  IonIcon,
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
    IonIcon,
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
      caretDown,
      checkmark,
      showLoading:false,
      members:[],
      error_message:null,
      studentId:"",
      acceptLoading:"",
      loadDelete:"",
      error_text:"",
      isAllowed:true,
      validated:false,
      showHiddentFields:"",
      validating:false,
      iconValidated:"icon-validate-danger",
    }
  },

  methods: {
 
    changeHiddenFields(member){
      this.showHiddentFields=member.id
      if(this.studentId!==member.student_id){
        this.studentId=""
        this.validating=false
      }
    },
    validateId(){
      if(this.studentId.replace(/\s+/g, '').length>2){
          this.validating=true
          this.validated=false
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
              this.validating=false
              this.error_message=null
              this.iconValidated="icon-validate-success"
            }
          })
          .catch((err)=>{
            this.iconValidated="icon-validate-danger"
            if(err.response){
              
              if(
                err.response.data && err.response.data.group_student_id[0]=="The group student id has already been taken."
                ){
                    this.validated=false
                    this.validating=false
                    this.error_message="Student Id already exists. Please choose a unique ID"
                    this.error_text="error-text"
                }
            }
            else{
              this.validated=false
              this.validating=false
              this.error_message="Something went wrong! Please try again."
              this.error_text="error-text"
            }

          })
      }


    },
    submitAccept(member){
      if(this.studentId.replace(/\s+/g, '')!=="" && this.validated){
     
        this.acceptLoading=member.id
        this.error_message=null
        this.error_text=""

        axios.post(
          process.env.VUE_APP_BACKEND_API+"/master/request/accept",
          {
              "requestId":member.id,
              "allowed":this.isAllowed,
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

            member={
                ...member,
                group_student_id:this.studentId
              }

            this.$store.commit("Requests/RemoveMemberFromRequest",member)
            this.$store.commit("Groups/AddRequestMemberToTheGroup",member)
            this.student_id=""
            this.acceptLoading=""
            this.error_message="Request was accepted"
            this.error_text=""
          })
          .catch(()=>{
            this.acceptLoading=""
            this.error_message="Something went wrong! Please try again."
            this.error_text="error-text"
          })
      }
      else{
        this.error_message="Please add a unique student ID"
        this.error_text="error-text"
      }
    },

    submitDelete(member){
        this.loadDelete=member.id
        this.error_message=null

         axios.delete(
          process.env.VUE_APP_BACKEND_API+"/master/request/decline",
          {
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            },
            data:{
              "requestId":member.id
            }
          })
          .then(()=>{
            
            this.members=this.members.filter(requests=>{
              return requests.student_id!==member.student_id
            })

            this.$store.commit("Requests/RemoveMemberFromRequest",member)
            this.student_id=""
            this.loadDelete=""
            this.error_message="Request was deleted"
            this.error_text=""
          })
          .catch(()=>{
            this.loadDelete=""
            this.error_message="Something went wrong! Please try again."
          })
    }
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
ion-item ion-spinner{
    width: 20px;
    color: red;
    margin: 0;
}

ion-list{
      --ion-background-color: var(--ion-background-color);
}
ion-button ion-spinner{
      width: 50px !important;
}

.icon-validate {

}
.icon-validate-danger{
  color: var(--ion-color-danger);
}
.icon-validate-success{
  color: var(--ion-color-success);
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

#member-details-header ion-icon{
  float: right;
}

#member-details ion-label{
  margin-bottom: 5px;
  font-family: monospace;
}
#allow-member-in{
  width: fit-content;
}

#requests-hidden-fields {
  margin-top: 15px;
}
#requests-hidden-fields >div{
  display: flex;
}
#student-id{
  width: calc(100% - 20px);
}
#student-id ion-label{
  color:var(--ion-color-primary);
}

#request-id-validate{
  display: flex;
  align-items: center;
  width:20px;
}

#requests-controls{
      display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

</style>