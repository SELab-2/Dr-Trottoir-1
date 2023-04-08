<template>
  <v-container>
    <div v-for="(schedule, index) in schedules" :key="index">
      <v-row>
        <v-col>
          <v-select
            v-model="schedule.garbageType"
            :items="garbageTypes"
            label="Vuilnis Type"
            outlined
            dense
          ></v-select>
        </v-col>

        <v-col >
          <v-select
            v-model="schedule.action"
            :items="actions"
            label="Actie"
            outlined
            dense
          ></v-select>
        </v-col>

        <v-col>
          <v-text-field
            v-model="schedule.startDate"
            label="Start Datum"
            type="date"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="schedule.endDate"
            label="Einde Datum"
            type="date"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col>
          <v-select
            v-model="schedule.frequency"
            :items="frequencies"
            label="Frequenctie"
            outlined
            dense
          ></v-select>
        </v-col>

        <v-col>
          <v-select
            v-model="schedule.day"
            :items="days"
            label="Dag"
            outlined
            dense
          ></v-select>
        </v-col>

        <v-col>
          <v-text-field
            v-model="schedule.time"
            label="Tijd"
            type="time"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <v-row justify="center">
        <v-btn color="primary" @click="addSchedule">+</v-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h4>Schedules:</h4>
        <v-list>
          <v-list-item
            v-for="(schedule, index) in sortedSchedules"
            :key="index"
          >
            <v-list-item-content>
              <div class="d-flex align-center">
                <div :style="{backgroundColor: getColor(schedule.garbageType), borderRadius: '50%', width: '20px', height: '20px'}"></div>
                {{ schedule.day }} - {{ schedule.garbageType }} - {{
                  schedule.action
                }} - Start: {{ schedule.startDate }} - End: {{
                  schedule.endDate
                }} - {{ schedule.frequency }} - Time: {{ schedule.time }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {ref, reactive, computed } from "vue";

interface Schedule {
  garbageType: string;
  action: string;
  startDate: string;
  endDate: string;
  frequency: string;
  day: string;
  time: string;
}
const schedules = reactive<Schedule[]>([
  {
    garbageType: "",
    action: "",
    startDate: "",
    endDate: "",
    frequency: "",
    day: "",
    time: "",
  },
]);

const garbageTypes = [
  "Vuilnis type 1",
  "Vuilnis type 2",
  "Vuilnis type 3",
  "Vuilnis type 4",
  "Vuilnis type 5",
];
const actions = ["Actie 1", "Actie 2-"];
const frequencies = ["1", "2", "4"];
const days = [
  "M",
  "D",
  "W",
  "D",
  "V",
  "Z",
  "Z",
];

function addSchedule() {
  schedules.push({
    garbageType: "",
    action: "",
    startDate: "",
    endDate: "",
    frequency: "",
    day: "",
    time: "",
  });
}

const sortedSchedules = computed(() => {
  return schedules.slice().sort((a, b) => {
    return a.day.localeCompare(b.day);
  });
});

function getColor(garbageType: string) {
  switch (garbageType) {
    case "Vuilnis type 1":
      return "#F44336";
    case "Vuilnis type 2":
      return "#4CAF50";
    case "Vuilnis type 3":
      return "#FF9800";
    case "Vuilnis type 4":
      return "#2196F3";
    case "Vuilnis type 5":
      return "#9C27B0";
    default:
      return "#000000";
  }
}

</script>
