/* eslint-disable @typescript-eslint/no-unused-vars */
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
import BuildingScreen from "@/views/building/BuildingScreen.vue";
import BuildingFollowup from "@/views/building/BuildingFollowup.vue";
import GarbageMaker from "@/views/building/GarbageMaker.vue";
import UserOverview from "@/views/dashboard/Users.vue";
import BuildingOverview from "@/views/dashboard/Buildings.vue";
import RoundOverview from "@/views/dashboard/Round.vue";
import ContactSyndicus from "@/views/contact/ContactSyndicus.vue";
import Auth from "@/views/dev/Auth.vue";
import { useAuthStore } from "@/stores/auth";
import TryOrAlert from "@/views/dev/TryOrAlert.vue";
import Round from "@/views/round/Round.vue";

const routes: any[] = [
  {
    path: "/",
    component: LoginScreen,
    name: "login",
    meta: {
      auth: (
        student: boolean,
        superstudent: boolean,
        syndicus: boolean,
        admin: boolean,
      ) => true,
    },
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
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student || superstudent || syndicus || admin,
        },
      },
      {
        path: "/planning",
        name: "student_planning",
        component: SchedulingScreenStudent,
        meta: {
          title: "Planning student",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student,
        },
      },
      {
        path: "/ronde/overzicht",
        name: "round_followup",
        component: RoundFollowup,
        meta: {
          title: "Opvolging rondes",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/ronde/:id",
        name: "round",
        component: Round,
        meta: {
          title: "",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student || superstudent || admin,
        },
      },
      {
        path: "/ronde/:id/:schedule",
        name: "round_detail",
        component: RoundDetail,
        meta: {
          title: "",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student || superstudent || admin,
        },
      },
      {
        path: "/ronde/:id/plannen",
        name: "round_plan",
        component: RoundPlanner,
        meta: {
          title: "Ronde plannen",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/ronde/nieuw",
        name: "round_new",
        component: RoundMaker,
        meta: {
          title: "Ronde maken",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/gebouw/:id",
        name: "building_id",
        component: BuildingScreen,
        props: true,
        meta: {
          title: "",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student,
        },
      },
      {
        path: "/gebouw/nieuw",
        name: "building_new",
        component: BuildingMaker,
        meta: {
          title: "Nieuw gebouw",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/gebouw/overzicht",
        name: "building_followup",
        component: BuildingFollowup,
        meta: {
          title: "Opvolging gebouwen",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/contact",
        name: "contact_syndicus",
        component: ContactSyndicus,
        meta: {
          title: "",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
      {
        path: "/gebouw/:id/afvalschema",
        name: "garbage_plan",
        component: GarbageMaker,
        meta: {
          title: "",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => student || superstudent || syndicus || admin,
        },
      },
      {
        path: "/account",
        component: UserOverview,
        name: "user_overview",
        meta: {
          title: "Gebruikers",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => admin,
        },
      },
      {
        path: "/account/nieuw",
        name: "user_new",
        component: UserCreation,
        meta: {
          title: "Nieuwe gebruiker",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => admin,
        },
      },
      {
        path: "/gebouw",
        component: BuildingOverview,
        name: "building_overview",
        meta: {
          title: "Gebouwen",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => admin,
        },
      },
      {
        path: "/ronde",
        component: RoundOverview,
        name: "round_overview",
        meta: {
          title: "Rondes",
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin,
        },
      },
    ],
  },
];

const devRoutes: any[] = [
  {
    path: "/dev/auth",
    component: Auth,
    name: "auth",
    meta: {
      auth: (
        student: boolean,
        superstudent: boolean,
        syndicus: boolean,
        admin: boolean,
      ) => true,
    },
  },
  {
    path: "/dev/try",
    component: TryOrAlert,
    name: "try",
    meta: {
      auth: (
        student: boolean,
        superstudent: boolean,
        syndicus: boolean,
        admin: boolean,
      ) => true,
    },
  },
];

if (import.meta.env.MODE === "development") {
  routes.push(...devRoutes);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!useAuthStore().auth) {
    await useAuthStore().getAuth();
  }

  const checkAuth = to.meta.auth as (
    student: boolean,
    superstudent: boolean,
    syndicus: boolean,
    admin: boolean,
  ) => boolean;
  if (!checkAuth) {
    console.error("Route has no authentication function.");
  }

  const auth = useAuthStore().auth;

  if (!auth) {
    const checked: boolean = checkAuth(false, false, false, false);
    if (!checked) {
      next("/");
    } else {
      next();
    }
  } else {
    const isStudent = auth.student;
    const isSuperStudent = auth.super_student;
    const isSyndicus = true; // TODO
    const isAdmin = auth.admin;
    const checked: boolean = checkAuth(
      isStudent,
      isSuperStudent,
      isSyndicus,
      isAdmin,
    );
    if (!checked) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
