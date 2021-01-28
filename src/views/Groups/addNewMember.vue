<template>
    <ion-alert
        :is-open="openAddNewMember"
        header="Add new member"
        :buttons="buttons"
        :inputs="inputs"  
        >
    </ion-alert>
</template>

<script>
import {IonAlert} from '@ionic/vue';
export default {
    components:{
        IonAlert
    },
    props:["openAddNewMember"],
    data() {
        return {
            student_id:"",
            inputs:[
                {
                    name: 'student_id',
                    type: 'text',
                    placeholder: 'Student ID',
                    attributes: {
                        minlength:2
                    }
                },
                {
                    name: 'student_email',
                    type: 'email',
                    placeholder: 'Student email',
                    attributes: {
                        minlength:5,
                        inputmode: 'email'
                    }
                },
                 {
                    type: 'checkbox',
                    label: 'Allow',
                    id:"new-member-check",
                    value: 'allow',
                    checked: true,
                },
            ],
            buttons:[
                {
                    text: 'Add',
                    handler: (data) => {

                        console.log(data)
                        return false
                        // this.$emit("dissmissAlertAddNewMember")
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.$emit("dissmissAlertAddNewMember")
                    },
                },
              
            ]
        }
    },
    methods: {
        dissmissAlertAddNewMember(){
            this.$emit("dissmissAlertAddNewMember")
        }
    },
}
</script>