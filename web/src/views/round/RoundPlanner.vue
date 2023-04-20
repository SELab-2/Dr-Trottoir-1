<template>
  <div>
    <HFillWrapper margin="mx-4 mb-4">
      <BorderCard :title="`Inplannen voor ${current_round?.name}`">
        <v-row class="py-0 my-4 mx-2">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0"
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
        <v-row class="py-0 my-4 mx-2">
          <v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-select
              prepend-inner-icon="mdi-replay"
              variant="outlined"
              label="Frequentie"
              v-model="frequency"
              :items="frequencys"
              @update:model-value="frequencyCheck()"
            ></v-select></v-col
          ><v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0"
            ><div v-if="!multipleday">
              <v-text-field
                prepend-inner-icon="mdi-calendar"
                label="Startdatum"
                variant="outlined"
                type="date"
                v-model="startDate"
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between" v-else>
              <v-text-field
                v-model="startDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                class="mr-1"
                type="date"
                label="Startdatum"
              ></v-text-field
              ><v-text-field
                v-model="endDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                class="ml-1"
                type="date"
                label="Einddatum"
              ></v-text-field></div></v-col
          ><v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-text-field
              prepend-inner-icon="mdi-clock-time-two-outline"
              label="Starttijd"
              variant="outlined"
              type="time"
              v-model="time"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-card-actions
          ><v-btn prepend-icon="mdi-plus" @click="updateRounds()"
            >Toevoegen</v-btn
          >
          <v-spacer></v-spacer
          ><v-btn prepend-icon="mdi-check" @click="planRounds()"
            >Ronde inplannen</v-btn
          ></v-card-actions
        >
      </BorderCard>
      <RoundSelectCard
        v-for="(round, i) in rounds"
        :key="i"
        @remove="removeFromRounds(i)"
        :name="round.name"
        :date="round.date"
        :time="round.time"
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
import { useRoute } from "vue-router";

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
const time = ref<string>("");
const frequency = ref<string>(frequencys[0]);
const multipleday = ref<boolean>(false);

interface plannedRound {
  date: Date;
  name: string;
  time: string;
}
let rounds = ref<Array<plannedRound>>([]);

function updateRounds() {
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
    });
  }
}
function frequencyCheck() {
  if (frequency.value == frequencys[0]) {
    multipleday.value = false;
  } else {
    endDate.value = "";
    multipleday.value = true;
  }
}
function removeFromRounds(index: number) {
  rounds.value.splice(index, 1);
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
</style>
