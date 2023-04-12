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
    v-bind:entries="schedules"
    v-bind:headers="Schedule.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Schedule } from "@/types/Schedule";
import { ScheduleQuery } from "../../../../api_query/src/schedule";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const schedules = ref<Schedule[]>(await loadSchedules());

async function loadSchedules(): Promise<Round[]> {
  const schedulesOrErr: Schedule[] | APIError = await new ScheduleQuery().getAll();
  // @ts-ignore
  if (schedulesOrErr.message == null) {
    let array = []
    for (let schedule of schedulesOrErr)
    {
      array.push(new Schedule(schedule));
    }
    return array;
  }
  return [];
}
</script>
