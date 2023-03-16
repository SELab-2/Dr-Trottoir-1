<template>
  <router-link to="/dashboard/gebouwen/nieuw" class="d-flex flex-row-reverse">
    <v-btn prepend-icon="mdi-plus" color="primary"> Nieuw Gebouw </v-btn>
  </router-link>
  <Table
    v-bind:entries="Building.random()"
    v-bind:headers="Building.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";
</script>
