<template>
  <ion-page>
    <ion-tabs >
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" :href="'/group/'+groupId+'/TabAllContacts'">
          <ion-label>Contacts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="speakers" :href="'/group/'+groupId+'/TabRequests'">
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
    props:["groupId"],
    components: { 
        IonLabel, 
        IonPage, 
        IonTabBar, 
        IonTabButton, 
        IonTabs 
     },
    data() {
        return {
      
        }
    },

};
</script>

<style  scoped>
ion-content{
  --ion-background-color: var(--ion-background-color);
}

</style>