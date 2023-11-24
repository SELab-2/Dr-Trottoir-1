<template>
  <HFillWrapper v-if="days !== undefined">
    <div class="d-flex">
      <SimpleButton class="ma-1" variant="outlined" @click="previousWeek()">
        <v-icon icon="mdi-menu-left" />
        <div v-if="!mobile">Vorige week</div>
      </SimpleButton>
      <v-spacer />
      <h4 class="mt-4">
        {{ mondayOfTheWeek.toLocaleDateString() }} tot
        {{
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 6),
          ).toLocaleDateString()
        }}
      </h4>
      <v-spacer />
      <SimpleButton class="ma-1" variant="outlined" @click="nextWeek()">
        <div v-if="!mobile">Volgende week</div>
        <v-icon icon="mdi-menu-right" />
      </SimpleButton>
    </div>

    <div v-if="!empty">
      <div v-for="day in days" :key="day.start.toLocaleDateString()">
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
          id="round"
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
              <!-- Display the hour -->
              <v-chip
                class="me-auto"
                label
                prepend-icon="mdi-clock-time-ten-outline"
                variant="text"
                size="compact"
              >
                {{
                  new Date(item.schedule.day).toLocaleTimeString().slice(0, 5)
                }}
              </v-chip>
              <v-chip label color="primary" class="mr-2">
                <v-icon
                  icon="mdi-office-building-outline"
                  class="pr-1"
                ></v-icon>
                {{ item.schedule.round.buildings.length }}
              </v-chip>

              <!-- Done status indicator -->
              <v-chip
                v-if="
                  getCompletedBuildings(item.progress) === item.progress.length
                "
                label
                color="success"
              >
                <v-icon icon="mdi-check"></v-icon>
                Klaar
              </v-chip>

              <!-- In progress indicator -->
              <v-chip
                v-else-if="roundStarted(item.progress)"
                label
                color="warning"
              >
                Bezig {{ getCompletedBuildings(item.progress) }}/{{
                  item.progress.length
                }}
              </v-chip>
            </div>
          </template>

          <DividerLayout v-show="showStartButton(item)" />

          <div class="pa-4 d-flex align-center" v-if="showStartButton(item)">
            <v-spacer />
            <SimpleButton
              prepend-icon="mdi-play"
              color="primary"
              v-on:click.stop="openPopup(item)"
            >
              Start ronde
            </SimpleButton>
          </div>
        </BorderCard>
      </div>
    </div>

    <div class="centre text-center pa-5" v-else>
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h3>Geen planning voor de gevraagde week.</h3>
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
import { useDisplay } from "vuetify";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { tryOrAlertAsync } from "@/try";
import {
  getCompletedBuildings,
  roundStarted,
} from "@/assets/scripts/roundProgress";
import SimpleButton from "@/components/buttons/SimpleButton.vue";

const snackbar = ref(false);
const current_round_id = ref(0);
const current_schedule_id = ref(0);
const current_progress_id = ref(0);

const display = useDisplay();
const mobile = display.mobile;

/**
 * Use the vue router to navigate to the round set by `setCurrentRound`.
 */
function goToRound() {
  router.push({
    name: "round_detail",
    params: { id: current_round_id.value, schedule: current_schedule_id.value },
  });
}

/**
 * Save the id of a round and it's schedule to a temp value
 * @param schedule
 */
function setCurrentRound(schedule: Result<ScheduleQuery>) {
  current_round_id.value = schedule.round_id;
  current_schedule_id.value = schedule.id;
}

/**
 * Function to open te popup, and save the round details for the popup to be used
 * @param schedule
 */
function openPopup(schedule: {
  schedule: Result<ScheduleQuery>;
  progress: Array<Result<ProgressQuery>>;
}) {
  current_progress_id.value = schedule.progress[0].id;
  setCurrentRound(schedule.schedule);
  snackbar.value = true;
}

/**
 * Return whether the start round button should be displayed
 * @param schedule
 */
function showStartButton(schedule: {
  schedule: Result<ScheduleQuery>;
  progress: Array<Result<ProgressQuery>>;
}): boolean {
  const today = new Date().getDate();
  const day = new Date(schedule.schedule.day).getDate();
  return today === day && !roundStarted(schedule.progress);
}

async function saveStartTime() {
  await tryOrAlertAsync(async () => {
    await new ScheduleQuery().updateOne({
      id: current_schedule_id.value,
      start: new Date(),
    });

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

async function previousWeek() {
  mondayOfTheWeek.value = new Date(
    mondayOfTheWeek.value.setDate(mondayOfTheWeek.value.getDate() - 7),
  );
  days.value = await getDays(mondayOfTheWeek.value);
}

async function nextWeek() {
  mondayOfTheWeek.value = new Date(
    mondayOfTheWeek.value.setDate(mondayOfTheWeek.value.getDate() + 7),
  );
  days.value = await getDays(mondayOfTheWeek.value);
}

function getStartOfDay(day: Date) {
  return new Date(day.setHours(0, 0, 0, 0));
}

function getEndOfDay(day: Date) {
  return new Date(
    new Date(day.setHours(0, 0, 0, 0)).setDate(day.getDate() + 1),
  );
}

async function getDays(mondayOfTheWeek: Date) {
  return await tryOrAlertAsync<Array<DayEntry>>(async () => {
    empty.value = true;
    const result: Array<DayEntry> = [
      {
        id: 0,
        start: getStartOfDay(mondayOfTheWeek),
        end: getEndOfDay(mondayOfTheWeek),
        list: [],
        name: "Maandag",
      },
      {
        id: 1,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 1),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 1),
          ),
        ),
        list: [],
        name: "Dinsdag",
      },
      {
        id: 2,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 2),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 2),
          ),
        ),
        list: [],
        name: "Woensdag",
      },
      {
        id: 3,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 3),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 3),
          ),
        ),
        list: [],
        name: "Donderdag",
      },
      {
        id: 3,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 4),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 4),
          ),
        ),
        list: [],
        name: "Vrijdag",
      },
      {
        id: 3,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 5),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 5),
          ),
        ),
        list: [],
        name: "Zaterdag",
      },
      {
        id: 3,
        start: getStartOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 6),
          ),
        ),
        end: getEndOfDay(
          new Date(
            new Date(mondayOfTheWeek).setDate(mondayOfTheWeek.getDate() + 6),
          ),
        ),
        list: [],
        name: "Zondag",
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
          user: useAuthStore().auth?.id,
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
}

const currentDay = new Date();
const diff =
  currentDay.getDate() -
  currentDay.getDay() +
  (currentDay.getDay() === 0 ? -6 : 1);
const mondayOfTheWeek = ref(new Date(currentDay.setDate(diff)));
const days = ref(await getDays(mondayOfTheWeek.value));

function prettyDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("nl", { month: "long" });
  return new Date(date).getDate() + " " + formatter.format(date);
}
</script>
