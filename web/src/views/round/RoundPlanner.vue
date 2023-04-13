<template>
  <div>
    <HFillWrapper margin="mx-4 mb-4">
      <BorderCard>
        <v-row class="py-0 my-4 mx-2">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0"
            ><v-autocomplete
              prepend-inner-icon="mdi-account"
              label="Student"
              :items="[
                'California',
                'Colorado',
                'Florida',
                'Georgia',
                'Texas',
                'Wyoming',
              ]"
              variant="solo"
            ></v-autocomplete></v-col
        ></v-row>
        <v-row class="py-0 my-4 mx-2">
          <v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-select
              prepend-inner-icon="mdi-replay"
              variant="solo"
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
                variant="solo"
                type="date"
                v-model="startDate"
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between" v-else>
              <v-text-field
                v-model="startDate"
                prepend-inner-icon="mdi-calendar"
                variant="solo"
                class="mr-2"
                type="date"
                label="Startdatum"
              ></v-text-field
              ><v-text-field
                v-model="endDate"
                prepend-inner-icon="mdi-calendar"
                variant="solo"
                class="ml-2"
                type="date"
                label="Einddatum"
              ></v-text-field></div></v-col
          ><v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-text-field
              prepend-inner-icon="mdi-clock-time-two-outline"
              label="Starttijd"
              variant="solo"
              type="time"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-card-actions
          ><v-spacer></v-spacer
          ><v-btn prepend-icon="mdi-check"
            >Ronde inplannen</v-btn
          ></v-card-actions
        >
      </BorderCard>
    </HFillWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BorderCard from "@/layouts/CardLayout.vue";
import Round from "@/components/models/Round";
import RoundPlanning from "@/components/models/RoundPlanning";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

const frequencys = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];
const frequencyDict: Record<string, number> = {
  enkel: 1,
  wekelijks: 7,
  tweewekelijks: 14,
  maandelijks: 28,
};
const startDate = ref<string>(new Date().toISOString().substring(0, 10));
const endDate = ref("");
const time = ref("");
const frequency = ref<string>(frequencys[0]);

const multipleday = ref<boolean>(false);

let dayCounter = 0;

function frequencyCheck() {
  if (frequency.value == frequencys[0]) {
    multipleday.value = false;
  } else {
    endDate.value = "";
    multipleday.value = true;
  }
}

function add() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  let frequencyCount = frequencyDict[frequency.value];
  for (const d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {}
  startDate.value = "";
  endDate.value = "";
  time.value = "";
}

const mock_rounds = [
  {
    name: "Grote Markt",
    start: "13:30",
    end: "14:00",
    started: true,
    student: "Emma",
    comments: true,
    current_building: 5,
    buildings: [
      {
        name: "Smith",
        address: "Gent, Belgium",
        deltatime: "10 min",
        comments: false,
        amount_of_pics: 5,
      },
      {
        name: "Johnson",
        address: "Brussels, Belgium",
        deltatime: "35 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Smith",
        address: "Gent, Belgium",
        deltatime: "10 min",
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Johnson",
        address: "Brussels, Belgium",
        deltatime: "35 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Brown",
        address: "Antwerp, Belgium",
        deltatime: "25 min",
        comments: true,
        amount_of_pics: 4,
      },
    ],
  },
  {
    name: "Vrijdagmarkt",
    start: "16:00",
    end: "",
    started: true,
    student: "Sophie",
    comments: false,
    current_building: 1,
    buildings: [
      {
        name: "Garcia",
        address: "Bruges, Belgium",
        deltatime: "15 min",
        comments: false,
        amount_of_pics: 3,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        deltatime: "20 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        deltatime: "30 min",
        comments: false,
        amount_of_pics: 4,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        deltatime: "20 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        deltatime: "30 min",
        comments: false,
        amount_of_pics: 4,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        deltatime: "20 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        deltatime: "30 min",
        comments: false,
        amount_of_pics: 4,
      },
    ],
  },
  {
    name: "Korenmarkt",
    start: "16:15",
    end: "",
    student: "Alex",
    started: false,
    comments: false,
    current_building: 0,
    buildings: [
      {
        name: "Wilson",
        address: "Veldstraat, Belgium",
        deltatime: "5 min",
        comments: false,
        amount_of_pics: 3,
      },
      {
        name: "Moore",
        address: "Liege, Belgium",
        deltatime: "45 min",
        comments: false,
        amount_of_pics: 5,
      },
      {
        name: "Anderson",
        address: "Mons, Belgium",
        deltatime: "30 min",
        comments: false,
        amount_of_pics: 2,
      },
    ],
  },
];
</script>

<style lang="sass">
.flex
  display: flex
  gap: 20px
</style>
