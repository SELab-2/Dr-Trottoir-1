import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AccountSettings from "@/views/AccountSettings.vue";


const routes = [
  {
    path: '/',
    component: LoginScreen,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: MainLayout,
    children: [
      {
        path: '/account',
        name: 'Account instellingen',
        component: AccountSettings,
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
