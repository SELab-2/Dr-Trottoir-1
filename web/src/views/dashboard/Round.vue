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
import { ProgressQuery } from "../../../../api_query/src/progress";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const schedules = ref<Schedule[]>(await loadSchedules());

async function loadSchedules(): Promise<Round[]> {
  const schedulesOrErr: Schedule[] | APIError = await new ScheduleQuery().getAll();
  // @ts-ignore
  if (schedulesOrErr.message == null) {
    let array = []
    for (let schedule of schedulesOrErr) {
      let s: Schedule = new Schedule(schedule);
      let progress:Progress[]  = await loadProgress(s.id);
      let schedule_done: boolean = true;
      for (let p of progress) {
        if (!p.departure) {
          schedule_done = false;
          break;
        }
      }
      s.finished = schedule_done;
      array.push(s);
    }
    return array;
  }
  return [];
}

async function loadProgress(schedule: number): Promise<Progress> {
  const progressOrErr: Progress[] | APIError = await new ProgressQuery().getAll(
    {
      schedule: schedule,
    });
  // @ts-ignore
  if (progressOrErr.message == null) {
    let array = [];
    for (let progress of progressOrErr)
    {
      array.push(progress);
    }
    return array;
  }
  return [];
}
</script>
