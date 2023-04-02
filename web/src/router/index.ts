import { createRouter, createWebHistory } from "vue-router";

// General Pages
import LoginScreen from "@/views/LoginScreen.vue";
import MainLayout from "@/layouts/MainLayout.vue";

// Account Pages
import AccountSettings from "@/views/AccountSettings.vue";
import UserCreation from "@/views/UserCreation.vue";

// Student Pages
import SchedulingScreenStudent from "@/views/SchedulingScreenStudents.vue";

// Round Pages
import RoundFollowup from "@/views/Followup.vue";
import RoundMaker from "@/views/RoundMaker.vue";
import RoundDetail from "@/views/RoundDetail.vue";
import RoundPlanner from "@/views/RoundPlanner.vue";

// Building Pages
import BuildingMaker from "@/views/BuildingMaker.vue";
import BuildingSceen from "@/views/BuildingScreen.vue";
import BuildingFollowup from "@/views/BuildingFollowup.vue";
import GarbageMaker from "@/views/GarbageMaker.vue";

// Dashboard Pages
import UserOverview from "@/views/dashboard/Users.vue";
import BuildingOverview from "@/views/dashboard/Buildings.vue";
import RoundOverview from "@/views/dashboard/Round.vue";

const routes = [
  // General
  {
    path: "/",
    component: LoginScreen,
    name: "login",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: MainLayout,
    children: [
      //Account
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

      // Student
      {
        path: "/planning",
        name: "student_planning",
        component: SchedulingScreenStudent,
        meta: {
          title: "Planning student",
        },
      },

      // Round
      {
        path: "/rondes",
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
        path: "ronde/nieuw",
        name: "round_new",
        component: RoundMaker,
        meta: {
          title: "Ronde maken",
        },
      },

      // Building
      {
        path: "/gebouw/:id",
        name: "building_id",
        component: BuildingSceen,
        props: true,
        meta: {
          title: "",
        },
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
        path: "/gebouwen",
        name: "building_followup",
        component: BuildingFollowup,
        meta: {
          title: "Gebouwen",
        },
      },
      {
        path: "/vuilnis/plannen",
        name: "garbage_plan",
        component: GarbageMaker,
      },

      // Routes for the dashboard
      {
        path: "gebruikers",
        component: UserOverview,
        name: "user_overview",
        meta: {
          title: "Gebruikers",
        },
      },
      {
        path: "gebouwen",
        component: BuildingOverview,
        name: "building_overview",
        meta: {
          title: "Gebouwen",
        },
      },
      {
        path: "rondes",
        component: RoundOverview,
        name: "round_overview",
        meta: {
          title: "Rondes",
        },
      },
      {
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker",
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
