import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import Users from "@/views/dashboard/Users.vue";
import Buildings from "@/views/dashboard/Buildings.vue";
import Routes from "@/views/dashboard/Routes.vue";

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
        path: '/dashboard/gebruikers',
        component: Users,
        name: "Gebruikers",
      },
      {
        path: '/dashboard/gebouwen',
        component: Buildings,
        name: "Gebouwen",
      },
      {
        path: '/dashboard/routes',
        component: Routes,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
