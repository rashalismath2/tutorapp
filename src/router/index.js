import { createRouter, createWebHistory } from '@ionic/vue-router';

import Home from '../views/Home.vue'

import Login from "../views/Authentication/Login.vue"
import Register from "../views/Authentication/Register.vue"

import Group from "../views/Groups/group.vue"

import Contact from "../views/Groups/contacts.vue"


const routes = [
  {
    path: '/',
    redirect: '/home'
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path:"",
        redirect:"/home/TabTests"
      },
      {
        path: 'TabGroups',
        name: 'TabGroups',
        component: ()=>import("../views/Home/TabGroups.vue")
      },
      {
        path: 'TabTests',
        name: 'TabTests',
        component: ()=>import("../views/Home/TabTests.vue")
      }
    ]
  },

  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/group/:id',
    name: 'group',
    component: Group,
  },
  {
    path:"/contacts/:group_id",
    name:"contacts",
    component:Contact,
    children:[
      {
        path: 'TabRequests',
        name: 'TabRequests',
        component: ()=>import("../views/Groups/contactTabs/requests.vue")
      },
      {
        path: 'TabAllContacts',
        name: 'TabAllContacts',
        component: ()=>import("../views/Groups/contactTabs/allContacts.vue")
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
