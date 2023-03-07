<template>
  <v-app>
    <v-app-bar v-if="auth.isLoggedin" prominent>
      <v-btn>Test 1</v-btn>

      <v-btn>Test 2</v-btn>

    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>

//TODO: remove this import and replace it for propper authentication in finished product
import { auth } from '@/scripts/auth'

</script>