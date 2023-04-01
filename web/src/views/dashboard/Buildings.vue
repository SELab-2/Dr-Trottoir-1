<template>
  <router-link to="/dashboard/gebouwen/nieuw" class="d-flex flex-row-reverse">
    <v-btn prepend-icon="mdi-plus" color="primary" class="mr-3">
      Nieuw Gebouw
    </v-btn>
  </router-link>
  <Table
    v-bind:entries="Building.random()"
    v-bind:headers="Building.headers()"
    v-bind:sort="Building.sort()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";
</script>
