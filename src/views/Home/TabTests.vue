<template>
  <ion-page>
    <ion-content class="">       
        <ion-item  v-for="(homework,index) in homeworks" v-bind:key="index">
          <div class="tab-items">
            <router-link exact :to="{name:'homework',params:{id:homework.id}}">
              <p class="tab-item-title">
                <span>{{homework.title}}</span>
                <span>{{new Date(homework.startDate).toLocaleDateString()}}</span>
              </p>
            </router-link>
              <div id="tests-actions">
                 <router-link exact :to="{name:'homework',params:{id:homework.id}}">
                    <p v-if="homework.status=='queued'" class="tab-item-detail"><span>Start Time</span> 
                      <ion-badge color="success">{{getTimeFormated(homework.startTime)}}</ion-badge>
                    </p>            
                    <p v-else-if="homework.onetime && homework.status=='on' " class="tab-item-detail"><span>Ends at</span> 
                      <ion-badge color="danger">{{getTimeFormated(homework.endTime)}}</ion-badge>
                    </p>            
                    <p v-else-if="homework.onetime && homework.status=='ended' " class="tab-item-detail"><span>Ended at</span> 
                      <ion-badge color="warning">{{getTimeFormated(homework.ended_at)}}</ion-badge>
                    </p>            
                    <p v-else-if="!homework.onetime && homework.status=='on' " class="tab-item-detail"><span>Ending on</span> 
                      <ion-badge color="warning">{{new Date(homework.endDate).toLocaleDateString()}}</ion-badge>
                    </p>            
                    <p v-else-if="!homework.onetime && homework.status=='ended' " class="tab-item-detail"><span>Stopped on</span> 
                      <ion-badge color="warning">{{new Date(homework.ended_at).toLocaleDateString()}}</ion-badge>
                    </p>   
                  </router-link>         
                <div>
 
                  <ion-button :fill="testStatusOnChange && testStatusChangedOf==homework.id?'outline':'solid'" :disabled="testStatusOnChange && testStatusChangedOf==homework.id"
                       v-on:click="alertStartHomework(homework.id)" 
                      color="success" 
                      v-if="homework.status=='queued'">
                         <ion-spinner class="spinner-success" v-if="testStatusOnChange && testStatusChangedOf==homework.id" color="success" name="crescent"></ion-spinner>
                          <span v-else>Start</span>
                    </ion-button>

                  <ion-button :fill="testStatusOnChange && testStatusChangedOf==homework.id?'outline':'solid'" :disabled="testStatusOnChange && testStatusChangedOf==homework.id"
                       v-on:click="alertEndHomework(homework.id)" 
                      color="danger" 
                      v-else-if="homework.status=='on'">
                         <ion-spinner class="spinner-danger" v-if="testStatusOnChange && testStatusChangedOf==homework.id" color="success" name="crescent"></ion-spinner>
                          <span v-else>End</span>
                    </ion-button>

                  <ion-button color="secondary" v-else>Duplicate</ion-button>
                </div>
              </div>
          </div>
        </ion-item>

        <div  v-if="showLoading" >          
          <div v-for="i in [1,2,3,4,5]" v-bind:key="i" class="ion-padding custom-skeleton">
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </div>

        </div>

        <div v-if="!showLoading  && homeworks.length==0" class="no-items" >
          <p>No tests has been created yet</p>
        </div>
        
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button v-on:click="openCreateNewHomework">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>

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

    <createNewHomeworkModal v-bind:openModal="openCreateNewHomeworkModal" v-on:createNewHomework="createNewHomework($event)" />
  </ion-page>
</template>

<script>
import createNewHomeworkModal from "../Homeworks/createNewModal.vue"

import axios from "axios"

import {add} from "ionicons/icons"


import {
  IonSkeletonText,
  IonItem,IonBadge,
    IonSpinner,
    IonToast,
    IonButton,
    IonFab, 
    IonFabButton, 
    IonContent,
    IonPage,
    IonIcon,
    alertController 

} from '@ionic/vue';

export default {

  components: {
    IonSkeletonText,
    IonButton,
      IonItem,IonBadge,
        IonSpinner,
        IonToast,
        IonIcon,
        IonFab, 
        IonFabButton,
        IonContent,
        IonPage,
        createNewHomeworkModal
    },
    data() {
        return {
            add,
            tests:[],
            showLoading:false,
            openCreateNewHomeworkModal:false,
            homeworks:[],
            error_message:null,
            testStatusOnChange:false,
            testStatusChangedOf:null
        }
    },
    created() {
        if(this.$store.getters["AuthUser/getAuthUser"].access_token!=null){
            this.retrieveHomeworks()
        }
        else{
          this.$store.dispatch("AuthUser/initiateAuthState")
            .then(()=>{
              this.retrieveHomeworks()
            })
        }
    },
    computed:{
 
    },
    methods:{
      getTimeFormated(time){
        return new Date(time).getHours()+" : "+new Date(time).getMinutes()
      },
      openCreateNewHomework(){
        if(this.openCreateNewHomeworkModal){
          this.openCreateNewHomeworkModal=false
          return
        }
        if(!this.openCreateNewHomeworkModal){
          this.openCreateNewHomeworkModal=true
        }

      },
      createNewHomework(event){
        if(event.data==null){
          this.openCreateNewHomeworkModal=false
        }
        else{
          this.error_message="Homework created"
          var homework={
            title:event.data.get("title"),
            startDate:event.data.get("startDate"),
            endDate:event.data.get("endDate"),
            startTime:event.data.get("startTime"),
            endTime:event.data.get("endTime"),
            number_of_questions:event.data.get("number_of_questions"),
            onetime:event.data.get("onetime"),
            note:event.data.get("note"),
            allow_late:event.data.get("allow_late"),
            status:"queued",
            id:event.newData.homework.id,
            homework_attachments:event.newData.attachments,
            homework_groups:event.newData.homeworkgroups,
          }
          this.openCreateNewHomeworkModal=false
          this.homeworks=[homework,...this.homeworks]

          this.$store.commit("Homeworks/addHomework",homework)
        }
       
      },
      retrieveHomeworks(){
        this.showLoading=true
        this.error_message=null

        this.homeworks=this.$store.getters["Homeworks/getHomewroks"]
        if(this.homeworks.length==0){
            axios.get(process.env.VUE_APP_BACKEND_API+"/master/homeworks",{
              headers:{
                    Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
              }
            })
            .then(res=>{
              this.$store.commit("Homeworks/setHomeworks",res.data)
              this.homeworks=res.data
              this.showLoading=false
            })
            .catch(()=>{
              this.showLoading=false
              this.error_message="Could'nt retrieve homeworks"
            })
        }
        else{
            this.showLoading=false
            this.error_message=null
        }
      },

      
    async alertStartHomework(id) {
      const alert = await alertController
        .create({
          header: 'Confirm!',
          message: 'Do you wish to start now?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {

              },
            },
            {
              text: 'Start',
              handler: () => {
                this.startHomework(id)
              },
            },
          ],
        });
      return alert.present();
    },
    async alertEndHomework(id) {
      const alert = await alertController
        .create({
          header: 'Confirm!',
          message: 'Do you wish to end now?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {

              },
            },
            {
              text: 'End',
              handler: () => {
                this.endtHomework(id)
              },
            },
          ],
        });
      return alert.present();
    },
    startHomework(id){
        this.error_message=null
        this.testStatusChangedOf=id
        this.testStatusOnChange=true

        var started_at=new Date().toISOString()

        axios.put(process.env.VUE_APP_BACKEND_API+"/master/homeworks/start",{
              "homework_id":id,
              "started_at":started_at
            },
            {
              headers:{
                    Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
              }
            })
            .then(()=>{
                this.error_message="Started!"
                this.testStatusOnChange=false
                this.testStatusChangedOf=null
                this.$store.commit("Homeworks/startHomework",{
                  id:id,
                  started_at:started_at
                  })

                this.homeworks=this.homeworks.map(homework=>{
                  if(homework.id==id){
                    homework={
                      ...homework,
                      status:"on",
                      started_at:started_at
                    }
                    return homework
                  }
                  else{
                    return homework
                  }
                })
            })
            .catch(err=>{
              this.error_message="Something went wrong!"
              this.testStatusOnChange=false
              this.testStatusChangedOf=null
              console.log(err)
            })
      },
      endtHomework(id){
        this.error_message=null
        this.testStatusChangedOf=id
        this.testStatusOnChange=true

        var ended_at=new Date().toISOString()

        axios.put(process.env.VUE_APP_BACKEND_API+"/master/homeworks/end",{
              "homework_id":id,
              "ended_at":ended_at
            },
            {
              headers:{
                    Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
              }
            })
            .then(()=>{
                this.error_message="Ended!"
                this.testStatusOnChange=false
                this.testStatusChangedOf=null
                this.$store.commit("Homeworks/endHomework",{
                  id:id,
                  ended:ended_at
                  })

                this.homeworks=this.homeworks.map(homework=>{
                  if(homework.id==id){
                    homework={
                      ...homework,
                      status:"ended",
                      ended_at:ended_at
                    }
                    return homework
                  }
                  else{
                    return homework
                  }
                })
            })
            .catch(err=>{
              this.error_message="Something went wrong!"
              this.testStatusOnChange=false
              this.testStatusChangedOf=null
              console.log(err)
            })
      }

  }

};
</script>

<style scoped>

ion-content{
  --ion-background-color: var(--ion-background-color);
}

ion-spinner{
  color: white;
}
.loadSpinner{
  color: var(--ion-color-primary) !important;
}
.tab-item-title{
  display: flex;
}
.tab-item-title span{
  width: 50%;
}
.tab-item-title span:nth-child(2){
  text-align: end;
}
#tests-actions{
  display: flex;
  width: 100%;
}
#tests-actions {
      margin-top: 8px;
  display: flex;
}
#tests-actions >div{
  width: 20%;
}
#tests-actions p{
  width: 80%;
}
#tests-actions p ion-badge{
  height: fit-content;
}

#tests-actions >div{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
#tests-actions ion-button{
  width: fit-content;
}
#tests-actions ion-spinner{
  width: 40px;
}
.spinner-success{
  color:var(--ion-text-success)
}
.spinner-danger{
  color:var(--ion-text-danger)
}




</style>