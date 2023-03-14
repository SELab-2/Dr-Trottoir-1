import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import UserCreation from "@/views/UserCreation.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import RoundFollowup from "@/views/RoundFollowup.vue";
import RoundMaker from "@/views/RoundMaker.vue";
import AccountSettings from "@/views/AccountSettings.vue";
import RoundDetail from "@/views/RoundDetail.vue"

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
        path: "/rondes/opvolgen",
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
        path: "/dashboard/gebruikers/nieuw",
        name: "Nieuwe gebruiker toevoegen",
        component: UserCreation,
      },
      {
        path: "/rondes/detail",
        name: "Detail van ronde",
        component: RoundDetail,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
