import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import UserCreation from "@/views/UserCreation.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import RoundFollowup from "@/views/RoundFollowup.vue";
import BuildingFollowup from "@/views/BuildingFollowup.vue";

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
        path: "/gebouwen",
        name: "Opvolgen van gebouwen",
        component: BuildingFollowup,
      },
      {
        path: "/opvolging-rondes",
        name: "Opvolgen van rondes",
        component: RoundFollowup,
      },
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker toevoegen",
        component: UserCreation,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
