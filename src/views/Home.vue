<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title><b>Master</b></ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content >
        <ion-tabs  @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
        <ion-tab-bar slot="top">
          <ion-tab-button :selected=testsTabSelected tab="tests"  href="/home/TabTests">
            <ion-label>Homeworks</ion-label>
          </ion-tab-button>

          <ion-tab-button :selected=groupsTabSelected tab="groups" href="/home/TabGroups">
            <ion-label>Groups</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script>



import { 

  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

import { defineComponent } from 'vue';

export default defineComponent({

  name: 'Home',
  components: {

      IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  // beforeCreate(){},
  data() {
    return {
      groupsTabSelected:false,
      testsTabSelected:false,
      
    }
  },
  mounted() {
    
  },
  beforeCreate() {
    this.$store.dispatch("AuthUser/initiateAuthState")
  },
  methods:{
    beforeTabChange(e){
      if(e.tab=="tests"){
        this.testsTabSelected=true
        this.groupsTabSelected=false
      }
      else{
          this.testsTabSelected=false
        this.groupsTabSelected=true
      }

    },
    afterTabChange(){
      
    }
  }

});

</script>

<style scoped>
ion-tab-bar{
  margin-bottom: 10px;
}

ion-content{
  --ion-background-color: var(--ion-background-color);
}

#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>