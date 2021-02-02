<template>
  <ion-modal
    :is-open="openModal">

    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar >
                <ion-button  slot="end" v-on:click="closeCreateNewGroupModal(false)" fill="clear">Cancel</ion-button>
            </ion-toolbar>
        </ion-header>
    
        <ion-content class="ion-padding">
            <form>
                <h2 class="ion-padding break-segments">Basics</h2>
                <ion-item class="input-with-background">
                    <ion-label position="floating">Title</ion-label>
                    <ion-input required=true v-model="title" minlength=2 type="text"></ion-input>
                </ion-item>

                <ion-item class="input-with-background">
                    <ion-label position="floating">Note</ion-label>
                    <ion-textarea required=true v-model="note" rows=7></ion-textarea>
                </ion-item>

                <ion-item class="input-with-background">
                    <ion-label position="floating">Number of questions</ion-label>
                    <ion-input type="numeric" required=true v-model="number_of_questions" ></ion-input>
                </ion-item>
                
                <h2 class="ion-padding break-segments">Date and Time</h2>
                
                <ion-item class="input-with-background">
                    <ion-label>Oneday</ion-label>
                    <ion-checkbox
                        slot="end"
                        @update:modelValue="oneday= $event"
                        :modelValue="oneday">
                    </ion-checkbox>
                </ion-item>

                <ion-item class="input-with-background">
                    <ion-label>Start date</ion-label>
                    <ion-datetime 
                        required=true
                        v-model="startDate" :min="minYear" :max="minYear+2" display-format="DD MMM YYYY" placeholder="Select Date"></ion-datetime>
                </ion-item>

                <ion-item class="input-with-background">
                    <ion-label>End date</ion-label>
                    <ion-datetime :min="minYear" :max="minYear+2" :disabled="oneday" v-model="endDate" display-format="DD MMM YYYY" placeholder="Select Date"></ion-datetime>
                </ion-item>

                <ion-item class="input-with-background">
                    <ion-label>Start time</ion-label>
                    <ion-datetime required=true v-model="startTime" placeholder="Select Time" display-format="hh:mm:A"></ion-datetime>
                </ion-item>
                <ion-item class="input-with-background">
                    <ion-label>End time</ion-label>
                    <ion-datetime required=true  v-model="endTime" placeholder="Select Time" display-format="hh:mm:A"></ion-datetime>
                </ion-item>

        
                <h2 class="ion-padding break-segments">Uploads</h2>

                <div id="master-upload-outer-container">
                    <div v-bind:key="index" v-for="(upload,index) in getUploads" class=" master-uploads-container">
                        <div class="input-with-background master-uploads-extention">
                            {{upload.extention}}
                        </div>
                        <ion-icon v-on:click="removeFile(upload)" :icon="closeCircle"></ion-icon>
                        <p>{{upload.altName}}</p>
                    </div>
                    <div class="master-upload-box">
                        <input required=true v-on:change="handleFileUpload" ref="file" multiple  type="file" accept=".pptx,.doc,.docx,.xls,.pdf,.jpeg,.jpg,.png" />
                        <ion-icon :icon="add"></ion-icon>
                    </div>
                </div>

                <div class="clearfix" id="add-groups-container">
                    <h2 class="ion-padding break-segments">Groups</h2>
                </div>

                <div id="master-test-groups" class="input-with-background">
                    <ion-chip color="success" v-for="(group,index) in groups" v-bind:key="index">
                        <ion-label>{{group.groupName.substr(0,10)}}</ion-label>
                        <ion-icon v-on:click="addGroupBackToState(group)" :icon="closeCircle"></ion-icon>
                    </ion-chip>
                    <ion-input placeholder="Search" v-model="searchGroups" type="text"></ion-input>
                    <div v-if="searchGroups!=''" id="master-search-test-group">
                        <ion-item v-on:click="addGroupToTest(group)"  v-for="(group,index) in getSearchedGroups" v-bind:key="index">
                            <div class="tab-items">
                                <p class="tab-item-title">
                                    {{group.groupName}}
                                </p>
                                <p class="tab-item-detail"><span>Allowed</span> 
                                    <ion-badge color="success">{{group.allowed_std_count}}</ion-badge>
                                </p>
                                <p class="tab-item-detail"><span>Not allowed</span> 
                                    <ion-badge color="warning">{{group.not_allowed_std_count}}</ion-badge>
                                </p>
                            </div>
                        </ion-item>
                    </div>
                </div>


                <ion-button class="submit" type="submit" size="default" slot="end" v-on:click="closeCreateNewGroupModal(true)" color="primary" expand="full">CREATE</ion-button>

            </form>
        </ion-content>
        
            <ion-toast
                class="ion-margin"
                position="middle"
                color="secondary"
                keyboard-close=true
                :is-open="error_message!=null"
                v-bind:message="error_message"
                duration="3000"
            >
            </ion-toast>
    </ion-page>
  </ion-modal>
</template>

<script>

import axios from "axios"

import {closeCircle,add} from "ionicons/icons"

import {
    IonChip,
    IonBadge,
    IonIcon,
    IonDatetime,
    IonCheckbox,
    IonToast,
    IonTextarea, 
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonModal, IonButton } from '@ionic/vue';


export default ({
    props:["openModal"],
    components: {
        IonChip,
        IonBadge,
        IonIcon,
        IonDatetime,
        IonCheckbox, 
        IonToast,
        IonTextarea,
        IonInput,
        IonItem,
        IonLabel,
        IonPage,
        IonHeader,
        IonToolbar,
        IonContent,
        IonModal, IonButton },
    
    data() {
        return {
            minYear:new Date().getFullYear(),
            groups:[],
            add,
            title:"",
            note:"",
            number_of_questions:"",
            error_message:null,
            oneday:true,
            startDate:"",
            endDate:"",
            startTime:"",
            endTime:"",
            closeCircle,
            uploads:[],
            searchGroups:"",
            groupsFromStore:[],
            groupCount:0,
            fileCount:0,
        }
    },
    computed:{
        getUploads:function(){
            if(this.uploads.length.length!=0){
                return  this.uploads.map(file=>{
                    var len=file.name.split(".").length-1
                    file.extention=file.name.split(".")[len]
                    if(file.name.length>14){
                        file.altName=file.name.substr(0,15)
                    }
                    else{
                        file.altName=file.name
                    }
                    return file
                })
            }
            else{
                return this.uploads
            }
        },
        getSearchedGroups:function(){
            if(this.groupsFromStore.length==0){
                return []
            }
            else{
                return this.groupsFromStore.filter(group=>{
                    return group.groupName.toLowerCase().match(this.searchGroups.toLowerCase())
                })
            }
        }
    },
    watch:{
       
    },
    beforeCreate() {
        this.$store.dispatch("AuthUser/initiateAuthState")
        .then(()=>{
            this.error_message=null
            var groups=this.$store.getters["Groups/getGroups"]
            if(groups.length==0){
                axios.get(process.env.VUE_APP_BACKEND_API+"/master/groups",{
                    headers:{
                        Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
                    }
                })
                .then(res=>{
                    this.$store.commit("Groups/setGroups",res.data)
                    this.groupsFromStore=res.data
                })
                .catch(()=>{
                    this.error_message="Something went wrong"
                })
            }
        })
    },
    mounted() {
        

    },
    methods: {
        addGroupBackToState(group){
            this.groupsFromStore=[group,...this.groupsFromStore]
            this.groups=this.groups.filter(grp=>{
                return grp.id!=group.id
            })
            this.groupCount=this.groupCount-1
        },
        removeFile(data){
            this.uploads=this.uploads.filter(file=>{
                return file.name!=data.name
            })
            this.fileCount=this.fileCount-1
        },
        addGroupToTest(group){
            this.groups=[group,...this.groups]
            this.groupsFromStore=this.groupsFromStore.filter(grp=>{
                return grp.id!=group.id
            })
            this.groupCount=this.groupCount+1
        },
        handleFileUpload(){
            this.uploads=[...this.$refs.file.files,...this.uploads]
            this.fileCount=this.fileCount+1
        },
        closeCreateNewGroupModal(close){
           if(close){
               console.error(this.uploads)
               console.error(this.startDate)
               console.error(this.endDate)
               console.error(this.endTime)
            //     if(this.groupDescription.replace(/\s+/g, '')!="" && this.groupName.replace(/\s+/g, '')!=""){
            //     this.$emit("createNewHomework",{
            //         data:close?true:false,
            //         name:this.groupName,
            //         description:this.groupDescription,
            //     })
            // }
            // else{
            //     this.error_message="Please dont not leave fileds empty"
            // }
           }
           else{
                 this.$emit("createNewHomework",{
                    data:close?true:false,
                    name:this.groupName,
                    description:this.groupDescription,
                })
           }
        }
    },
});
</script>

<style scoped>
    .md,.ios {
  --ion-background-color: var(--ion-color-primary);
}
.md ion-item,.ios ion-item{
  --ion-background-color: #fff;
  --ion-text-color: #000;
}
.md, .ios {
    --ion-background-color: white;
}
ion-toolbar ion-button{
    color: white;
}
.break-segments{
    color: var(--ion-color-primary);
    margin-top: 0;
    font-size: 20px;
    font-weight: bold;
}

.master-uploads-container{
    width: 25%;
    height: fit-content;
    margin: 0 5px 5px 0;
    position: relative;
}
.master-uploads-container p{
    color: var(--ion-color-primary);
    text-align: center;
    margin: 0;
}

.master-upload-box{
    width: 80px;
    height: 80px;
    margin: 0 5px 5px 0;
    position: relative;
    background:var(--ion-color-step-750);
    position: relative;
}
.master-upload-box input{
      width: 80px;
    height: 80px;
    position: absolute;
    background: none;
    opacity: 0;
    z-index: 2;
}

.master-upload-box ion-icon{
      color: var(--ion-icon-color);
    position: absolute;
    right: 0;
    font-size: 80px;
    z-index: 1;
}

.master-uploads-container ion-icon{
    color: black;
    
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
}

#master-upload-outer-container{
        display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.master-uploads-extention{
        width: 80px;
   color: black;
    height: 80px;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
        font-size: 25px;
}

#add-groups-container{
        display: flex;
    align-items: center;
}

#add-groups-container span{
      width: -webkit-fill-available;
    text-align: end;
}
#add-groups-container ion-button{
    height: 25px;
}

#master-test-groups{
    display: flex;
    flex-wrap: wrap;
}
#master-test-groups ion-input{
    display: inherit;
    width: -webkit-fill-available;
    color: black;
}

#master-search-test-group ion-item{
    --background: var(--ion-color-step-750);
        margin: 15px 0;
}

#master-search-test-group{
    background: white;
}

.submit{
    margin-top: 30px;
}

</style>