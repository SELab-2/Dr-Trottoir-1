<template>
  <div>
    <HFillWrapper>
      <BorderCard class="mb-2"
        ><v-tabs
          v-model="showAllPlanned"
          @update:model-value="updateFullScheme()"
          align-tabs="center"
        >
          <v-spacer></v-spacer>
          <v-tab :value="false">Ronde inplannen</v-tab>
          <v-spacer></v-spacer>
          <v-tab :value="true">Voorlopig schema</v-tab>
          <v-spacer></v-spacer> </v-tabs
      ></BorderCard>
      <BorderCard
        class="pa-8"
        style="display: flex; flex-direction: column; gap: 12px"
      >
        <v-expand-transition
          ><div v-show="!showAllPlanned">
            <div class="d-flex">
              <h2>Ronde inplannen voor:</h2>
              <v-hover v-slot:default="{ isHovering, props }">
                <h2
                  class="mx-1"
                  v-bind="props"
                  @click="
                    router.push({
                      name: 'round',
                      params: { id: current_round?.id },
                    })
                  "
                  :class="isHovering ? 'text-decoration-underline' : ''"
                >
                  {{ current_round?.name }}
                </h2>
              </v-hover>
            </div>
            <p>
              Kies hier een student om hem/haar in te plannen voor de ronde
              {{ current_round?.name }}. Kies een frequentie en datum(s) wanneer
              deze ronde ingepland zou moeten worden. Druk op tijdelijk
              toevoegen om een voorbeeld te zien van hoe deze inplanning er zal
              uitzien. Hiervoor kunt u ook gebruik maken van "voorlopig schema".
              Als u tevreden bent met deze inplanning, kan u deze opslaan door
              op "ronde inplannen en opslaan" te drukken.
            </p>

            <v-row class="pt-2 mt-1">
              <v-col
                cols="1"
                style="min-width: 100px; max-width: 100%"
                class="flex-grow-1 flex-shrink-0"
                ><v-select
                  label="Selecteer student"
                  :items="students"
                  v-model="student"
                  prepend-inner-icon="mdi-account"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="item.name"
                      :subtitle="item.name"
                    >
                      <p>{{ getFullStudentName(item.value) }}</p>
                    </v-list-item>
                  </template>

                  <template v-slot:selection="{ item }">
                    <p>{{ getFullStudentName(item.value) }}</p>
                  </template>
                </v-select></v-col
              ></v-row
            >

            <div
              class="selectors"
              :class="multipleday ? 'grid-cols-4' : 'grid-cols-3'"
            >
              <v-select
                prepend-inner-icon="mdi-replay"
                variant="outlined"
                label="Frequentie"
                v-model="frequency"
                :items="frequencys"
                @update:model-value="frequencyCheck()"
              ></v-select>

              <v-text-field
                v-model="startDate"
                variant="outlined"
                type="date"
                label="Startdatum"
                :max="multipleday ? endDate : '2100'"
              ></v-text-field>

              <v-text-field
                v-model="endDate"
                variant="outlined"
                type="date"
                label="Einddatum"
                v-if="multipleday"
                :min="startDate"
              ></v-text-field>

              <v-text-field
                label="Starttijd"
                variant="outlined"
                type="time"
                v-model="time"
              ></v-text-field>
            </div>

            <div style="display: flex; align-items: center">
              <SimpleButton
                prepend-icon="mdi-plus"
                @click="calcNewRounds()"
                :disabled="student === undefined"
                variant="tonal"
                >Tijdelijk toevoegen</SimpleButton
              >
              <div class="flex-grow-1"></div>
              <SimpleButton
                prepend-icon="mdi-check"
                @click="planRounds()"
                :disabled="rounds?.length === 0"
                variant="tonal"
                >Ronde inplannen en opslaan</SimpleButton
              >
            </div>
          </div></v-expand-transition
        >
        <v-expand-transition
          ><div v-show="showAllPlanned">
            <div class="d-flex">
              <h2>Voorlopig overzicht:</h2>
              <v-hover v-slot:default="{ isHovering, props }">
                <h2
                  class="mx-1"
                  v-bind="props"
                  @click="
                    router.push({
                      name: 'round',
                      params: { id: current_round?.id },
                    })
                  "
                  :class="isHovering ? 'text-decoration-underline' : ''"
                >
                  {{ current_round?.name }}
                </h2>
              </v-hover>
            </div>
            <p>
              Hier wordt er een voorlopig overzicht getoond van de planning van
              deze ronde. Kies start- en einddatum door deze aan te passen in de
              velden. Tussen dit overzicht staan ook de planningen van de rondes
              die je nog niet bevestigd hebt. Ga hier na of de inplanning op die
              dag wel of niet werkt.
            </p>
            <div class="d-flex mt-4">
              <v-text-field
                class="mr-1"
                v-model="fullSchemeStartDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Startdatum"
                :max="fullSchemeEndDate"
              ></v-text-field>
              <v-text-field
                class="ml-1"
                v-model="fullSchemeEndDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Einddatum"
                :min="fullSchemeStartDate"
              ></v-text-field>
            </div>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <SimpleButton
                prepend-icon="mdi-check"
                @click="updateFullScheme()"
                variant="tonal"
                >Pas filter toe</SimpleButton
              >
            </div>
          </div></v-expand-transition
        >
      </BorderCard>

      <RoundSelectCard
        v-for="(round, i) in showAllPlanned ? fullScheme : rounds"
        :key="i"
        @remove="round.func(i)"
        :name="round.name"
        :date="round.date"
        :time="round.time"
        :already-planned="round.alreadyPlanned"
      >
      </RoundSelectCard>
    </HFillWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BorderCard from "@/layouts/CardLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import RoundSelectCard from "@/components/cards/RoundSelectCard.vue";
import {
  Result,
  UserQuery,
  RoundQuery,
  ScheduleQuery,
} from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute, useRouter } from "vue-router";
import SimpleButton from "@/components/buttons/SimpleButton.vue";

const router = useRouter();

const showAllPlanned = ref<boolean>(false);

const route = useRoute();
const round_id: number = Number(route.params.id);

const current_round = ref<Result<RoundQuery>>();
const students = ref<Result<UserQuery>[]>([]);
const student = ref<Result<UserQuery>>();

onMounted(() => {
  tryOrAlertAsync(async () => {
    students.value = await new UserQuery().getAll({ student: true });
  });

  tryOrAlertAsync(async () => {
    current_round.value = await new RoundQuery().getOne(round_id);
  });

  updateFullScheme();
});

const frequencys = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];
const frequencyDict: Record<string, number> = {
  enkel: 1,
  wekelijks: 7,
  tweewekelijks: 14,
  maandelijks: 28,
};

const startDate = ref<string>(new Date().toISOString().substring(0, 10));
const endDate = ref<string>(new Date().toISOString().substring(0, 10));
const time = ref<string>("12:00");
const frequency = ref<string>(frequencys[0]);
const multipleday = ref<boolean>(false);

const fullSchemeStartDate = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const fullSchemeEndDate = ref<string>(oneWeekLater());

interface plannedRound {
  date: Date;
  name: string;
  time: string;
  alreadyPlanned: boolean;
  func: (i: number) => void;
}

let rounds = ref<Array<plannedRound>>([]);

function calcNewRounds() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  let frequencyCount = frequencyDict[frequency.value];
  for (const d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
    rounds.value.push({
      name: getFullStudentName(student.value),
      date: new Date(d),
      time: time.value,
      alreadyPlanned: false,
      func: (i: number) => removeFromRounds(i),
    });
  }
}
function frequencyCheck() {
  if (frequency.value == frequencys[0]) {
    multipleday.value = false;
  } else {
    multipleday.value = true;
  }
}

function removeFromRounds(index: number) {
  rounds.value.splice(index, 1);
  updateFullScheme();
}

function deleteFromDatabase(id: number, index: number) {
  tryOrAlertAsync(async () => {
    await new ScheduleQuery().deleteOne({ id: id });
    fullScheme.value.splice(index, 1);
  });
}

const fullScheme = ref<plannedRound[]>([]);

function updateFullScheme() {
  tryOrAlertAsync(async () => {
    fullScheme.value = [];
    const schedules: Result<ScheduleQuery>[] = await new ScheduleQuery().getAll(
      {
        round_id: round_id,
        after: new Date(fullSchemeStartDate.value),
        before: new Date(fullSchemeEndDate.value),
      },
    );

    schedules.forEach((plannedSchedule) =>
      fullScheme.value.push({
        name: `${plannedSchedule.user.first_name} ${plannedSchedule.user.last_name}`,
        date: new Date(plannedSchedule.day),
        time: new Date(plannedSchedule.day).toTimeString().substring(0, 5),
        alreadyPlanned: true,
        func: (i: number) => deleteFromDatabase(plannedSchedule.id, i),
      }),
    );

    for (let tempSchedule of rounds.value) {
      if (
        new Date(fullSchemeStartDate.value).getTime() <=
          tempSchedule.date.getTime() &&
        tempSchedule.date.getTime() <=
          new Date(fullSchemeEndDate.value).getTime()
      ) {
        fullScheme.value.push(tempSchedule);
      }
    }

    fullScheme.value.sort((a: plannedRound, b: plannedRound) => {
      return a.date.getTime() - b.date.getTime();
    });
  });
}

function getFullStudentName(s: Result<UserQuery> | undefined): string {
  if (s) {
    return s.first_name + " " + s.last_name;
  } else {
    return " ";
  }
}

function formatDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function oneWeekLater() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate.toISOString().substring(0, 10);
}

function planRounds() {
  for (let plan of rounds.value) {
    tryOrAlertAsync(async () => {
      const dt_date = new Date(formatDate(plan.date) + " " + plan.time + ":00");
      await new ScheduleQuery()
        .createOne({
          user_id: student.value?.id,
          day: dt_date,
          round_id: round_id,
        })
        .then(() => {
          rounds.value = [];
        });
    });
  }
}
</script>

<style lang="sass">
.flex
  display: flex
  gap: 20px

.grid-cols-3
  grid-template-columns: repeat(3, minmax(0, 1fr))

.grid-cols-4
  grid-template-columns: repeat(4, minmax(0, 1fr))

.selectors
  display: grid
  flex-direction: row
  gap: 12px
  height: 80px

  & > *
    min-height: 100%
</style>
