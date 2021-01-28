<template>
  <ion-page>
    <ion-content class="">
        <ion-spinner v-show="showLoading" name="crescent"></ion-spinner>
        <ion-item  v-for="(group,index) in groups" v-bind:key="index">
              <div class="tab-items">
                <router-link :to="{name:'group',params:{id:group.id}}">
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
                <div class="tab-item-icon">
                  <ion-icon  :icon="ellipsisVerticalSharp"></ion-icon>
                </div>
              </div>
        </ion-item>
        
        <div v-if="groups.length==0 && !showLoading" class="no-items" >
          <p>No groups yet</p>
        </div>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button>
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
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

import {add,ellipsisVerticalSharp} from "ionicons/icons"

import axios from "axios"

import {
  IonSpinner,
  IonBadge,
    IonFab, 
    IonFabButton, 
    IonContent,
    IonPage,
    IonIcon,
    IonToast

} from '@ionic/vue';

export default {

  components: {
    IonToast,
    IonSpinner,
    IonBadge,
        IonIcon,
        IonFab, 
        IonFabButton,
        IonContent,
        IonPage,
    },
    data() {
        return {
            add,
            ellipsisVerticalSharp,
            groups:[],
            showLoading:false,
            error_message:null
        }
    },

    created() {
      this.showLoading=true
      this.error_message=null
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
    },

};
</script>

<style scoped>

ion-content{
  --ion-background-color: var(--ion-background-color);
}


</style>