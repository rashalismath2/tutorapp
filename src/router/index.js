import { createRouter, createWebHistory } from '@ionic/vue-router';

import Home from '../views/Home.vue'

import Login from "../views/Authentication/Login.vue"
import Register from "../views/Authentication/Register.vue"



const routes = [
  {
    path: '/',
    redirect: '/login'
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

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
