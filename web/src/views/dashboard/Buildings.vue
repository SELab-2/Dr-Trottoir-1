<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      id="newbuilding"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'building_new' }"
    >
      Nieuw Gebouw
    </v-btn>
  </div>
  <Table
    id="#buildingtable"
    :entries="buildings"
    :headers="Building.headers()"
    :route="Building.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const buildings: Array<Result<BuildingQuery>> =
  (await tryOrAlertAsync<Array<Result<BuildingQuery>>>(async () => {
    return await new BuildingQuery().getAll({});
  })) ?? [];
</script>
