import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HelloWorld from "@/views/HelloWorld.vue";
import UserTable from "@/views/UserTable.vue";

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
        path: 'users',
        component: UserTable,
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
