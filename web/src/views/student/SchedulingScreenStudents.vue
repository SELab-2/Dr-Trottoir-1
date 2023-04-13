<template>
  <HFillWrapper>
    <!-- Day cards-->
    <div
      v-for="day in days"
      :key="day.name"
    >
      <v-card
        v-if='day.schedule.length > 0'
        :title="day.name"
        variant="flat"
        color="background"
      >
        <template v-slot:append>
          <v-chip label prepend-icon="mdi-calendar-month-outline" variant="text">
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
          @click="redirect_to_detail()"
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
              v-if="
                calculateProgress(schedule.round.buildings) === 0
              "
              color="primary"
              v-on:click.stop="snackbar = !snackbar"
              :variant="
                day.day != today
                  ? 'flat'
                  : 'elevated'
              "
              :disabled="day.day != today"
            >
              Start ronde</v-btn
            >
            <v-chip
              v-else-if="
                calculateProgress(round.buildings) === 100
              "
              label
              color="success"
            >
              <v-icon icon="mdi-check"></v-icon>
              Klaar
            </v-chip>
            <v-chip v-else label color="warning">
              Bezig {{ 0 }}/{{ schedule.round.buildings.length }}
            </v-chip>
          </template>
        </BorderCard>
      </v-card>
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
import { ScheduleQuery } from "@selab-2/groep-1-query/dist/schedule";
import { Schedule } from "@selab-2/groep-1-orm";
import { Round } from "@selab-2/groep-1-orm";
import { Building } from "@selab-2/groep-1-orm";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { useRouter } from "vue-router";
import { ref } from "vue";

// the router constant
const router = useRouter();

function redirect_to_detail() {
  router.push({ name: "round_detail", params: { id: 0 } });
}

// https://stackoverflow.com/questions/1643320/get-month-name-from-date
const formatter = new Intl.DateTimeFormat("nl", { month: "long" });

const snackbar = ref(false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const calculateProgress = (buildings) => {
  return 0; // TODO: calculate the amount of buildings done
};

// TODO change (used for testing)
const today = new Date("2023-04-01T18:47:29.939Z");
const tomorrow = new Date("2023-04-02T18:47:29.939Z");
const overmorrow = new Date("2023-04-01T18:47:29.939Z");
/**
const today = new Date();
const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
const overmorrow = new Date(new Date().setDate(today.getDate() + 2));
 **/
const days: {name: string, day: Date, schedule: Schedule[]} = [
  {
    name: "Vandaag",
    day: today,
    schedule: await loadSchedule(today)
  },
  {
    name: "Morgen",
    day: tomorrow,
    schedule: await loadSchedule(tomorrow)
  },
  {
    name: "Overmorgen",
    day: overmorrow,
    schedule: await loadSchedule(overmorrow)
  },
]
console.log(days);

async function loadSchedule(day: Date): Promise<(Schedule & {round: Round & {buildings: Building[]}})[]> {
  const date = new Date(day);
  const shedulesOrError: Schedule[] | APIError = await new ScheduleQuery().getAll({
    user_id: 58, // TODO change (used for testing)
    after: new Date(date.setHours(0,0,0,0)),
    before: new Date(date.setHours(23,59,59,999))
  });
  // @ts-ignore
  if (shedulesOrError.message == null) {
    return shedulesOrError;
  }
  // TODO: handle error messages
  return [];
}
</script>
