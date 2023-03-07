import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import BuildingSceen from "@/views/BuildingScreen.vue";

const routes = [
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/building/:id',
    name: 'Building',
    component: BuildingSceen,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
