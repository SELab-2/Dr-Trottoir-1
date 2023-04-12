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
  <Table v-bind:entries="schedules" v-bind:headers="Schedule.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Schedule } from "@/types/Schedule";
import { ScheduleQuery } from "../../../../api_query/src/schedule";
import { ProgressQuery } from "../../../../api_query/src/progress";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const schedules = ref<Schedule[]>(await loadSchedules());

async function loadSchedules(): Promise<Schedule[]> {
  const schedulesOrErr: Schedule[] | APIError =
    await new ScheduleQuery().getAll();
  if (schedulesOrErr.message == null) {
    let array = [];
    for (let schedule of schedulesOrErr) {
      let s: Schedule = new Schedule(schedule);
      // Every building in the round has to be finished for the whole round to be finished
      let progress: [] = await loadProgress(s.id);
      s.progress = progress;
      if (progress.length < s.round.buildings.length) {
        // not all buildings have been visited
        s.finished = false;
      } else {
        s.finished = true;
        for (let p of progress) {
          if (!p.departure) {
            // building is being visited, but has not been finished yet
            s.finished = false;
            break;
          }
        }
      }
      array.push(s);
    }
    return array;
  }
  return [];
}

async function loadProgress(schedule: number): Promise<[]> {
  const progressOrErr: [] | APIError = await new ProgressQuery().getAll({
    schedule: schedule,
  });
  if (progressOrErr.message == null) {
    let array = [];
    for (let progress of progressOrErr) {
      array.push(progress);
    }
    return array;
  }
  return [];
}
</script>
