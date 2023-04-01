<template>
  <router-link to="/dashboard/gebruikers/nieuw" class="d-flex flex-row-reverse">
    <v-btn prepend-icon="mdi-plus" color="primary" class="mr-3">
      Nieuwe Gebruiker
    </v-btn>
  </router-link>
  <Table 
    v-bind:entries="User.random()" 
    v-bind:headers="User.headers()"
    v-bind:sort="User.sort"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { User } from "@/types/User";
</script>
