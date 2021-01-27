<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title slot="start"><b>Members</b></ion-title>
        <ion-button slot="end" v-on:click="cancelMembersModal" fill="clear">Cancel</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content >
        <ion-searchbar v-on:ionChange="searchText"></ion-searchbar>


    </ion-content>
    
  </ion-page>
</template>

<script>



import { 
    IonHeader,
    IonTitle,
    IonSearchbar,
  IonContent,  IonPage, IonToolbar } from '@ionic/vue';


export default ({

  name: 'Home',
  components: {
    IonHeader,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonPage,
    
    IonToolbar
  },
  // beforeCreate(){},

  created() {
    
  },
   methods: {
       cancelMembersModal(){
           this.$emit("cancelMembersModal")
       },
       searchText(text){
           console.log(text.target.value)
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
    --color:var(--ion-text-color);
}
ion-content{
  --ion-background-color: var(--ion-background-color);
}


</style>