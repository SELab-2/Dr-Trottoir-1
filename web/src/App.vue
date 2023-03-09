<template>
  <v-app>
    <!-- Make the navbar only visible when logged in -->
    <v-app-bar v-if="auth.isLoggedin" prominent>

      <!-- Show navbar options depending on who's logged in -->
      <!-- There should be a way cleaner way to do this -->
      <div v-if="!auth.roles.syndicus">
        <v-btn
          v-for="route in auth.roles.superstudent ? superstudentroutes : studentroutes"
          :to="route.path"
        >
          {{ route.name }}
        </v-btn>
      </div>

      <div v-else>
        <v-btn v-for="route in syndicusroutes" :to="route.path">
          {{ route.name }}
        </v-btn>
      </div>

      <v-btn @click="logout" to="/login">Log uit</v-btn>
    </v-app-bar>

    <!-- Here will the page be displayed that's loaded in by the router -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//TODO: remove this import and replace it for propper authentication in finished product
import { auth } from "@/scripts/auth";
import { reactive } from "vue";

// Some default routes are defined here
// The /todo should be replaced by propper paths defined in router/index.ts
const studentroutes = reactive([{ name: "Rondes", path: "/todo" }]);

const superstudentroutes = reactive(
  studentroutes.concat([{ name: "Overzicht", path: "/todo" }])
);

const syndicusroutes = reactive([{ name: "Gebouwen", path: "/todo" }]);

// TODO: This is a temporary logging out function and should be replaced in the future
function logout() {
  auth.isLoggedin = false;
  auth.roles.superstudent = false;
  auth.roles.syndicus = false;
}
</script>
