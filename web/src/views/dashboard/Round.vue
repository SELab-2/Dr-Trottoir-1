<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      id="newround"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3 text-none"
      :to="{ name: 'round_new' }"
    >
      Nieuwe ronde maken
    </v-btn>
  </div>
  <Table
    id="roundtable"
    :entries="rounds"
    :headers="RoundTable.headers()"
    :route="RoundTable.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Result, RoundQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { RoundTable } from "@/types/Schedule";

const rounds: Array<Result<RoundQuery>> =
  (await tryOrAlertAsync<Array<Result<RoundQuery>>>(async () => {
    return await new RoundQuery().getAll({});
  })) ?? [];
</script>
