import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HelloWorld from "@/views/HelloWorld.vue";
import PhotoMaker from "@/components/PhotoMaker.vue";

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
    ]
  },
  {
    path: '/photoMaker',
    component: PhotoMaker,
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
