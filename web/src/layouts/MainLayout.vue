<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// reactive state to show the drawer or not
const drawer = ref(true)

// get the route object, needed to show the title
const route = useRoute();
</script>

<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        permanent
        v-model="drawer"
      >
        <v-list density="compact" nav>
          <v-list-item
            lines="two"
            prepend-avatar="https://avatars.githubusercontent.com/u/38297449?v=4"
            title="Jens Pots"
            subtitle="Superstudent"
          ></v-list-item>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-account-cancel" title="Afmelden" value="logout"></v-list-item>
          </router-link>

          <router-link to="/account">
            <v-list-item prepend-icon="mdi-cog" title="Account" value="account"></v-list-item>
          </router-link>

          <div class="py-2">
            <v-divider></v-divider>
          </div>

          <p class="pa-2 font-weight-medium text-caption">Overzicht</p>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-calendar" title="Kalender" value="calendar"></v-list-item>
          </router-link>

          <div class="py-2">
            <v-divider></v-divider>
          </div>

          <p class="pa-2 font-weight-medium text-caption">Opvolging</p>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-calendar-edit" title="Planning" value="schedule"></v-list-item>
          </router-link>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-message-fast" title="Communicatie" value="communication"></v-list-item>
          </router-link>

          <div class="py-2">
            <v-divider></v-divider>
          </div>

          <p class="pa-2 font-weight-medium text-caption">Gebouwbeheer</p>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-file-cabinet" title="Geschiedenis" value="history" />
          </router-link>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-cog" title="Instellingen" value="settings"></v-list-item>
          </router-link>

          <div class="py-2">
            <v-divider></v-divider>
          </div>

          <p class="pa-2 font-weight-medium text-caption">Administratie</p>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-account-supervisor" title="Studenten" value="students"></v-list-item>
          </router-link>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-office-building-outline" title="Gebouwen" value="buidlings"></v-list-item>
          </router-link>

          <router-link to="/dashboard">
            <v-list-item prepend-icon="mdi-map-legend" title="Routes" value="routes"></v-list-item>
          </router-link>
        </v-list>

        <template v-slot:append>
          <p class="text-center text-caption pa-4">SELab 2 - Groep 1 (v0.0.1)</p>
        </template>
      </v-navigation-drawer>

      <v-app-bar
        prominent
        elevation="0"
      >
        <div class="px-4">
          <v-app-bar-nav-icon variant="text" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </div>

        <v-toolbar-title class="font-weight-medium">{{ route.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>

        <v-btn variant="text" icon="mdi-filter"></v-btn>
      </v-app-bar>

      <div class="pa-8">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
