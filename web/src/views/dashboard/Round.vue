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
import {
  Progress as OrmProgress,
  Schedule as OrmSchedule,
} from "@selab-2/groep-1-orm";
import { ProgressQuery, ScheduleQuery } from "@selab-2/groep-1-query";

const schedules: Schedule[] = await loadSchedules();
async function loadSchedules(): Promise<Schedule[]> {
  try {
    const schedulesOrErr: OrmSchedule[] = await new ScheduleQuery().getAll();
    let array: Schedule[] = [];
    for (let schedule of schedulesOrErr) {
      let s: Schedule = new Schedule(schedule as unknown as Schedule);
      s.day = new Date(schedule.day).toLocaleDateString("nl");
      // Every building in the round has to be finished for the whole round to be finished
      let progress: OrmProgress[] = await loadProgress(s.id);
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
  } catch (e) {
    alert("Kon rondes niet ophalen, probeer het later opnieuw.");
    return [];
  }
}
async function loadProgress(schedule_id: number): Promise<OrmProgress[]> {
  try {
    return await new ProgressQuery().getAll({
      schedule: schedule_id,
    });
  } catch (e) {
    alert("Kon rondevoortgang niet ophalen, probeer het later opnieuw.");
    return [];
  }
}
</script>
