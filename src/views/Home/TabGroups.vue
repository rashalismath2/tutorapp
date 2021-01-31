<template>
  <ion-page>
    <ion-content class="">
        <ion-spinner class="loadSpinner" v-show="showLoading" name="crescent"></ion-spinner>
        <ion-item  v-for="(group,index) in groups" v-bind:key="index">
              <div class="tab-items">
                <router-link exact :to="{name:'group',params:{id:group.id}}">
                  <p class="tab-item-title">
                    {{group.groupName}}
                  </p>
                  <p class="tab-item-detail"><span>Allowed</span> 
                    <ion-badge color="success">{{group.allowed_std_count}}</ion-badge>
                  </p>
                  <p class="tab-item-detail"><span>Not allowed</span> 
                    <ion-badge color="warning">{{group.not_allowed_std_count}}</ion-badge>
                  </p>
                </router-link>

              </div>
        </ion-item>
        
        <div v-if="groups.length==0 && !showLoading" class="no-items" >
          <p>No groups have been created yet</p>
        </div>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button :disabled="createNewGroupSpinner"  v-on:click="openCreateNewModal">
              <ion-spinner name="crescent" v-if="createNewGroupSpinner"></ion-spinner>
                <ion-icon v-else :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
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

            <NewGroupModal v-on:createNewGroup="createNewGroup($event)" v-bind:openCreateNewGroupModal="openCreateNewGroupModal" />
    </ion-content>
  </ion-page>
</template>

<script>

import {add} from "ionicons/icons"

import NewGroupModal from "../Groups/newGroupModal.vue"

import axios from "axios"

import {
  IonSpinner,
  IonBadge,
    IonFab, 
    IonFabButton, 
    IonContent,
    IonPage,
    IonIcon,
    IonToast,
    IonItem

} from '@ionic/vue';

export default {

  components: {
    NewGroupModal,
    IonToast,
    IonSpinner,
    IonBadge,
    IonIcon,
    IonFab, 
    IonFabButton,
    IonContent,
    IonPage,
    IonItem
    },
    data() {
        return {
            add,
            groups:[],
            showLoading:false,
            openCreateNewGroupModal:false,
            error_message:null,
            createNewGroupSpinner:false
        }
    },

    created() {
      this.getroupsData()

    },

  methods: {
    getroupsData(){
     this.showLoading=true
      this.error_message=null

      this.groups=this.$store.getters["Groups/getGroups"]
      if(this.groups.length==0){
          axios.get(process.env.VUE_APP_BACKEND_API+"/master/groups",{
            headers:{
                  Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
            }
          })
          .then(res=>{
            this.$store.commit("Groups/setGroups",res.data)
            this.groups=res.data
            this.showLoading=false
          })
          .catch(()=>{
            this.showLoading=false
            this.error_message="Something went wrong"
          })
      }
      else{
          this.showLoading=false
          this.error_message=null
      }
    },
    createNewGroup(data){
          this.error_message=null
          this.createNewGroupSpinner=true
          this.openCreateNewGroupModal=false
          if(data.data){
             axios.post(process.env.VUE_APP_BACKEND_API+"/master/groups",
              {
                group_name:data.name,
                group_description:data.description
              },
              {
                headers:{
                      Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
                }
              })
              .then(res=>{
                this.$store.commit("Groups/AddNewGroup",res.data)
                var newGroup={
                ...res.data,
                "students":[],
                "allowed_std_count":0,
                "not_allowed_std_count":0
              }
              this.groups=[newGroup,...this.groups]

                this.createNewGroupSpinner=false
                this.openCreateNewGroupModal=false
              })
              .catch(()=>{
                  this.error_message="Something went wrong! try again"
                  this.createNewGroupSpinner=false
                  this.openCreateNewGroupModal=false
              })
          }
          else{
                this.createNewGroupSpinner=false
          }

    },
    openCreateNewModal(){
      this.openCreateNewGroupModal=true
    },
  },

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

</style>