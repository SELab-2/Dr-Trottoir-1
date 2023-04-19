<template>
  <HFillWrapper>
    <!-- Day cards-->
    <div v-for="day in days" :key="day.name">
      <v-card
        v-if="day.schedule.length > 0"
        :title="day.name"
        variant="flat"
        color="background"
      >
        <template v-slot:append>
          <v-chip
            label
            prepend-icon="mdi-calendar-month-outline"
            variant="text"
          >
            {{ day.day.getDate() }}
            {{ formatter.format(day.day) }}
          </v-chip>
        </template>
        <!-- Round cards -->
        <BorderCard
          v-for="schedule in day.schedule"
          :key="schedule.round.name"
          class="mb-3 mx-1"
          :title="schedule.round.name"
          prepend-icon="mdi-transit-detour"
          @click="
            current_id = schedule.round_id;
            redirect_to_detail();
          "
        >
          <!-- Time -->
          <template v-slot:subtitle>
            <v-chip
              label
              prepend-icon="mdi-clock-time-ten-outline"
              variant="text"
              size="compact"
            >
              {{ new Date(schedule.day).getHours() }}:{{
                ("0" + new Date(schedule.day).getUTCMinutes()).slice(-2)
              }}
            </v-chip>
          </template>

          <!-- Status -->
          <template v-slot:append>
            <v-btn
              v-if="schedule.progress === 0"
              color="primary"
              v-on:click.stop="
                snackbar = !snackbar;
                current_id = schedule.round_id;
              "
              :variant="day.day !== today ? 'flat' : 'elevated'"
              :disabled="day.day !== today"
            >
              Start ronde</v-btn
            >
            <v-chip
              v-else-if="schedule.progress === schedule.round.buildings.length"
              label
              color="success"
            >
              <v-icon icon="mdi-check"></v-icon>
              Klaar
            </v-chip>
            <v-chip v-else label color="warning">
              Bezig {{ schedule.progress }}/{{
                schedule.round.buildings.length
              }}
            </v-chip>
          </template>
        </BorderCard>
      </v-card>
    </div>
    <div class="centre text-center pa-5" v-if="emptySchedule()">
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h3>Geen planning voor de komende 3 dagen.</h3>
      <p>Check bij je superstudent indien je denkt dat dit niet klopt.</p>
    </div>

    <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
    <v-overlay v-model="snackbar">
      <v-snackbar
        v-model="snackbar"
        timeout="-1"
        elevation="24"
        color="background"
      >
        <StartRoundPopupContent
          :oncancel="() => (snackbar = false)"
          :onsubmit="() => redirect_to_detail()"
        />
      </v-snackbar>
    </v-overlay>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import StartRoundPopupContent from "@/components/popups/StartRoundPopupContent.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ScheduleQuery, ProgressQuery, Result } from "@selab-2/groep-1-query";
import { Building } from "@selab-2/groep-1-orm";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

// the router constant
const router = useRouter();

const snackbar = ref(false);
const current_id = ref(0);
function redirect_to_detail() {
  router.push({ name: "round_detail", params: { id: current_id.value } });
}

// https://stackoverflow.com/questions/1643320/get-month-name-from-date
const formatter = new Intl.DateTimeFormat("nl", { month: "long" });

async function calculateProgress(
  buildings: ({ building: Building } & any)[], //TODO typing not correct yet
  id: number,
  date: Date,
): Promise<number> {
  const progresses: Result<ProgressQuery>[] = await new ProgressQuery().getAll({
    user: useAuthStore().auth!.id,
    schedule: id,
    arrived_after: new Date(date.setHours(0, 0, 0, 0)),
    left_before: new Date(date.setHours(23, 59, 59, 999)),
  });
  let matched = 0;
  for (const building of buildings) {
    for (const progress of progresses) {
      if (progress.building_id == building.building.id) {
        matched += 1;
      }
    }
  }
  return matched;
}

type ProgressedSchedule = Result<ScheduleQuery> & { progress: number };

const today = new Date();
const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
const overmorrow = new Date(new Date().setDate(today.getDate() + 2));
const days: { name: string; day: Date; schedule: ProgressedSchedule[] }[] = [
  {
    name: "Vandaag",
    day: today,
    schedule: await loadSchedule(today),
  },
  {
    name: "Morgen",
    day: tomorrow,
    schedule: await loadSchedule(tomorrow),
  },
  {
    name: "Overmorgen",
    day: overmorrow,
    schedule: await loadSchedule(overmorrow),
  },
];

async function loadSchedule(day: Date): Promise<ProgressedSchedule[]> {
  const date = new Date(day);
  try {
    const schedules: ProgressedSchedule[] = (await new ScheduleQuery().getAll({
      user_id: useAuthStore().auth!.id,
      after: new Date(date.setHours(0, 0, 0, 0)),
      before: new Date(date.setHours(23, 59, 59, 999)),
    })) as ProgressedSchedule[];
    for (let schedule of schedules) {
      schedule.progress = await calculateProgress(
        schedule.round.buildings,
        schedule.id,
        date,
      );
    }
    return schedules;
  } catch (e) {
    // TODO: handle error messages
    alert(e);
  }

  return [];
}

function emptySchedule(): boolean {
  for (const day of days) {
    if (day.schedule.length > 0) {
      return false;
    }
  }
  return true;
}
</script>
