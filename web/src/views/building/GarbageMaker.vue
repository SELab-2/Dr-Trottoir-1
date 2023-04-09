<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="garbageType"
          :items="garbageTypes"
          label="Garbage Type"
        ></v-select>
      </v-col>
      <v-col>
        <v-select v-model="action" :items="actions" label="Action"></v-select>
      </v-col>
      <v-col>
        <v-select v-model="day" :items="days" label="Day"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="startDate" label="Start Date" type="date"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="endDate" label="End Date" type="date"></v-text-field>
      </v-col>
      <v-col>
        <v-select v-model="frequency" :items="frequencys" label="Frequency"></v-select>
      </v-col>
      <v-col>
        <v-text-field v-model="time" label="Time" type="time"></v-text-field>
      </v-col>
    </v-row>

    <v-btn @click="add">Add</v-btn>
    <v-btn @click="submit">Submit</v-btn>
    <v-btn @click="clearAll">Clear All</v-btn>

    <v-list>
      <v-list-item v-for="schedule in summary" :key="schedule.id">
        <v-list-item-title>{{ schedule.summary }}</v-list-item-title>
        <v-btn @click="deleteSummary(schedule.id)">Delete</v-btn>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-item v-for="day in detailedDays" :key="day.id">
        <v-list-item-title>{{ day.day }}</v-list-item-title>
        <v-btn @click="deleteDay(day.id)">Delete</v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { scheduler } from "timers/promises";
import { ref } from "vue";

interface Schedule {
  id: number;
  summary: string;
  start: Date;
  end: Date;
  day: string;
  garbageType: string;
  action: string;
  time: string;
}

interface DetailedDay {
  id: number;
  scheduleId: number;
  date: Date;
  day: string;
  garbageType: string;
  action: string;
  time: string;
}

const garbageTypes = ["REST", "PMD", "GFT", "Papier"];
const actions = ["buiten zetten", "binnen halen"];
const days = [
  "Maanday",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];
const frequencys = ["enkel", "wekelijks", "maandelijks"];

const garbageType = ref("");
const action = ref("");
const startDate = ref("");
const endDate = ref("");
const day = ref("");
const time = ref("");
const frequency = ref("");

//nu nog een string voor het simple te houden
const summary = ref<Array<Schedule>>([]);
const detailedDays = ref<Array<DetailedDay>>([]);

let scheduleCounter = 0;
let dayCounter = 0;

function add() {
  const scheduleSummary: Schedule = {
    id: scheduleCounter,
    summary: `${startDate.value} - ${endDate.value}, ${garbageType.value}, ${time.value}, ${action.value}`,
    start: new Date(startDate.value),
    end: new Date(endDate.value),
    day: day.value,
    garbageType: garbageType.value,
    action: action.value,
    time: time.value,
  };
  summary.value.push(scheduleSummary);

  // Calculate all separate days
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const oneDay = 24 * 60 * 60 * 1000;

  for (let d = start; d <= end; d.setTime(d.getTime() + oneDay)) {
    if (days[d.getDay()] === day.value) {
      detailedDays.value.push({
        id: dayCounter++,
        scheduleId: scheduleCounter,
        date: d,
        day: days[d.getDay()],
        garbageType: garbageType.value,
        action: action.value,
        time: time.value,
      });
    }
  }
  scheduleCounter++;
}
function deleteSummary(id: number) {
  const correspondingSummary = summary.value.find(
    (schedule) => schedule.id === id
  ) as Schedule;
  if (correspondingSummary) {
    detailedDays.value = detailedDays.value.filter((day) => day.scheduleId !== id);
  }
  summary.value = summary.value.filter((schedule) => schedule.id !== id);
}

function submit() {
  console.log("All days:");
  detailedDays.value.forEach((day) => console.log(day.date));
}

function clearAll() {
  summary.value = [];
  detailedDays.value = [];
}

function deleteDay(id: number) {
  detailedDays.value = detailedDays.value.filter((day) => day.id !== id);
}
</script>
