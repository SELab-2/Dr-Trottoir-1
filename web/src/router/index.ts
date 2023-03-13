import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "@/views/LoginScreen.vue";
import UserCreation from "@/views/UserCreation.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AccountSettings from "@/views/AccountSettings.vue";

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
        path: "/account/:gebruikerid/:isadmin",
        name: "Account instellingen",
        component: AccountSettings,
        props:true
      },
      {
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
