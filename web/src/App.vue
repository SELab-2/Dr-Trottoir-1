<template>
  <v-app>
    <v-main>
      <Suspense>
        <template #fallback>
          <Loader />
        </template>
        <!-- router view caches the component (Mainlayout) (no extra requests)
          TODO: check if this works with logout/login different user -->
        <router-view v-slot="{ Component }" :key="useAuthStore().auth?.id">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </Suspense>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Loader from "@/components/popups/Loader.vue";
import { useAuthStore } from "@/stores/auth";
</script>

<style lang="sass" scoped></style>
