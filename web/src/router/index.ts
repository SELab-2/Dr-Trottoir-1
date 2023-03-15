import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import BuildingSceen from "@/views/BuildingScreen.vue";
import UserCreation from "@/views/UserCreation.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import Users from "@/views/dashboard/Users.vue";
import Buildings from "@/views/dashboard/Buildings.vue";
import Routes from "@/views/dashboard/Routes.vue";
import BuildingFollowup from "@/views/BuildingFollowup.vue";
import RoundFollowup from "@/views/RoundFollowup.vue";
import RoundMaker from "@/views/RoundMaker.vue";
import AccountSettings from "@/views/AccountSettings.vue";
import RoundPlanner from "@/views/RoundPlanner.vue";

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
        path: "/dashboard/gebruikers",
        component: Users,
        name: "Gebruikers",
      },
      {
        path: "/dashboard/gebouwen",
        component: Buildings,
        name: "Gebouwen",
      },
      {
        path: "/dashboard/routes",
        component: Routes,
        name: "Rondes",
      },
      {
        path: "/gebouw/:id",
        name: "Gebouw",
        component: BuildingSceen,
        props: true,
      },
      {
        path: "/gebouw",
        name: "Opvolgen van gebouwen",
        component: BuildingFollowup,
      },
      {
        path: "/rondes/opvolgen",
        name: "Opvolgen van rondes",
        component: RoundFollowup,
      },
      {
        path: "/ronde-maken",
        name: "Ronde aanmaken",
        component: RoundMaker,
      },
      {
        path: "/account/:gebruikerid/:isadmin",
        name: "Account instellingen",
        component: AccountSettings,
        props: true,
      },
      {
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker toevoegen",
        component: UserCreation,
      },
      {
        path: "/dashboard/round/planner",
        name: "Ronde Planner",
        component: RoundPlanner,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
