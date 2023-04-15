import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/account/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AccountSettings from "@/views/account/AccountSettings.vue";
import UserCreation from "@/views/account/UserCreation.vue";
import SchedulingScreenStudent from "@/views/student/SchedulingScreenStudents.vue";
import RoundFollowup from "@/views/round/RoundFollowup.vue";
import RoundMaker from "@/views/round/RoundMaker.vue";
import RoundDetail from "@/views/round/RoundDetail.vue";
import RoundPlanner from "@/views/round/RoundPlanner.vue";
import BuildingMaker from "@/views/building/BuildingMaker.vue";
import BuildingDetail from "@/views/building/BuildingDetail.vue";
import BuildingScreen from "@/views/building/BuildingScreen.vue";
import BuildingFollowup from "@/views/building/BuildingFollowup.vue";
import GarbageMaker from "@/views/building/GarbageMaker.vue";
import UserOverview from "@/views/dashboard/Users.vue";
import BuildingOverview from "@/views/dashboard/Buildings.vue";
import RoundOverview from "@/views/dashboard/Round.vue";
import Auth from "@/views/dev/Auth.vue";

const routes = [
  {
    path: "/",
    component: LoginScreen,
    name: "login",
  },
  {
    path: "/dev/auth",
    component: Auth,
    name: "auth",
  },
  {
    component: MainLayout,
    path: "/", // Unreachable, as intended.
    children: [
      {
        // TODO: isadmin should be removed when authentication is in order
        path: "/account/settings/:id/:isadmin",
        name: "account_settings",
        component: AccountSettings,
        props: true,
        meta: {
          title: "",
        },
      },
      {
        path: "/planning",
        name: "student_planning",
        component: SchedulingScreenStudent,
        meta: {
          title: "Planning student",
        },
      },
      {
        path: "/ronde/overzicht",
        name: "round_followup",
        component: RoundFollowup,
        meta: {
          title: "Opvolging rondes",
        },
      },
      {
        path: "/ronde/:id",
        name: "round_detail",
        component: RoundDetail,
        meta: {
          title: "",
        },
      },
      {
        path: "/ronde/plannen",
        name: "round_plan",
        component: RoundPlanner,
        meta: {
          title: "Ronde plannen",
        },
      },
      {
        path: "/ronde/nieuw",
        name: "round_new",
        component: RoundMaker,
        meta: {
          title: "Ronde maken",
        },
      },
      {
        path: "/gebouw/:id",
        name: "building_id",
        component: BuildingScreen,
        props: true,
        meta: {
          title: "",
        },
      },
      {
        path: "/gebouw/:id/:date",
        name: "building_id_detail",
        component: BuildingDetail,
        props: true,
      },
      {
        path: "/gebouw/nieuw",
        name: "building_new",
        component: BuildingMaker,
        meta: {
          title: "Nieuw gebouw",
        },
      },
      {
        path: "/gebouw/overzicht",
        name: "building_followup",
        component: BuildingFollowup,
        meta: {
          title: "Gebouwen",
        },
      },
      {
        path: "/gebouw/:id/afvalschema",
        name: "garbage_plan",
        component: GarbageMaker,
      },
      {
        path: "/account",
        component: UserOverview,
        name: "user_overview",
        meta: {
          title: "Gebruikers",
        },
      },
      {
        path: "/account/nieuw",
        name: "user_new",
        component: UserCreation,
        meta: {
          title: "Nieuwe gebruiker",
        },
      },
      {
        path: "/gebouw",
        component: BuildingOverview,
        name: "building_overview",
        meta: {
          title: "Gebouwen",
        },
      },
      {
        path: "/ronde",
        component: RoundOverview,
        name: "round_overview",
        meta: {
          title: "Rondes",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
