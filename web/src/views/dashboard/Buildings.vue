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
  <Table
    v-bind:entries="Building.random()"
    v-bind:headers="Building.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";

import { BuildingQuery } from "../../../../api_query/src/building";

process.env.API_SERVER_ADDRESS = "/"
process.env.VUE_APP_API_SERVER_ADDRESS = "/"

const usersOrErr: User[] | APIError = new BuildingQuery().getAll();

</script>
