<template>
  <v-card variant="flat">
    <!-- Select input fields -->

    <v-card-actions class="d-flex ml-3">
      <!-- Buttons to select if the user wants to plan for multiple days or not -->
      <v-btn
        @click="
          () => {
            selected_multiple = false;
            selected_end_day = '';
            reset_planning();
          }
        "
        :active="!selected_multiple"
        >Enkel</v-btn
      >
      <v-btn
        @click="
          () => {
            selected_multiple = true;
            reset_planning();
          }
        "
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
            @update:model-value="reset_planning()"
          /><v-text-field
            class="ml-1"
            v-if="selected_multiple"
            label="Datum"
            type="date"
            variant="solo"
            multiple
            v-model="selected_end_day"
            @update:model-value="reset_planning()"
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
          label="Template ronde"
          :items="mock_rounds"
          v-model="selected_round"
          item-value="name"
          item-title="name"
          return-object
          type="text"
          variant="solo"
          prepend-inner-icon="mdi-transit-detour"
          required
          @update:model-value="reset_planning()"
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

    <!-- View selected rounds -->
    <div v-if="selected_round">
      <v-card
        v-for="(planned, index) in planning"
        v-bind:key="index"
        class="py-0 my-5 mx-5"
      >
        <!-- Give user a warning with tooltip + icon -->
        <!-- Use this when trying to plan a building in a round that's already planned in -->
        <!-- TODO: currently this uses round.comments as warning, should be an API call -->
        <template v-if="selected_round.comments" v-slot:prepend>
          <v-tooltip :text="`Gebouw(en) ingepland op ${planned.date}`"
            ><template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="error"
                icon="mdi-alert"
              ></v-icon></template
          ></v-tooltip>
        </template>

        <!-- Icons for showing extra info about the building -->
        <template v-else v-slot:prepend>
          <v-icon color="green" icon="mdi-transit-detour"></v-icon>
        </template>
        <template v-slot:title>
          <v-card-title>{{
            selected_multiple ? planned.date : selected_round.name
          }}</v-card-title> </template
        ><template v-slot:subtitle>
          <v-card-subtitle>{{
            selected_multiple ? selected_round.name : planned.date
          }}</v-card-subtitle>
        </template>
        <template v-slot:append>
          <v-icon
            v-if="planned.showinfo"
            class="ml-2"
            color="primary"
            icon="mdi-pencil"
            @click="planned.edit = !planned.edit"
          ></v-icon>
          <v-icon
            class="ml-2"
            :icon="planned.showinfo ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="() => (planned.showinfo = !planned.showinfo)"
          ></v-icon>
          <v-icon
            class="ml-2"
            color="error"
            icon="mdi-close"
            @click="remove_from_planning(index)"
          ></v-icon>
        </template>

        <!-- Show the expand, where users can quickly alter their rounds -->
        <v-expand-transition>
          <div v-show="planned.showinfo">
            <v-divider></v-divider>

            <v-card
              v-for="(building, bindex) in planned.round?.buildings"
              v-bind:key="bindex"
              class="ml-3 my-1"
              variant="flat"
            >
              <!-- TODO: currently this uses building.comments as warning, should be an API call -->
              <template v-if="building.comments" v-slot:prepend>
                <v-tooltip :text="`Gebouw al ingepland op ${planned.date}`"
                  ><template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      color="error"
                      icon="mdi-alert"
                    ></v-icon></template
                ></v-tooltip>
              </template>

              <template v-else v-slot:prepend>
                <v-icon color="green" icon="mdi-office-building"></v-icon>
              </template>
              <template v-slot:title>
                <v-card-title>{{ building.name }}</v-card-title> </template
              ><template v-slot:subtitle>
                <v-card-subtitle>{{ building.address }}</v-card-subtitle>
              </template>
              <template v-slot:append
                ><v-icon
                  v-if="planned.edit"
                  icon="mdi-close"
                  color="error"
                  @click="planned.round?.buildings.splice(bindex, 1)"
                ></v-icon
              ></template>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
    <div v-else>
      <v-card
        prepend-icon="mdi-information"
        title="Nog geen ronde geselecteerd"
        variant="flat"
      ></v-card>
    </div>
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
import { ref } from "vue";
import Round from "@/components/models/Round";
import RoundPlanning from "@/components/models/RoundPlanning";

const selected_multiple = ref<boolean>(false);
const selected_student = ref<string>("");
const selected_start_day = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const selected_end_day = ref<string>("");
const selected_time = ref<string>("");
const selected_round = ref<Round | null>(null);

/**
 * Gives all the dates in a range
 * @param start startdate in string format
 * @param end enddate in string format
 */
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

// List gets updated when the user updates input field
let planning = ref<RoundPlanning[]>([]);

function remove_from_planning(index: number) {
  planning.value.splice(index, 1);
}

/**
 * Would be better if this was a computed property
 * The extra fields in RoutePlanning dont allow for this
 */
function reset_planning() {
  planning.value = [];
  for (let curr_date of getDateRange(
    selected_start_day.value,
    selected_end_day.value,
  )) {
    planning.value.push({
      date: curr_date,
      round: selected_round.value,
      showinfo: false,
      edit: false,
    });
  }
}

const mock_students = ref<string[]>([
  "Michael",
  "Christopher",
  "Jessica",
  "Matthew",
  "Ashley",
]);

const mock_rounds = ref<Round[]>([
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
]);
</script>
