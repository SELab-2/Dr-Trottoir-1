import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from "@/views/LoginScreen.vue";
import DashBoard from "@/views/DashBoard.vue";
import Todo from "@/views/Todo.vue"

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/dashboard',
    component: DashBoard
  },
  {
    path: '/todo',
    component: Todo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
