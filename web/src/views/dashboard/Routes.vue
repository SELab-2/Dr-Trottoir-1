<template>
  <router-link to="/dashboard/rondes/nieuw" class="d-flex flex-row-reverse">
    <v-btn prepend-icon="mdi-plus" color="primary" class="mr-3">
      Nieuwe Ronde
    </v-btn>
  </router-link>
  <Table
    v-bind:entries="Routes.random()"
    v-bind:headers="Routes.headers()"
    v-bind:sort="Routes.sort"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Routes } from "@/types/Routes";
</script>
