<template>
    <ion-page>
        <ion-content>
            <div id="register-pic">
                <div id="master-icon">
                    
                    <img v-if="imgUrl"  v-on:click="takePicture" v-bind:src="imgUrl" />
                    <img v-else v-on:click="takePicture"  src="../../src/icons/add-photo.png" />
                </div>
                <div class="ion-margin">
                    <div class="ion-margin ion-text-capitalize">
                        <ion-text>
                            <p><b>Almost there,</b></p>
                            <p>You can add a profile picture(optional) and fill the education field here</p>
                        </ion-text>

                    </div>
                    <form class="ion-margin" v-on:submit.prevent="submitPicture">
                        <ion-input  v-model="education"  inputmode="text" placeholder="Education" type="text" required ></ion-input>
                        <ion-button class="ion-margin-top" type="submit" expand="full" color="primary">REGISTER</ion-button>
                    </form>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>

import { Plugins, CameraResultType,Capacitor ,FilesystemDirectory } from "@capacitor/core";

const { Camera,Filesystem   } = Plugins;

import {IonButton,
 
        IonInput, 
        IonPage,
        IonContent,
         } from "@ionic/vue"

export default{
    components:{
        IonInput,
        IonPage,
        IonContent,
        IonButton,

    },
    props:["firstName","lastName","email"],
    data() {
        return {
            education:"",
            img:null,
            imgUrl:null
        }
    },
    methods: {
        async takePicture() {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri,
            });

            Filesystem.readFile({
                path: image.path
            })
            .then(result=>{

                let date = new Date(),
                time = date.getTime(),
                fileName = time + ".jpeg";

                Filesystem.writeFile({
                    data: result.data,
                    path: fileName,
                    directory: FilesystemDirectory.Data
                })
                .then(()=>{
                    Filesystem.getUri({
                        directory: FilesystemDirectory.Data,
                        path: fileName
                    })
                    .then((uri)=>{
                        let path = Capacitor.convertFileSrc(uri.uri);
                        console.log(path);
                        this.imgUrl = path;

                        Filesystem.readFile({
                            path: uri.uri
                        })
                        .then(file=>{
                            this.photo=file.data
                        })

                    })
                    .catch(()=>{})


                })
                .catch(()=>{})

            })
            .catch(()=>{

            })
            

        },
    

        submitPicture(){
            var data={
                photo:this.img,
                education:this.education,
            }
            this.$emit("submitPictureWithData",data);
        },

    },
}

</script>

<style  scoped>

.md,.ios {
  --ion-background-color: var(--ion-color-primary);
}
.md ion-item,.ios ion-item{
  --ion-background-color: #fff;
  --ion-text-color: #000;
}

ion-toast{
    --border-radius:20px
}

p{
    text-align: center;
    color: var(--ion-color-secondary);
}



#register-pic{
    background: white;
    height: 75%;
    border-radius: 50px 50px 0 0;
    position: absolute;
    width: 100%;
    color: black;
    bottom: 0;
}
#master-icon {
    display: flex;
    justify-content: center;
    height: 80px;
}
#master-icon img{
    width: 120px;
    height: 120px;
    position: absolute;
    top: -50px;
    background: white;

    padding: 10px;
    box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
    -webkit-box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
    -moz-box-shadow: -2px -2px 8px 2px rgba(0,0,0,0.19);
}

form{
    height: calc(100% - 80px);
    margin: 0;
}


</style>