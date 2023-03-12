import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import StudentFollowUp from "@/views/StudentFollowUp.vue";

const routes = [
  {
    path: "/",
    component: LoginScreen,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: MainLayout,
    children: [
      {
        path: "/studentfollowup",
        name: "Opvolging studenten",
        component: StudentFollowUp,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
