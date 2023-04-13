<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'building_new' }"
    >
      Nieuw Gebouw
    </v-btn>
  </div>
  <!-- hier moet buildingsOrError komen -->
  <Table
    v-bind:entries="BuildingEntity.random()"
    v-bind:headers="BuildingEntity.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { BuildingEntity } from "@/types/BuildingEntity";
</script>
