<template>
  <div class="mx-4">
    <v-card variant="flat">
      <v-row>
        <v-col>
          <v-select
            variant="solo"
            v-model="selectedBuilding"
            :items="buildings"
            label="Selecteer Gebouw"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            variant="solo"
            v-model="selectedWeek"
            :items="weeks"
            label="Selecteer Week"
          ></v-select>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="show = !show"
          ></v-btn>
        </v-card-actions>
      </v-row>
      <v-expand-transition>
        <div v-show="show">
          <v-row>
            <v-col>
              <v-select
                variant="solo"
                v-model="selectedDay"
                :items="days"
                label="Selecteer Dag"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                variant="solo"
                chips
                v-model="selectedGarbage"
                :items="garbageTypes"
                label="Selecteer Vuilnis"
                multiple
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                variant="solo"
                chips
                multiple
                v-model="selectedAction"
                :items="actions"
                label="Selecteer Actie"
              ></v-select>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex">
            <v-spacer></v-spacer>
            <v-btn
              @click="addItem"
              :disabled="
                !(
                  selectedBuilding &&
                  selectedDay &&
                  selectedWeek &&
                  selectedGarbage.length !== 0 &&
                  selectedAction.length !== 0
                )
              "
              prepend-icon="mdi-plus"
              color="primary"
              >Toevoegen</v-btn
            >
          </v-card-actions>
        </div>
      </v-expand-transition>
    </v-card>

    <v-table
      v-if="selectedBuilding && selectedWeek && buildingItems.length > 0"
    >
      <thead>
        <tr>
          <th class="text-left">Dag</th>
          <th class="text-left">Vuilnis</th>
          <th class="text-left">Actie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in buildingItems" :key="item.building">
          <td>{{ item.day }}</td>
          <td>
            <v-chip-group>
              <v-chip v-for="garbage in item.garbage" :key="garbage">
                {{ garbage }}
              </v-chip>
            </v-chip-group>
          </td>
          <td>
            <v-chip-group>
              <v-chip v-for="action in item.action" :key="action">
                {{ action }}
              </v-chip>
            </v-chip-group>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- && selectedBuilding.value&& selectedDay.value && selectedGarbage.value && selectedAction.value -->
    <!--
      <v-card v-if="selectedBuilding || selectedGarbage">
        <v-card-title>Selected Building Info</v-card-title>
        <v-data-table :headers="buildingHeaders" :items="buildingItems" hide-default-footer></v-data-table>
        <v-btn v-if="buildingItems.length === 0" @click="addItem">Add</v-btn>
      </v-card>
      -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from "vue";

const show = ref(false);

const buildings = ["Gebouw A", "Gebouw B", "Gebouw C", "Gebouw D", "Gebouw E"];
const days = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];
const weeks = ["Oneven", "Even"];
const garbageTypes = ["Vuilnis Type 1", "Vuilnis Type 2", "Vuilnis Type 3"];
const actions = ["Actie 1", "Actie 2", "Actie 3"];
const selectedBuilding = ref(null);
const selectedDay = ref(null);
const selectedWeek = ref(null);
const selectedGarbage = ref([]);
const selectedAction = ref([]);
const buildingData: {
  building: string;
  garbage: string[];
  day: string;
  week: string;
  action: string[];
}[] = reactive([
  {
    building: "Gebouw A",
    garbage: ["Vuilnis Type 1", "w"],
    day: "Maandag",
    week: "Oneven",
    action: ["Actie 1"],
  },
  {
    building: "Gebouw B",
    garbage: ["Vuilnis Type 2"],
    day: "Dinsdag",
    week: "Even",
    action: ["Actie 2"],
  },
  {
    building: "Gebouw C",
    garbage: ["Vuilnis Type 1"],
    day: "Woensdag",
    week: "Oneven",
    action: ["Actie 3"],
  },
  {
    building: "Gebouw D",
    garbage: ["Vuilnis Type 3"],
    day: "Donderdag",
    week: "Even",
    action: ["Actie 1"],
  },
  {
    building: "Gebouw E",
    garbage: ["Vuilnis Type 2"],
    day: "Vrijdag",
    week: "Oneven",
    action: ["Actie 2"],
  },
]);

const buildingItems = computed(() => {
  if (selectedBuilding.value && selectedWeek.value) {
    return buildingData.filter(
      (item) =>
        item.building === selectedBuilding.value &&
        item.week === selectedWeek.value,
    );
  } else {
    return [];
  }
});

const addItem = () => {
  if (
    selectedBuilding.value &&
    selectedDay.value &&
    selectedWeek.value &&
    selectedGarbage.value &&
    selectedAction.value
  ) {
    buildingData.push({
      building: selectedBuilding.value,
      day: selectedDay.value,
      week: selectedWeek.value,
      garbage: selectedGarbage.value,
      action: selectedAction.value,
    });
    selectedDay.value = null;
    selectedGarbage.value = [];
    selectedAction.value = [];
  }
};

// const show = () => {
//   add.value = !add.value;
// };
</script>
