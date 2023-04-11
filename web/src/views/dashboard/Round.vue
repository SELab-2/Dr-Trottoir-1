<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'round_new' }"
    >
      Nieuwe ronde maken
    </v-btn>
    <v-btn
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'round_plan' }"
    >
      Nieuwe ronde Plannen
    </v-btn>
  </div>
  <Table
    v-bind:entries="Routes.random()"
    v-bind:headers="Routes.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Routes } from "@/types/Round.js";

import { RoundQuery } from "../../../../api_query/src/round";

process.env.API_SERVER_ADDRESS = "/"
process.env.VUE_APP_API_SERVER_ADDRESS = "/"

const usersOrErr: User[] | APIError = new RoundQuery().getAll();
</script>
