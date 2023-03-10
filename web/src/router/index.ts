import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HelloWorld from "@/views/HelloWorld.vue";
import Photo_Maker from "@/components/Photo-maker.vue";

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
    path: '/photo-maker',
    component: Photo_Maker,
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
