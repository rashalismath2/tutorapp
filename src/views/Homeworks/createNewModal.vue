<template>
  <ion-modal
    :is-open="openModal">

    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar >
                <ion-button  slot="end" v-on:click="closeCreateNewGroupModal" fill="clear">Cancel</ion-button>
            </ion-toolbar>
        </ion-header>
    
        <ion-content class="ion-padding">
            <form v-on:submit="submitData">
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

                <ion-item class="input-with-background">
                    <ion-label>Allow late submissions</ion-label>
                    <ion-checkbox
                        slot="end"
                        @update:modelValue="allowLate= !allowLate"
                        :modelValue="allowLate">
                    </ion-checkbox>
                </ion-item>
                
                <h2 class="ion-padding break-segments">Date and Time</h2>
                
                <ion-item class="input-with-background">
                    <ion-label>Oneday</ion-label>
                    <ion-checkbox
                        slot="end"
                        @update:modelValue="onetime= !onetime"
                        :modelValue="onetime">
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
                    <ion-datetime :min="minYear" :max="minYear+2"  v-model="endDate" display-format="DD MMM YYYY" placeholder="Select Date"></ion-datetime>
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
                            {{upload.extension}}
                        </div>
                        <ion-icon v-on:click="removeFile(upload)" :icon="closeCircle"></ion-icon>
                        <p>{{upload.altName}}</p>
                    </div>
                    <div class="master-upload-box">
                        <input v-on:click="handleFileUpload"   type="button" />
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

                <ion-button  type="submit" size="default" :disabled="loadingDialog" expand="full" color="primary" >
                    <ion-spinner v-if="loadingDialog" color="primary" name="crescent"></ion-spinner>
                    <span v-else>CREATE</span>
                </ion-button>

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

import { Capacitor } from "@capacitor/core";


import { FileChooser } from '@ionic-native/file-chooser';
import {closeCircle,add} from "ionicons/icons"

import {
    IonSpinner,
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
    IonModal, IonButton ,useBackButton } from '@ionic/vue';


export default ({
    props:["openModal"],
    components: {
        IonSpinner,
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
            onetime:1,
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
            allowLate:1,
            loadingDialog:false
        }
    },
    computed:{
        getUploads:function(){
            if(this.uploads.length!=0){
                return  this.uploads.map(file=>{
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
    setup(){
                useBackButton(10, () => {
               this.$emit("createNewHomework",{
                data:null
            })
        });
    },
    created() {
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
        async handleFileUpload(){
            this.error_message=null
            var allowd=["jpg","png","jpeg", "pdf", "doc","docx","xls","pptx"]
            
            FileChooser.open()
            .then(async (uri) =>{
                 this.error_message=null
                let path = Capacitor.convertFileSrc(uri);
                var file = await fetch(path).then((r) => r.blob());

                var nameLength=path.split("/").length
                var fileName=path.split("/")[nameLength-1]
                var extension=file.type.split("/")[file.type.split("/").length-1]


                if(allowd.includes(extension)){
                    file={
                        file:file,
                        name:fileName,
                        extension:extension
                    }
                    this.uploads=[file,...this.uploads]
                    this.fileCount=this.fileCount+1    
                }
                else{
                    this.error_message="Can't upload "+extension+" types of files."
                }
                               
            })
            .catch(() =>{
                this.error_message="Could'nt pickup the file"
            });

        },
        closeCreateNewGroupModal(){  
            this.$emit("createNewHomework",{
                data:null
            })
        },
        submitData(e){
            e.preventDefault();
            
            this.error_message=null
            this.loadingDialog=false
            
            if(this.groups.length==0 || this.uploads.length==0){
                this.error_message="There should be atleast one attachement and group"
            }
            else if(this.startDate==null || this.startTime==null || this.endTime==null){
                this.error_message="Please fill time fields"
            }
            else{

                var formData=new FormData();

                formData.append("title",this.title);
                formData.append("note",this.note);

                if(this.onetime){
                    formData.append("onetime",1);
                }
                else{
                    formData.append("onetime",0);
                }
                
                formData.append("startDate",this.startDate);
                formData.append("endDate",this.endDate);
                formData.append("startTime",this.startTime);
                formData.append("endTime",this.endTime);
                formData.append("groupCount",this.groupCount);
                formData.append("fileCount",this.fileCount);
                formData.append("number_of_questions",this.number_of_questions);

                if(this.allowLate){
                   formData.append("allow_late",1);
                }
                else{
                     formData.append("allow_late",0);
                }
                

                this.groups.forEach((grp,i) => {
                     var j=i+1
                    formData.append("group_"+j,grp.id)
                });
                this.uploads.forEach((file,i) => {
                    var j=i+1
                    formData.append("file_"+j,file.file,file.name+"."+file.extension)
                });

                this.loadingDialog=true
                axios.post(process.env.VUE_APP_BACKEND_API+'/master/homeworks',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization":"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
                    }
                }
                )
                .then((res)=>{
                    this.error_message="Homework created"
                    this.loadingDialog=false
                    this.$emit("createNewHomework",{
                        data:formData,
                        newData:res.data.data
                    })

                })
                .catch((e)=>{
                    this.error_message=e
                    this.loadingDialog=false
                    // this.error_message="Something went wrong. Please check inputs and try again!"
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
ion-spinner{
  color:white
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