<template>
  <ion-page>
    <ion-content class="ion-padding">
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button v-on:click="openCreateNewHomework">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
      <div v-if="tests.length==0" class="no-items" >
          <p>No tests yet</p>
      </div>
    </ion-content>
    <createNewHomeworkModal v-bind:openModal="openCreateNewHomeworkModal" v-on:createNewHomework="createNewHomework($event)" />
  </ion-page>
</template>

<script>
import createNewHomeworkModal from "../Homeworks/createNewModal.vue"

import {add} from "ionicons/icons"


import {
    IonFab, 
    IonFabButton, 
    IonContent,
    IonPage,
    IonIcon

} from '@ionic/vue';

export default {

  components: {
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
            openCreateNewHomeworkModal:false
        }
    },
    created() {
       
    },
    beforeCreate() {
      
    },
    methods:{
      openCreateNewHomework(){
          this.openCreateNewHomeworkModal=true
      },
      createNewHomework(event){
        if(!event.data){
          this.openCreateNewHomeworkModal=false
        }
      }
    }

};
</script>

<style scoped>

ion-content{
  --ion-background-color: var(--ion-background-color);
}

</style>