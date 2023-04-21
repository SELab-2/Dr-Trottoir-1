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

        <BorderCard
          v-for="item in day.list"
          :key="item.schedule.id"
          class="mb-3 mx-1"
          :title="item.schedule.round.name"
          prepend-icon="mdi-transit-detour"
          @click="
            current_id = item.schedule.round_id;
            router.push({
              name: 'round_detail',
              params: { id: current_id, schedule: item.schedule.id },
            });
          "
        >
          <template v-slot:subtitle>
            <v-chip
              label
              prepend-icon="mdi-clock-time-ten-outline"
              variant="text"
              size="compact"
            >
              {{ new Date(item.schedule.day).toISOString().slice(11, 16) }}
            </v-chip>
          </template>

          <template v-slot:append>
            <v-btn
              v-if="item.progress.length === 0"
              color="primary"
              v-on:click.stop="
                snackbar = !snackbar;
                current_id = item.schedule.round_id;
              "
              :variant="
                new Date(item.schedule.day).getDate() !== new Date().getDate()
                  ? 'flat'
                  : 'elevated'
              "
              :disabled="
                new Date(item.schedule.day).getDate() !== new Date().getDate()
              "
            >
              Start ronde</v-btn
            >
            <v-chip
              v-else-if="
                item.progress.length === item.schedule.round.buildings.length
              "
              label
              color="success"
            >
              <v-icon icon="mdi-check"></v-icon>
              Klaar
            </v-chip>
            <v-chip v-else label color="warning">
              Bezig {{ item.progress.length }}/{{
                item.schedule.round.buildings.length
              }}
            </v-chip>
          </template>
        </BorderCard>
      </v-card>
    </div>

    <div class="centre text-center pa-5" v-if="empty">
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
          :onsubmit="
            () =>
              router.push({
                name: 'round_detail',
                params: { id: current_id, schedule: 0 },
              })
          "
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
import router from "@/router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { tryOrAlertAsync } from "@/try";

const snackbar = ref(false);
const current_id = ref(0);

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

      if (progress.length > 0) {
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
