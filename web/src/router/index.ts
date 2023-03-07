import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import App from "@App.vue";

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginScreen,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
