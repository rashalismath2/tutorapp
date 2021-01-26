<template>
  <ion-page>
    <ion-content class="ion-padding">

        

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button>
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script>

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
    },
    data() {
        return {
            add,
        }
    },

};
</script>

<style scoped>

ion-content{
  --ion-background-color: var(--ion-background-color);
}

</style>