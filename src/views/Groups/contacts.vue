<template>
  <ion-page>
    <ion-tabs >
      <ion-tab-bar slot="bottom">
        <ion-tab-button :selected=tabSelected tab="allContacts" :href="'/contacts/'+grpId+'/TabAllContacts/'">
          <ion-label>Contacts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab" :href="'/contacts/'+grpId+'/TabRequests/'">
          <ion-label>Requests</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>

import { 

  IonLabel, 
  IonPage,
  IonTabBar, 
  IonTabButton, 
  IonTabs
} from '@ionic/vue';

// import { calendar, personCircle } from 'ionicons/icons';

export default {
    components: { 
        IonLabel, 
        IonPage, 
        IonTabBar, 
        IonTabButton, 
        IonTabs 
     },
    data() {
        return {
          grpId:null,
          tabSelected:true
        }
    },
    created() {
      this.grpId=this.$route.params.group_id
    },

};
</script>

<style  scoped>
ion-content{
  --ion-background-color: var(--ion-background-color);
}

</style>