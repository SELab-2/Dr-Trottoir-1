<template>
  <v-app>
    <v-main>
      <v-navigation-drawer permanent v-model="drawer">
        <v-list density="compact" nav>
          <v-list-item
            lines="two"
            prepend-avatar="https://avatars.githubusercontent.com/u/38297449?v=4"
            title="Jens Pots"
            subtitle="Superstudent"
            @click='showAccount = !showAccount'
          />

          <div v-if='showAccount'>
            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-account-cancel"
                title="Afmelden"
                value="logout"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-cog"
                title="Account"
                value="account"
              />
            </router-link>
          </div>

          <div class="py-2">
            <v-divider/>
          </div>

          <div v-if='isStudent'>
            <p class="pa-2 font-weight-medium text-caption">Overzicht</p>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-calendar-edit"
                title="Planning"
                value="schedule"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-calendar"
                title="Kalender"
                value="calendar"
              />
            </router-link>

            <div class="py-2">
              <v-divider/>
            </div>
          </div>

          <div v-if='isSuperStudent'>
            <p class="pa-2 font-weight-medium text-caption">Opvolging</p>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-account-school"
                title="Studenten"
                value="studenten"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-transit-detour"
                title="Rondes"
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

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-message-fast"
                title="Communicatie"
                value="communication"
              />
            </router-link>

            <div class="py-2">
              <v-divider/>
            </div>
          </div>

          <div v-if='isSyndicus'>
            <p class="pa-2 font-weight-medium text-caption">Gebouwbeheer</p>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-file-cabinet"
                title="Geschiedenis"
                value="history"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-cog"
                title="Instellingen"
                value="settings"
              />
            </router-link>

            <div class="py-2">
              <v-divider/>
            </div>
          </div>

          <div v-if='isAdmin'>
            <p class="pa-2 font-weight-medium text-caption">Administratie</p>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-account-supervisor"
                title="Studenten"
                value="students"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-office-building-outline"
                title="Gebouwen"
                value="buidlings"
              />
            </router-link>

            <router-link to="/dashboard">
              <v-list-item
                prepend-icon="mdi-map-legend"
                title="Routes"
                value="routes"
              />
            </router-link>

            <router-link to="/dashboard/gebruikers/nieuw">
              <v-list-item
                prepend-icon="mdi-account-plus"
                title="Maak account aan"
                value="routes"
              />
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
          <v-app-bar-nav-icon
            variant="text"
            @click="drawer = !drawer"
          />
        </div>

        <v-toolbar-title class="font-weight-medium">
          {{ route.name }}
        </v-toolbar-title>

        <v-spacer/>

        <v-btn variant="text" icon="mdi-magnify"/>

      </v-app-bar>

      <div class="pa-8">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
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

//show account settings
const showAccount = ref(false);
</script>

<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
