<template>
  <v-card variant="flat">
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
      <!-- Start en einddatum zou idealiter een kalender moeten zijn waarop datums te selecteren zijn -->
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-1 py-0 my-0"
      >
        <v-text-field
          label="Startdatum"
          type="date"
          variant="solo"
          multiple
          v-model="selected_start_day"
        />
      </v-col>
      <v-col
        cols="3"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-0 flex-shrink-1 py-0 my-0"
      >
        <v-text-field
          label="Einddatum"
          type="date"
          variant="solo"
          multiple
          v-model="selected_end_day"
          :placeholder="selected_start_day"
        />
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
        <!-- TODO: fix router to link -->
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
      variant="flat"
      class="py-0 my-0 mx-2"
      :title="selected_round.name"
    >
      <v-list class="mx-3">
        <v-list-item v-for="building in selected_round.buildings">
          <v-card variant="flat"></v-card>
          <!-- TODO: Currently using the building.comments as a indication for mock -->
          <!-- Change in a api call if building already in other rounds -->
          <template v-slot:prepend v-if="building.comments">
            <!-- TODO: Maybe change the text of the tooltip to ref of round -->
            <v-tooltip text="Gebouw is al ingepland.">
              <template v-slot:activator="{ props }">
                <v-icon color="orange" icon="mdi-alert" v-bind="props"></v-icon>
              </template>
            </v-tooltip>
          </template>
          <template v-slot:prepend>
            <v-icon color="green" icon="mdi-office-building"></v-icon>
          </template>
          <template v-slot:title>
            <v-card-title>{{ building.name }}</v-card-title> </template
          ><template v-slot:subtitle>
            <v-card-subtitle>{{ building.address }}</v-card-subtitle>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card v-else title="Nog geen ronde geselecteerd" variant="flat"></v-card>
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
        >Ronde inplannen</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Round from "@/components/models/Round";

const selected_student = ref<string>("");
const selected_start_day = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const selected_end_day = ref<string>(new Date().toISOString().substring(0, 10));
const selected_time = ref<string>("");
const selected_round = ref<Round | null>(null);

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
