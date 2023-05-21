<template>
  <div class="d-flex flex-row-reverse toprow">
    <SimpleButton
      id="newround"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'round_new' }"
    >
      Nieuwe ronde maken
    </SimpleButton>
  </div>
  <DashBoardSearch :admin="false" @changed="(_, b) => getRounds(b)" />
  <Table
    id="roundtable"
    :key="rounds.length"
    :entries="rounds"
    :headers="RoundTable.headers()"
    :route="RoundTable.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import DashBoardSearch from "@/components/filter/DashBoardSearch.vue";
import { Result, RoundQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { RoundTable } from "@/types/Schedule";
import { ref, Ref } from "vue";
import SimpleButton from "@/components/buttons/SimpleButton.vue";

const rounds: Ref<Array<Result<RoundQuery>>> = ref([]);
await getRounds("");

async function getRounds(search: string) {
  rounds.value =
    (await tryOrAlertAsync<Array<Result<RoundQuery>>>(async () => {
      const results = await new RoundQuery().getAll({});
      return results.filter((round) =>
        round.name.toLowerCase().includes(search.toLowerCase()),
      );
    })) ?? [];
}
</script>

<style scoped lang="scss">
.toprow {
  z-index: 1000;
  position: fixed;
  top: 14px;
  right: 4px;
}
</style>
