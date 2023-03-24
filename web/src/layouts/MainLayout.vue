<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        :temporary="!permanentDrawer"
        :permanent="!!permanentDrawer"
        v-model="drawer"
        class='sidebar'
      >
        <v-list density="compact" nav>
          <v-list-item lines="two" @click="showAccount = !showAccount">
            <template v-slot:prepend>
              <Avatar :name="studentName" />
            </template>
            <div class="flex">
              <div class="text">
                <v-list-item-title>{{ studentName }}</v-list-item-title>
                <v-list-item-subtitle>{{ roles() }}</v-list-item-subtitle>
              </div>
              <v-btn
                v-if="!showAccount"
                variant="plain"
                icon="mdi-chevron-down"
                size="small"
              />
              <v-btn
                v-else
                variant="plain"
                icon="mdi-chevron-up"
                size="small"
              />
            </div>
          </v-list-item>

          <div v-if="showAccount">
            <router-link to="/">
              <v-list-item
                prepend-icon="mdi-account-cancel"
                title="Afmelden"
                value="logout"
              />
            </router-link>

            <router-link to="/account/0/true">
              <v-list-item
                prepend-icon="mdi-cog"
                title="Account"
                value="account"
              />
            </router-link>
          </div>

          <div class="py-2">
            <v-divider />
          </div>

          <div v-if="isStudent">
            <p class="pa-2 font-weight-medium text-caption">Overzicht</p>

            <router-link to="/planning">
              <v-list-item
                prepend-icon="mdi-calendar-edit"
                title="Planning"
                value="schedule"
              />
            </router-link>

            <div class="py-2">
              <v-divider />
            </div>
          </div>

          <div v-if="isSuperStudent">
            <p class="pa-2 font-weight-medium text-caption">Opvolging</p>

            <router-link to="/opvolging">
              <v-list-item
                prepend-icon="mdi-transit-detour"
                title="Opvolging"
                value="rondes"
              />
            </router-link>

            <router-link to="/gebouwen">
              <v-list-item
                prepend-icon="mdi-domain"
                title="Gebouwen"
                value="gebouwen"
              />
            </router-link>

            <div class="py-2">
              <v-divider />
            </div>
          </div>

          <div v-if="isSyndicus">
            <p class="pa-2 font-weight-medium text-caption">Gebouwbeheer</p>

            <router-link to="/gebouwen">
              <v-list-item
                prepend-icon="mdi-file-cabinet"
                title="Mijn Gebouwen"
                value="gebouwen"
              />
            </router-link>

            <div class="py-2">
              <v-divider />
            </div>
          </div>

          <div v-if="isAdmin">
            <p class="pa-2 font-weight-medium text-caption">Administratie</p>

            <router-link to="/dashboard/gebruikers">
              <v-list-item
                prepend-icon="mdi-account-supervisor"
                title="Gebruikers"
                value="users"
              ></v-list-item>
            </router-link>

            <router-link to="/dashboard/gebouwen">
              <v-list-item
                prepend-icon="mdi-office-building-outline"
                title="Gebouwen"
                value="buildings"
              ></v-list-item>
            </router-link>

            <router-link to="/dashboard/rondes">
              <v-list-item
                prepend-icon="mdi-map-legend"
                title="Routes"
                value="routes"
              ></v-list-item>
            </router-link>
          </div>
        </v-list>

        <template v-slot:append>
          <p class="text-center text-caption pa-4">
            SELab 2 - Groep 1 (v0.0.1)
          </p>
        </template>
      </v-navigation-drawer>

      <v-app-bar prominent elevation="0">
        <div class="px-4">
          <v-app-bar-nav-icon variant="text" @click="drawer = !drawer" />
        </div>

        <v-toolbar-title class="font-weight-medium">
          {{ route.name }}
        </v-toolbar-title>

        <v-spacer />
      </v-app-bar>

      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";

import { ref } from "vue";
import { useRoute } from "vue-router";

// reactive state to show the drawer or not
const drawer = ref(true);

// get the route object, needed to show the title
const route = useRoute();

// roles to know what to show
const isStudent = ref(true);
const isSuperStudent = ref(true);
const isSyndicus = ref(true);
const isAdmin = ref(true);

// show account settings
const showAccount = ref(false);

// account display settings
const studentName: string = "Jens Pots";
function roles(): string {
  let str = "";
  if (isStudent.value) {
    str += "student ";
  }
  if (isSuperStudent.value) {
    str += "superstudent ";
  }
  if (isSyndicus.value) {
    str += "syndicus ";
  }
  if (isAdmin.value) {
    str += "admin ";
  }
  return str;
}

const threasholdWidth: Number = 750;
// permanentdrawer
const permanentDrawer = ref<Boolean>(window.innerWidth > threasholdWidth);
function onResize() {
  permanentDrawer.value = window.innerWidth > threasholdWidth;
}
window.addEventListener("resize", onResize);

</script>

<style lang="scss">
a {
  text-decoration: none;
  color: black;
}

.text {
  width: 80%;
}

.flex {
  display: flex;
}

.sidebar{
  position: fixed !important;
  height: 100vh !important;
}
</style>
