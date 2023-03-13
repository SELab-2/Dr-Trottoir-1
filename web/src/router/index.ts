import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HelloWorld from "@/views/HelloWorld.vue";
import BuildingMaker from "@/views/BuildingMaker.vue"
import addImage from "@/components/addImage.vue"
import multiAddImage from "@/components/multiAddImage.vue"

const routes = [
  {
    path: '/',
    component: LoginScreen,
  },
  {
    path: '/dashboard',
    component: MainLayout,
    children: [
      {
        path: 'example',
        component: MainLayout,
      },
      {
        path: '/gebouw/toevoegen',
        component: BuildingMaker,

      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
