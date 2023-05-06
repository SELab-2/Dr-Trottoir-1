<template>
  <HFillWrapper v-if="days !== undefined">
    <div v-for="day in days" :key="day.id">
      <v-card
        v-if="day.list.length > 0"
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
            {{ prettyDate(day.start) }}
          </v-chip>
        </template>
      </v-card>

      <BorderCard
        v-for="item in day.list"
        :key="item.schedule.id"
        class="mb-3 mx-1"
        :title="item.schedule.round.name"
        @click="
          setCurrentRound(item.schedule);
          goToRound();
        "
      >
        <template v-slot:subtitle>
          <div class="d-flex">
            <v-chip
              class="me-auto"
              label
              prepend-icon="mdi-clock-time-ten-outline"
              variant="text"
              size="compact"
            >
              {{ new Date(item.schedule.day).toISOString().slice(11, 16) }}
            </v-chip>
            <v-chip label color="primary" class="mr-2">
              <v-icon icon="mdi-office-building-outline" class="pr-1"></v-icon>
              {{ item.schedule.round.buildings.length }}
            </v-chip>

            <!-- Done status indicator -->
            <v-chip
              v-if="
                item.progress.length === item.schedule.round.buildings.length
              "
              label
              color="success"
            >
              <v-icon icon="mdi-check"></v-icon>
              Klaar
            </v-chip>

            <!-- In progress indicator -->
            <v-chip
              v-else-if="item.progress.length !== 0"
              label
              color="warning"
            >
              Bezig {{ item.progress.length }}/{{
                item.schedule.round.buildings.length
              }}
            </v-chip>
          </div>
        </template>

        <DividerLayout v-show="showStartButton(item)" />

        <div
          class="pa-4 d-flex align-center"
          v-if="true || showStartButton(item)"
        >
          <v-spacer />
          <v-btn
            class="text-none"
            prepend-icon="mdi-play"
            color="primary"
            v-on:click.stop="openPopup(item)"
          >
            Start ronde
          </v-btn>
        </div>
      </BorderCard>
    </div>

    <div class="centre text-center pa-5" v-if="empty">
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h3>Geen planning voor de komende 3 dagen.</h3>
      <p>Check bij je superstudent indien je denkt dat dit niet klopt.</p>
    </div>

    <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->

    <StartRoundPopupContent
      v-model="snackbar"
      :oncancel="() => (snackbar = false)"
      :onsubmit="
        async () => {
          await saveStartTime();
          goToRound();
        }
      "
    />
  </HFillWrapper>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import StartRoundPopupContent from "@/components/popups/StartRoundPopupContent.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ScheduleQuery, ProgressQuery, Result } from "@selab-2/groep-1-query";
import router from "@/router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { tryOrAlertAsync } from "@/try";

const snackbar = ref(false);
const current_round_id = ref(0);
const current_schedule_id = ref(0);
const current_progress_id = ref(0);

function goToRound() {
  router.push({
    name: "round_detail",
    params: { id: current_round_id.value, schedule: current_schedule_id.value },
  });
}

function setCurrentRound(schedule: Result<ScheduleQuery>) {
  current_round_id.value = schedule.round_id;
  current_schedule_id.value = schedule.id;
}

function openPopup(schedule: {
  schedule: Result<ScheduleQuery>;
  progress: Array<Result<ProgressQuery>>;
}) {
  current_progress_id.value = schedule.progress[0].id;
  setCurrentRound(schedule.schedule);
  snackbar.value = true;
}

function showStartButton(schedule: {
  schedule: Result<ScheduleQuery>;
  progress: Array<Result<ProgressQuery>>;
}): boolean {
  const today = new Date().getDate();
  const day = new Date(schedule.schedule.day).getDate();
  return today === day && schedule.progress.length === 0;
}

async function saveStartTime() {
  await tryOrAlertAsync(async () => {
    await new ProgressQuery().updateOne({
      id: current_progress_id.value,
      arrival: new Date(),
    });
  });
}

type DayEntry = {
  id: number;
  start: Date;
  end: Date;
  list: Array<{
    schedule: Result<ScheduleQuery>;
    progress: Array<Result<ProgressQuery>>;
  }>;
  name: string;
};

const empty = ref(true);

// TODO: cleanup this code
const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
const startOfTomorrow = new Date(
  new Date(startOfDay).setDate(startOfDay.getDate() + 1),
);
const startOfDayAfterTomorrow = new Date(
  new Date(startOfTomorrow).setDate(startOfTomorrow.getDate() + 1),
);
const endOfDayAfterTomorrow = new Date(
  new Date(startOfDayAfterTomorrow).setDate(
    startOfDayAfterTomorrow.getDate() + 1,
  ),
);

/**
 * Retrieve all the combinations of schedules and their progress from the server.
 */
const days = await tryOrAlertAsync<Array<DayEntry>>(async () => {
  const result: Array<DayEntry> = [
    {
      id: 0,
      start: startOfDay,
      end: startOfTomorrow,
      list: [],
      name: "Vandaag",
    },
    {
      id: 1,
      start: startOfTomorrow,
      end: startOfDayAfterTomorrow,
      list: [],
      name: "Morgen",
    },
    {
      id: 2,
      start: startOfDayAfterTomorrow,
      end: endOfDayAfterTomorrow,
      list: [],
      name: "Overmorgen",
    },
  ];

  for (const { start, end, list } of result) {
    const schedules: Array<Result<ScheduleQuery>> =
      await new ScheduleQuery().getAll({
        after: start,
        before: end,
        user_id: useAuthStore().auth?.id,
      });

    for (const scheduleItem of schedules) {
      const progress = await new ProgressQuery().getAll({
        schedule: scheduleItem.id,
      });

      if (schedules.length > 0) {
        empty.value = false;
      }

      list.push({
        schedule: scheduleItem,
        progress: progress,
      });
    }
  }

  return result;
});

function prettyDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("nl", { month: "long" });
  return new Date(date).getDate() + " " + formatter.format(date);
}
</script>
