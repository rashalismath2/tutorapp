<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title slot="start"><b>Members</b></ion-title>
        <ion-button v-if="!showSaveChanges" slot="end" v-on:click="cancelMembersModal" fill="clear">Cancel</ion-button>
        <ion-button v-else slot="end" v-on:click="cancelMembersModalOnChanges" fill="clear">Cancel</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content >
        <ion-searchbar placeholder="Student ID" v-on:ionChange="saveSearchText"></ion-searchbar>
        <ion-list v-if="students!==[]">
          <ion-item  v-bind:key="member.id" v-for="(member) in getStudentsFromSearchText">
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
            </div>

              <ion-checkbox
                :checked="member.allowed"
                slot="end"
                v-on:ionChange="memberChecked(member)" >
              </ion-checkbox>
          </ion-item>

        </ion-list>
        <div class="no-items" v-else>
          <p>No members yet</p>
        </div>


        <ion-toast
            class="ion-margin"
            color="secondary"
            keyboard-close=true
            position="middle"
            :is-open="error_message!=null"
            v-bind:message="error_message"
            duration="3000"
        >
        </ion-toast>

    </ion-content>

    <ion-footer v-show="showSaveChanges">
        <ion-button :fill="openLoading?'outline':'solid'" :disabled="openLoading" v-on:click="saveChanges" expand="full">
          <ion-spinner v-if="openLoading"  name="crescent"></ion-spinner>
          <span v-else>SAVE</span>
        </ion-button>
    </ion-footer>

  </ion-page>
</template>

<script>

import axios from "axios"

import {
  IonButton,
  IonToast,
  alertController ,
  IonSpinner,
  IonFooter,
    IonList,
    IonAvatar, 
    IonLabel,
    IonItem,
    IonCheckbox,
    IonHeader,
    IonTitle,
    IonSearchbar,
    IonContent,  IonPage, IonToolbar } from '@ionic/vue';


export default ({

  name: 'Home',
  components: {
    IonButton,
    IonToast,
    IonSpinner,
    IonFooter,
    IonList,
    IonAvatar,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonHeader,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonPage,
    
    IonToolbar
  },
  
  data() {
    return {
      students:[],
      showSaveChanges:false,
      searchText:"",
      openLoading:false,
      error_message:null
    }
  },

  created() {
      var group=this.$store.getters["Groups/getGroups"]
      
      group=group.filter(group=>{
          return group.id==this.$route.params.id
      })[0]
      this.students=group.students

  },
  computed:{
      getStudentsFromSearchText(){
         return this.students.filter(student=>{
           return student.group_student_id.toLowerCase().match(this.searchText.toLowerCase())
         })
       },
  },
   methods: {

     saveChanges(){
        this.openLoading=true
        this.error_message=null
      //  console.log(this.$store.getters["Groups/getGroups"])
        var group=this.$store.getters["Groups/getGroups"].filter((group)=>{
          return group.id==this.$route.params.id
        })[0]
        var changedStudents=group.students.filter(student=>{
          return student.changed
        })
      
        if(changedStudents.length>0){
          axios.patch(process.env.VUE_APP_BACKEND_API+"/master/groups/"+this.$route.params.id,{
              "students":changedStudents
            },
            {
              headers:{
                    Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
              }
            })
            .then(()=>{
              this.openLoading=false
              this.showSaveChanges=false
              this.error_message="Users status updated"
              //we have to remove prestate and changed attribute since we 
              //have to use that changed data again for changes
              this.$store.commit("Groups/updateGroupsToItsOriginalState",{
                group:group,
                changedStudents:changedStudents,
                groupId:this.$route.params.id
              })
            })
            .catch(()=>{
              this.error_message="Something went wrong! Please try again later"
              this.openLoading=false
            })
        }
        else{
            this.openLoading=false
            this.showSaveChanges=false
        }
 

     },
      saveSearchText(text){
        this.searchText=text.target.value
      },
       cancelMembersModal(){
          this.error_message=null
          this.$emit("cancelMembersModal")
       },
       async cancelMembersModalOnChanges(){
          const alert = await alertController
          .create({
            header: 'Confirm',
            message: "You sure you don't want to save changes before close?",
            buttons: [
              {
                text: 'Close',
                handler: () => {
                  this.error_message=null
                  this.$emit("cancelMembersModal")
                },
              },
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  this.error_message=null
                },
              }
            ],
          });
          return alert.present();
           
       },

       memberChecked(member){
        this.$store.commit("Groups/updateStudentStatus",{
           member:member,
           groupId:this.$route.params.id
           })
        this.showSaveChanges=true   
  
       }
   }, 
 

});

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
ion-content{
  --ion-background-color: var(--ion-background-color);
}

ion-list{
      --ion-background-color: var(--ion-background-color);
}
ion-spinner{
  color:white
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
#add-new-member p span{
  font-weight: bold;
}
#add-new-member p{
      font-family: monospace;
  text-align: center;
}
#add-new-member{
   display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>