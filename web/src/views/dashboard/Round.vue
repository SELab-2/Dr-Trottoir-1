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
  {{ rounds[0] }}
  <Table
    v-bind:entries="Round.random()"
    v-bind:headers="Round.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Round } from "@/types/Round.js";
import { RoundQuery } from "../../../../api_query/src/round";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const rounds = ref<Round[]>(await loadRounds());

async function loadRounds(): Promise<Round[]> {
  const roundsOrErr: Round[] | APIError = await new RoundQuery().getAll();
  // @ts-ignore
  if (roundsOrErr.message == null) {
    let array = []
    for (let round of roundsOrErr)
    {
      array.push(new Round(round));
    }
    return array;
  }
  return [];
}
</script>
