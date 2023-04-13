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
import { useAuthStore, validAuth } from "@/stores/auth";

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
        path: "/account/settings/:id",
        name: "account_settings",
        component: AccountSettings,
        props: true,
        meta: {
          title: "",
          requiresAuth: true,
        },
      },
      {
        path: "/planning",
        name: "student_planning",
        component: SchedulingScreenStudent,
        meta: {
          title: "Planning student",
          requiresAuth: true,
        },
      },
      {
        path: "/ronde/overzicht",
        name: "round_followup",
        component: RoundFollowup,
        meta: {
          title: "Opvolging rondes",
          requiresAuth: true,
        },
      },
      {
        path: "/ronde/:id",
        name: "round_detail",
        component: RoundDetail,
        meta: {
          title: "",
          requiresAuth: true,
        },
      },
      {
        path: "/ronde/plannen",
        name: "round_plan",
        component: RoundPlanner,
        meta: {
          title: "Ronde plannen",
          requiresAuth: true,
        },
      },
      {
        path: "/ronde/nieuw",
        name: "round_new",
        component: RoundMaker,
        meta: {
          title: "Ronde maken",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw/:id",
        name: "building_id",
        component: BuildingScreen,
        props: true,
        meta: {
          title: "",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw/:id/:date",
        name: "building_id_detail",
        component: BuildingDetail,
        props: true,
        meta: {
          title: "",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw/nieuw",
        name: "building_new",
        component: BuildingMaker,
        meta: {
          title: "Nieuw gebouw",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw/overzicht",
        name: "building_followup",
        component: BuildingFollowup,
        meta: {
          title: "Opvolging gebouwen",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw/:id/afvalschema",
        name: "garbage_plan",
        component: GarbageMaker,
        meta: {
          title: "",
          requiresAuth: true,
        },
      },
      {
        path: "/account",
        component: UserOverview,
        name: "user_overview",
        meta: {
          title: "Gebruikers",
          requiresAuth: true,
        },
      },
      {
        path: "/account/nieuw",
        name: "user_new",
        component: UserCreation,
        meta: {
          title: "Nieuwe gebruiker",
          requiresAuth: true,
        },
      },
      {
        path: "/gebouw",
        component: BuildingOverview,
        name: "building_overview",
        meta: {
          title: "Gebouwen",
          requiresAuth: true,
        },
      },
      {
        path: "/ronde",
        component: RoundOverview,
        name: "round_overview",
        meta: {
          title: "Rondes",
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  await useAuthStore().getAuth();
  const auth = useAuthStore().auth;

  if (!validAuth(auth)) {
    if (requiresAuth) {
      next("/");
    } else {
      next();
    }
  } else {
    // TODO: check administrator, syndicus & superstudent pages
    next();
  }
});

export default router;
