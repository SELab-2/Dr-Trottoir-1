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
  <Table v-bind:entries="buildings" v-bind:headers="Building.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";
import { BuildingQuery } from "../../../../api_query/src/building";
import { ref } from "vue";

const buildings = ref<Building[]>(await loadBuildings());

async function loadBuildings(): Promise<Building[]> {
  try {
    const buildingsOrErr: Building[] = await new BuildingQuery().getAll();
    let array = [];
    for (let building of buildingsOrErr) {
      array.push(new Building(building));
    }
    return array;
  } catch (e) {
    return [];
  }
}
</script>
