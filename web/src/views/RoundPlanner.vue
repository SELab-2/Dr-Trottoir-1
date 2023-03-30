<template>
  <v-card variant="flat">
    <v-card-actions class="d-flex ml-3">
      <!-- Buttons to select if the user wants to plan for multiple days or not -->
      <v-btn
        @click="
          () => {
            selected_multiple = false;
            selected_end_day = '';
          }
        "
        :active="!selected_multiple"
        >Enkel</v-btn
      >
      <v-btn
        @click="() => (selected_multiple = true)"
        :active="selected_multiple"
        >Meerdere</v-btn
      >
    </v-card-actions>
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-5"
      >
        <v-select
          label="Student"
          :items="mock_students"
          type="text"
          variant="solo"
          prepend-inner-icon="mdi-account"
          v-model="selected_student"
          required
        ></v-select>
      </v-col>
      <!-- TODO: implement check to see if start and end date dont crossover -->
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-1 py-0 my-0"
        ><div class="d-flex">
          <v-text-field
            label="Datum"
            type="date"
            variant="solo"
            multiple
            v-model="selected_start_day"
          /><v-text-field
            class="ml-1"
            v-if="selected_multiple"
            label="Datum"
            type="date"
            variant="solo"
            multiple
            v-model="selected_end_day"
          />
        </div>
      </v-col>
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-0 py-0 my-0 mr-5"
      >
        <v-text-field
          label="Start"
          type="time"
          variant="solo"
          v-model="selected_time"
        />
      </v-col> </v-row
    ><v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-5"
      >
        <v-select
          label="Ronde"
          :items="mock_rounds"
          v-model="selected_round"
          item-value="name"
          item-title="name"
          return-object
          type="text"
          variant="solo"
          prepend-inner-icon="mdi-transit-detour"
          required
        ></v-select>
      </v-col>
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-0 py-0 my-0"
      >
        <!-- TODO: currently 55px on this button to make it fit the theme, maybe css in future? -->
        <!-- TODO: fix this router link to load in dynamicly -->
        <v-btn
          to="/rondes/nieuw"
          min-width="100%"
          min-height="55px"
          prepend-icon="mdi-pencil"
          left
          max-width="100%"
          >Bewerken</v-btn
        >
      </v-col>
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-0 py-0 my-0 mr-5"
      >
        <!-- TODO: Fix router link so there's a pushback to this page once a round is created?-->
        <v-btn
          to="/rondes/nieuw"
          min-height="55px"
          min-width="100%"
          prepend-icon="mdi-plus"
          max-width="100%"
          >Nieuwe maken</v-btn
        >
      </v-col>
    </v-row>

    <v-card
      v-if="selected_round"
      v-for="planned in planned_rounds"
      class="py-0 my-5 mx-5"
    >
      <template v-if="selected_round.comments" v-slot:prepend>
        <v-tooltip :text="`Ronde al ingepland op ${planned.date}`"
          ><template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="error"
              icon="mdi-alert"
            ></v-icon></template
        ></v-tooltip>
      </template>

      <template v-else v-slot:prepend>
        <v-icon v-bind="props" color="green" icon="mdi-transit-detour"></v-icon>
      </template>
      <template v-slot:title>
        <v-card-title>{{ selected_round.name }}</v-card-title> </template
      ><template v-slot:subtitle>
        <v-card-subtitle>{{
          selected_multiple ? planned.date : ""
        }}</v-card-subtitle>
      </template>
      <template v-slot:append>
        <v-icon class="ml-2" color="error" icon="mdi-close"></v-icon>
        <v-icon class="ml-2" color="primary" icon="mdi-pencil"></v-icon>
        <v-icon
          class="ml-2"
          :icon="planned.showinfo ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        ></v-icon>
      </template>
    </v-card>
    <v-card
      v-else
      prepend-icon="mdi-information"
      title="Nog geen ronde geselecteerd"
      variant="flat"
    ></v-card>
    <v-card-actions class="d-flex">
      <v-spacer></v-spacer>
      <!-- TODO fill in correct link, router pushback to previous page or reload this one? -->
      <v-btn
        :disabled="
          !(
            selected_student &&
            selected_round &&
            selected_start_day &&
            selected_time
          )
        "
        to="/todo"
        prepend-icon="mdi-check"
        color="primary"
        >Ronde(s) inplannen</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef } from "vue";
import Round from "@/components/models/Round";

const selected_multiple = ref<boolean>(false);
const selected_student = ref<string>("");
const selected_start_day = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const selected_end_day = ref<string>("");
const selected_time = ref<string>("");
const selected_round = ref<Round | null>(null);

function getDateRange(start: string, end: string): string[] {
  if (!end) {
    return [start];
  } else {
    let dates: string[] = [];
    let current_date = new Date(start);
    let end_date = new Date(end);
    while (current_date <= end_date) {
      dates.push(current_date.toISOString().substring(0, 10));
      current_date.setDate(current_date.getDate() + 1);
    }

    return dates;
  }
}

interface RoutePlanning {
  date: string;
  round: Round | null;
  showinfo: boolean;
}

const planned_rounds: ComputedRef<RoutePlanning[]> = computed(() => {
  let date_round: RoutePlanning[] = [];
  for (let curr_date of getDateRange(
    selected_start_day.value,
    selected_end_day.value,
  )) {
    date_round.push({
      date: curr_date,
      round: selected_round.value,
      showinfo: false,
    });
  }
  return date_round;
});

function logme(planned: RoutePlanning) {
  planned.showinfo = !planned.showinfo;
  console.log("hssssssss");
}

const mock_students = ref<string[]>([
  "Michael",
  "Christopher",
  "Jessica",
  "Matthew",
  "Ashley",
]);

const mock_rounds: Round[] = [
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
