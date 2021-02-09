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
                        <div v-bind:key="index" v-for="(upload,index) in getUploads" class=" master-uploads-container">
                            <div class="input-with-background master-uploads-extention">
                                {{upload.extension}}
                            </div>
                            <ion-icon v-show="isEdditting" v-on:click="removeFileFromUpload(upload)" :icon="closeCircle"></ion-icon>
                            <p>{{getFileName(upload.altName)}}</p>
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
                        <ion-chip  color="success" v-for="(group,index) in homework.homework_groups" v-bind:key="index">
                            <ion-label>{{group.group.groupName.substr(0,10)}}</ion-label>
                            <ion-icon v-show="isEdditting"  v-on:click="removeGroup(group)" :icon="closeCircle"></ion-icon>
                        </ion-chip>
                        <ion-chip  color="success" v-for="(group,index) in groups" v-bind:key="index">
                            <ion-label>{{group.groupName.substr(0,10)}}</ion-label>
                            <ion-icon v-show="isEdditting"  v-on:click="removeNewGroup(group)" :icon="closeCircle"></ion-icon>
                        </ion-chip>
                        <ion-input v-show="isEdditting" placeholder="Search" v-model="searchGroups" type="text"></ion-input>
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

                    <ion-button v-show="isEdditting"  type="submit" size="default" :disabled="loadingDialog" expand="full" color="primary" >
                        <ion-spinner v-if="loadingDialog" color="primary" name="crescent"></ion-spinner>
                        <span v-else>Update</span>
                    </ion-button>
                    <ion-button v-show="isEdditting" v-on:click="isEdditting=false"  type="button" size="default" :disabled="loadingDialog" expand="full" color="primary" >
                        <span>Cancel</span>
                    </ion-button>

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

              <ion-loading
                :is-open="openDelete"
                cssClass="delete-spinner"
                message="Please wait..."
            >
            </ion-loading>
    </ion-content>
  </ion-page>
</template>

<script >

import { Downloader } from '@ionic-native/downloader'
import { 
    Plugins,FilesystemDirectory,
    Capacitor
    } from '@capacitor/core';
const { Filesystem } = Plugins;

import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener'

import {
    ellipsisVerticalSharp,
    add,
    closeCircle,
    close, 
    trash,pencil,
  arrowBack,
//   share, peopleCircle,at
  } from "ionicons/icons"

import axios from "axios"

import {
    IonLoading,
    alertController ,
    IonButton,
    IonChip,
    actionSheetController ,
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
      IonLoading,
      IonButton,
      IonChip,
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
        downloadingIds:[],
        loadingDialog:false,
        searchGroups:"",
        groupsFromStore:[],
        uploads:[],
        groups:[],
        fileCount:0,
        groupCount:0,
        removedOriginalHomeworkFiles:[],
        removedOriginalHomeworkFilesCount:0,
        removedOriginalHomeworkGroups:[],
        removedOriginalHomeworkGroupsCount:0,
        openDelete:false
      }
    },
    computed:{
        getSearchedGroups:function(){
            if(this.groupsFromStore.length==0){
                return []
            }
            else{
                return this.groupsFromStore.filter(group=>{
                    return group.groupName.toLowerCase().match(this.searchGroups.toLowerCase())
                })
            }
        },
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
    },
  mounted() {


  },
  created() {
      this.homework=JSON.parse(JSON.stringify(this.$store.getters["Homeworks/getHomewroks"].filter(homework=>{
          return homework.id==this.$route.params.id
      })[0]))
      this.groupsFromStore=this.$store.getters["Groups/getGroups"]
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
        removeGroup(group){
            //removing group from the data we got from the server
            this.homework={
                ...this.homework,
                homework_groups:this.homework.homework_groups.filter(grp=>{
                    return grp.group_id!=group.group_id
                })
            }
            this.removedOriginalHomeworkGroups=[...this.removedOriginalHomeworkGroups,group.id]
            this.removedOriginalHomeworkGroupsCount=this.removedOriginalHomeworkGroupsCount+1
        },
        removeNewGroup(group){
            // removing groups that was added new
            this.groupsFromStore=[group,...this.groupsFromStore]
            this.groups=this.groups.filter(grp=>{
                return grp.id!=group.id
            })
            this.groupCount=this.groupCount-1
        },
        addGroupToTest(group){
            // adding new groups
            this.groups=[group,...this.groups]
            this.groupsFromStore=this.groupsFromStore.filter(grp=>{
                return grp.id!=group.id
            })
            this.groupCount=this.groupCount+1
        },
        removeFile(upload){
            //removing files that was recieved from the server
            this.homework={
                ...this.homework,
                homework_attachments:this.homework.homework_attachments.filter(upld=>{
                    return upld.id!=upload.id
                })
            }
            this.removedOriginalHomeworkFiles=[...this.removedOriginalHomeworkFiles,upload.id]
            this.removedOriginalHomeworkFilesCount=this.removedOriginalHomeworkFilesCount+1

        },
        removeFileFromUpload(upload){
            // removing files that were added newly
           this.uploads=this.uploads.filter(file=>{
                return file.name!=upload.name
            })
            this.fileCount=this.fileCount-1
        },
        submitData(){},
        jumpToHome(){
            this.$router.replace({name:"TabTests"});
        },
        handleFileUpload(){
            this.error_message=null
            var allowd=["jpg","png","jpeg", "pdf", "doc","docx","xls","pptx"]
            
            FileChooser.open()
            .then(async (uri) =>{
                let path = Capacitor.convertFileSrc(uri);
                var file = await fetch(path).then((r) => r.blob());

                var nameLength=path.split("/").length
                var fileName=path.split("/")[nameLength-1]
                var extension=file.type.split("/")[file.type.split("/").length-1]


                if(allowd.includes(extension)){
                    file={
                        file:file,
                        name:fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
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
        async presentAlertConfirmDelete() {
            const alert = await alertController
                .create({
                cssClass: '',
                header: 'Confirm!',
                message: 'Are you really want to delete?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: blah => {
                            console.log('Confirm Cancel:', blah)
                        },
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            this.error_message=null
                            this.openDelete=true
                            axios.delete(
                                process.env.VUE_APP_BACKEND_API+"/master/homeworks/"+this.$route.params.id,
                                {
                                    headers:{
                                        Authorization:"Bearer "+this.$store.getters["AuthUser/getAccessToken"]
                                    }
                                }
                            )
                            .then(()=>{
                                this.openDelete=false
                                this.$router.replace("/home/TabTests?deleted=1")
                            })
                            .catch(()=>{
                                this.error_message="Something went wrong! try again."
                                this.openDelete=false
                            })
                        },
                    },
                ],
                });
            return alert.present();
            },
        async openFile(upload){
            if(this.isEdditting){
                return 
            }
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
                        uri:process.env.VUE_APP_BACKEND+"/"+upload.file_path ,
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
                    uri: process.env.VUE_APP_BACKEND+"/"+upload.file_path ,
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
        },
         async presentActionSheet() {
            const actionSheet = await actionSheetController
                .create({
                cssClass: '',
                buttons: [
                    {
                        text: 'Edit',
                        role: 'destructive',
                        icon: pencil,
                        handler: () => {
                            this.isEdditting=true
                        },
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            this.presentAlertConfirmDelete();
                        },
                    },
                    {
                        text: 'Cancel',
                        icon: close,
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked')
                        },
                    },
                ],
                });
            return actionSheet.present();
            },


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
#master-test-groups{
    margin-bottom:15px !important;
}


</style>