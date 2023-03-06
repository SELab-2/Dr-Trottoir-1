import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import UserCreation from "@/views/UserCreation.vue";


const routes = [
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/usercreation',
    component: UserCreation,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
