<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
          <ion-buttons slot="start">
              <ion-back-button default-href="/home/TabGroups"></ion-back-button>
          </ion-buttons>
        <ion-title>{{ group.groupName}}</ion-title>
      </ion-toolbar>
    </ion-header>
        
    <ion-content >

    </ion-content>
  </ion-page>
</template>

<script >
import {IonButtons,IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';


export default {
  name: 'Home',
  components: {
    IonButtons,IonBackButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  data() {
      return {
          group:{}
      }
  },
  created() {
    var groups=this.$store.getters["Groups/getGroups"]
        
    this.group=groups.filter(group=>{
        return group.id==this.$route.params.id
    })[0]

      
  },
    mounted() {
    },
};
</script>

<style scoped>
ion-content{
  --ion-background-color: var(--ion-background-color);
}


</style>