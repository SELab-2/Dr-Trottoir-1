import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import BuildingSceen from "@/views/BuildingScreen.vue";
import UserCreation from "@/views/UserCreation.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import SchedulingScreenStudent from "@/views/SchedulingScreenStudents.vue";
import Users from "@/views/dashboard/Users.vue";
import Buildings from "@/views/dashboard/Buildings.vue";
import Routes from "@/views/dashboard/Routes.vue";
import BuildingFollowup from "@/views/BuildingFollowup.vue";
import RoundFollowup from "@/views/RoundFollowup.vue";
import RoundMaker from "@/views/RoundMaker.vue";
import AccountSettings from "@/views/AccountSettings.vue";
import RoundRaport from "@/views/RoundRaport.vue";

import BuildingMaker from "@/views/BuildingMaker.vue";

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
        path: "/planning",
        name: "Planningsoverzicht",
        component: SchedulingScreenStudent,
      },
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
        path: "/dashboard/rondes",
        component: Routes,
        name: "Rondes",
      },
      {
        path: "/gebouw/:id",
        name: "Gebouw",
        component: BuildingSceen,
        props: true,
      },
      //{
      //  path: "/ronde/:id",
      //  name: "Ronde",
      //  component: TODO detailpagina ronde,
      //  props: true,
      //},
      {
        path: "/gebouwen",
        name: "Opvolgen van gebouwen",
        component: BuildingFollowup,
      },
      {
        path: "/rondes",
        name: "Opvolgen van rondes",
        component: RoundFollowup,
      },
      {
        path: "/rondes/maken",
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
        path: "/dashboard/rondes/nieuw",
        name: "Nieuwe ronde",
        component: RoundMaker,
      },
      //{
      //  path: "/dashboard/gebouwen/nieuw",
      //  name: "Nieuw gebouw",
      //  component: TODO creatiepagina gebouw,
      //},
      {
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker",
        component: UserCreation,
      },
      {
        path: "/dashboard/ronde/raport",
        name: "Ronde Raport",
        component: RoundRaport,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
