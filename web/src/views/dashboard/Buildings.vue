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
import { Building as OrmBuilding } from "@selab-2/groep-1-orm";
import { BuildingQuery } from "@selab-2/groep-1-query";
const buildings: Building[] = await loadBuildings();
async function loadBuildings(): Promise<Building[]> {
  try {
    const buildingsOrErr: OrmBuilding[] = await new BuildingQuery().getAll();
    let array: Building[] = [];
    for (let building of buildingsOrErr) {
      array.push(new Building(building));
    }
    return array;
  } catch (e) {
    alert("Kon gebouwen niet ophalen, probeer het later opnieuw.");
    return [];
  }
}
</script>
