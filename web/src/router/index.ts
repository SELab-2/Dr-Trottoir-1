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
import RoundFollowup from "@/views/Followup.vue";
import RoundMaker from "@/views/RoundMaker.vue";
import AccountSettings from "@/views/AccountSettings.vue";
import RoundDetail from "@/views/RoundDetail.vue";
import RoundPlanner from "@/views/RoundPlanner.vue";
import BuildingMaker from "@/views/BuildingMaker.vue";
import GarbageMaker from "@/views/GarbageMaker.vue";

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
      {
        path: "/dashboard/gebouwen/nieuw",
        name: "Gebouw aanmaken",
        component: BuildingMaker,
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
        path: "/opvolging",
        name: "Opvolging",
        component: RoundFollowup,
      },
      {
        path: "/rondes/plannen",
        name: "Ronde plannen",
        component: RoundPlanner,
      },
      {
        path: "/account/:gebruikerid/:isadmin",
        name: "Account instellingen",
        component: AccountSettings,
        props: true,
      },
      {
        path: "/rondes/nieuw",
        name: "Nieuwe ronde",
        component: RoundMaker,
      },
      {
        path: "/dashboard/gebouwen/nieuw",
        name: "Nieuw gebouw",
        component: BuildingMaker,
      },
      {
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker",
        component: UserCreation,
      },
      {
        path: "/rondes/detail",
        name: "Detail van ronde",
        component: RoundDetail,
        props: true,
      },
      {
        path: "/dashboard/rondes/plannen",
        name: "Ronde Planner",
        component: RoundPlanner,
      },
      {
        path: "/dashboard/garbage",
        name: "Garbage",
        component: GarbageMaker,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
