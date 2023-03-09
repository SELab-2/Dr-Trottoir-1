<script lang="ts">
</script>

<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        permanent
        location="left"
      >
        <v-list density="compact" nav>
          <v-list-item
            lines="two"
            prepend-avatar="https://avatars.githubusercontent.com/u/38297449?v=4"
            title="Jens Pots"
            subtitle="Superstudent"
          ></v-list-item>
          <v-list-item prepend-icon="mdi-account-cancel" title="Afmelden" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Account" value="home"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <p class="pa-2 font-weight-medium text-caption">Overzicht</p>
          <v-list-item prepend-icon="mdi-calendar" title="Kalender" value="home"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <p class="pa-2 font-weight-medium text-caption">Opvolging</p>
          <v-list-item prepend-icon="mdi-calendar-edit" title="Planning" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-message-fast" title="Communicatie" value="home"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <p class="pa-2 font-weight-medium text-caption">Gebouwbeheer</p>
          <v-list-item prepend-icon="mdi-file-cabinet" title="Geschiedenis" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Instellingen" value="home"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <p class="pa-2 font-weight-medium text-caption">Administratie</p>
          <v-list-item prepend-icon="mdi-account-supervisor" title="Studenten" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-office-building-outline" title="Gebouwen" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-map-legend" title="Routes" value="account"></v-list-item>
        </v-list>

        <template v-slot:append>
          <p class="text-center text-caption pa-4">SELab 2 - Groep 1 (v0.0.1)</p>
        </template>
      </v-navigation-drawer>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style lang="sass" scoped>
</style>
