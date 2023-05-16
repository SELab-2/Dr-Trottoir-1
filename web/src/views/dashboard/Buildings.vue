<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      v-if="useAuthStore().auth?.admin"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3 text-none"
      :to="{ name: 'building_new' }"
    >
      Nieuw Gebouw
    </v-btn>
  </div>
  <DashBoardSearch
    :admin="useAuthStore().auth?.admin"
    @changed="(a, b) => getBuildings(a, b)"
  />
  <Table
    :key="buildings.length"
    :entries="buildings"
    :headers="Building.headers()"
    :route="Building.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import DashBoardSearch from "@/components/filter/DashBoardSearch.vue";
import { useAuthStore } from "@/stores/auth";
import { Building } from "@/types/Building";
import { BuildingQuery, Result } from '@selab-2/groep-1-query'
import { tryOrAlertAsync } from "@/try";
import { ref, Ref } from "vue";

const buildings: Ref<Array<Result<BuildingQuery>>> = ref([]);
await getBuildings(false, "");

async function getBuildings(showDeleted: boolean, search: string) {
  buildings.value =
    (await tryOrAlertAsync<Array<Result<BuildingQuery>>>(async () => {
      const results = await new BuildingQuery().getAll({deleted: showDeleted});
      return results.filter((building) => building.name.toLowerCase().includes(search.toLowerCase()));
    })) ?? [];
}
</script>
