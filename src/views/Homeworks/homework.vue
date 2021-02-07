<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>

        <ion-buttons @click="jumpToHome" slot="start" >
          <ion-icon  :icon="arrowBack"></ion-icon>
        </ion-buttons >
          
          <ion-buttons @click="presentActionSheet" slot="end">
              <ion-icon  :icon="ellipsisVerticalSharp"></ion-icon>
          </ion-buttons>
        <ion-title>Homework</ion-title>
        
      </ion-toolbar>
    </ion-header>
        
    <ion-content class="ion-padding">

            <div v-if="homework!=null">
                <form v-on:submit="submitData">
                    <h2 class="ion-padding break-segments">Basics</h2>
                    <ion-item class="input-with-background">
                        <ion-label position="floating">Title</ion-label>
                        <ion-input :readonly="!isEdditting" required=true v-model="homework.title" minlength=2 type="text"></ion-input>
                    </ion-item>

                        
                    <ion-item class="input-with-background">
                        <ion-label position="floating">Note</ion-label>
                        <ion-textarea :readonly="!isEdditting" required=true v-model="homework.note" rows=7></ion-textarea>
                    </ion-item>

                    <ion-item class="input-with-background">
                        <ion-label position="floating">Number of questions</ion-label>
                        <ion-input :readonly="!isEdditting" type="numeric" required=true v-model="homework.number_of_questions" ></ion-input>
                    </ion-item>

                    <ion-item class="input-with-background">
                        <ion-label>Allow late submissions</ion-label>
                        <ion-checkbox
                            :disabled="!isEdditting"
                            slot="end"
                            @update:modelValue="homework.allowLate= !homework.allowLate"
                            :modelValue="homework.allowLate">
                        </ion-checkbox>
                    </ion-item>
                    
                    <h2 class="ion-padding break-segments">Date and Time</h2>
                    
                    <ion-item class="input-with-background">
                        <ion-label>Oneday</ion-label>
                        <ion-checkbox
                            :disabled="!isEdditting"
                            slot="end"
                            @update:modelValue="homework.onetime= !homework.onetime"
                            :modelValue="homework.onetime">
                        </ion-checkbox>
                    </ion-item>

                    <ion-item class="input-with-background">
                        <ion-label>Start date</ion-label>
                        <ion-datetime 
                            :readonly="!isEdditting"
                            required=true
                            v-model="homework.startDate" :min="minYear" :max="minYear+2" display-format="DD MMM YYYY" placeholder="Select Date"></ion-datetime>
                    </ion-item>

                    <ion-item class="input-with-background">
                        <ion-label>End date</ion-label>
                        <ion-datetime :readonly="!isEdditting" :min="minYear" :max="minYear+2"  v-model="homework.endDate" display-format="DD MMM YYYY" placeholder="Select Date"></ion-datetime>
                    </ion-item>

                    <ion-item class="input-with-background">
                        <ion-label>Start time</ion-label>
                        <ion-datetime :readonly="!isEdditting" required=true v-model="homework.startTime" placeholder="Select Time" display-format="hh:mm:A"></ion-datetime>
                    </ion-item>
                    <ion-item class="input-with-background">
                        <ion-label>End time</ion-label>
                        <ion-datetime :readonly="!isEdditting" required=true  v-model="homework.endTime" placeholder="Select Time" display-format="hh:mm:A"></ion-datetime>
                    </ion-item>

                    <h2 class="ion-padding break-segments">Uploads</h2>
                    <div id="master-upload-outer-container">
                        <div :disable="downloadingIds.includes(upload.id)" v-on:click="openFile(upload)" v-bind:key="index" v-for="(upload,index) in homework.homework_attachments" class=" master-uploads-container">
                            <div class="input-with-background master-uploads-extention">
                                {{upload.file_type}}
                            </div>
                            <ion-spinner v-if="downloadingIds.includes(upload.id)" color="primary"></ion-spinner>
                            <ion-icon v-show="isEdditting" v-on:click="removeFile(upload)" :icon="closeCircle"></ion-icon>
                            <p>{{getFileName(upload.file_path)}}</p>
                        </div>
                        <div v-show="isEdditting" class="master-upload-box">
                            <input v-on:click="handleFileUpload"   type="button" />
                            <ion-icon :icon="add"></ion-icon>
                        </div>
                    </div>

                        
                    <div class="clearfix" id="add-groups-container">
                        <h2 class="ion-padding break-segments">Groups</h2>
                    </div>

                    <div id="master-test-groups" class="input-with-background">
                        <ion-chip :disabled="!isEdditting" color="success" v-for="(group,index) in homework.homework_groups" v-bind:key="index">
                            <ion-label>{{group.group.groupName.substr(0,10)}}</ion-label>
                            <ion-icon  v-on:click="addGroupBackToState(group.group)" :icon="closeCircle"></ion-icon>
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


                </form>
            </div>

            <div v-for="i in [1,2,3,4,5]" v-bind:key="i" v-else class="ion-padding custom-skeleton">
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
            </div>

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


    </ion-content>
  </ion-page>
</template>

<script >

import { Downloader } from '@ionic-native/downloader'
import { 
    Plugins,FilesystemDirectory,

    } from '@capacitor/core';
const { Filesystem } = Plugins;

import { FileOpener } from '@ionic-native/file-opener'

import {
    ellipsisVerticalSharp,
    add,
    closeCircle,
    // close, 
//   trash,pencil,
  arrowBack,
//   share, peopleCircle,at
  } from "ionicons/icons"

// import axios from "axios"

import {
    IonBadge,
    IonSpinner,
    IonIcon,
    IonTextarea,
    IonDatetime,IonCheckbox,
    IonItem,
    IonLabel,
    IonInput,
    IonSkeletonText,
    IonToast,
    IonButtons,
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';


export default {
  components: {
      IonBadge,
      IonSpinner,
      IonIcon,
    IonTextarea,
    IonDatetime,IonCheckbox,
    IonItem,
    IonLabel,
    IonInput,
    IonToast,
    IonSkeletonText,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  data() {
      return {
        arrowBack,
        ellipsisVerticalSharp,
        add,
        closeCircle,
        error_message:null,
        homework:null,
        minYear:new Date().getFullYear(),
        isEdditting:false,
        downloadingIds:[]
      }
  },
    computed:{
     
    },
  mounted() {


  },
  created() {
      this.homework=JSON.parse(JSON.stringify(this.$store.getters["Homeworks/getHomewroks"].filter(homework=>{
          return homework.id==this.$route.params.id
      })[0]))
      console.log(this.homework)
  },
    watch: {
       
    },
  methods: {
         getFileName:(filepath)=>{
            var filePath=filepath
            var fileNameSplit=filePath.split("/")
            var fileName=fileNameSplit[fileNameSplit.length-1]
            return fileName
        },
    submitData(){},
    jumpToHome(){
      this.$router.replace({name:"TabTests"});
    },
    async openFile(upload){

        var filePath=upload.file_path
        var fileNameSplit=filePath.split("/")
        var fileName=fileNameSplit[fileNameSplit.length-1]

        var mimeType=""
        switch (upload.file_type) {
            case "pdf":
                mimeType="application/pdf"
                break;
            case "jpeg":
                mimeType="image/jpeg"
                break;
            case "jpg":
                mimeType="image/jpeg"
                break;
            case "png":
                mimeType="image/png"
                break;
            case "doc":
                mimeType="application/msword"
                break;
            case "docX":
                mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                break;
            case "PPT":
                mimeType="application/vnd.ms-powerpoint"
                break;
            case "xls":
                mimeType="application/vnd.ms-excel"
                break;
        
            default:
                break;
        }

        try {
            const ret = await Filesystem.getUri({
                path: 'Master/Attachments/'+fileName,
                directory: FilesystemDirectory.External
            });

            FileOpener.showOpenWithDialog(ret.uri, mimeType)
            .then(() => console.log('File is opened'))
            .catch(() => {
                var request= {
                    uri: "http://192.168.8.101:8000/"+upload.file_path ,
                    title: 'Master - '+fileName,
                    visibleInDownloadsUi: true,
                    notificationVisibility:0,
                    destinationInExternalFilesDir: {
                        dirType: 'Master/Attachments',
                        subPath: fileName
                    }
                };
                this.downloadingIds=[upload.id,...this.downloadingIds]
                Downloader.download(request)
                    .then(loc=>{
                        FileOpener.showOpenWithDialog(loc, mimeType)
                        .then(() => {
                            this.downloadingIds=this.downloadingIds.filter(id=>{
                                return id!=upload.id
                            })
                        })
                        .catch((e) => {
                            this.error_message=e.message
                        });
                    })
                    .catch((err)=>{
                        this.error_message=err
                    });
            });
        }
        catch (e) {
                //if something went wrong while reading download?
            var request= {
                uri: "http://192.168.8.101:8000/"+upload.file_path ,
                title: 'Master - '+fileName,
                visibleInDownloadsUi: true,
                notificationVisibility:0,
                destinationInExternalFilesDir: {
                    dirType: 'Master/Attachments',
                    subPath: fileName
                }
            };
            this.downloadingIds=[upload.id,...this.downloadingIds]
            Downloader.download(request)
                .then(loc=>{
                    FileOpener.showOpenWithDialog(loc, mimeType)
                    .then(() => {
                        this.downloadingIds=this.downloadingIds.filter(id=>{
                            return id!=upload.id
                        })
                    })
                    .catch((e) => {
                        this.error_message=e.message
                    });
                })
                .catch((err)=>{
                    this.error_message=err
                });
        }

  
    }

  },


};
</script>

<style scoped>
.error-text{
    color:var(--ion-color-danger)
}
ion-content{
  --ion-background-color: var(--ion-background-color);
}

ion-action-sheet.actionSheetCss{
  --ion-background-color: var(ion-color-secondary) !important;
  
}
ion-skeleton-text{
    background: var(--ion-color-secondary);
}

</style>