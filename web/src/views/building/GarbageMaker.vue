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

    <v-spacer></v-spacer>
    <v-slide-group class="pt-4">
      <v-slide-group-item v-for="schedule in summary" :key="schedule.id">
        <v-card>
          <v-card-title> {{ schedule.garbageType }} </v-card-title>
          <v-card-subtitle> {{ schedule.action }}</v-card-subtitle>
          <div class="pa-4">
            <div><strong>Period:</strong> {{ schedule.start }} - {{ schedule.end }}</div>
            <!--
            <div><strong>Start:</strong> {{ schedule.start.getDay() }}-{{ schedule.start.getMonth()}}-{{ schedule.start.getFullYear()}}</div>
            <div><strong>Start:</strong> {{ schedule.end.getDay() }}-{{ schedule.end.getMonth()}}-{{ schedule.end.getFullYear()}}</div>
            -->
            <div><strong>Type:</strong> {{ schedule.garbageType }}</div>
            <div><strong>Action:</strong> {{ schedule.action }}</div>
            <div><strong>Time:</strong> {{ schedule.time }}</div>
          </div>
          <v-card-actions>
            <v-btn @click="deleteSummary(schedule.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <v-list>
      <v-list-item v-for="day in detailedDays" :key="day.id">
        <v-row>
          <v-col
            >{{ day.date }}-{{ day.date.getMonth() }}-{{ day.date.getFullYear() }}</v-col
          >
          <v-col>{{ day.garbageType }}</v-col>
          <v-col>{{ day.action }}</v-col>
          <v-col>{{ day.time }}</v-col>
          <v-col cols="2">
            <v-btn @click="deleteDay(day.id)">Delete</v-btn>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Schedule {
  id: number;
  start: Date;
  end: Date;
  garbageType: string;
  action: string;
  time: string;
  frequency: string;
}

interface DetailedDay {
  id: number;
  scheduleId: number;
  date: Date;
  garbageType: string;
  action: string;
  time: string;
}

const garbageTypes = ["REST", "PMD", "GFT", "Papier"];
const actions = ["buiten zetten", "binnen halen"];
const frequencys = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];
const frequencyDict: Record<string, number> = {
  enkel: 1,
  wekelijks: 7,
  tweewekelijks: 14,
  maandelijks: 28,
};

const garbageType = ref("");
const action = ref("");
const startDate = ref("");
const endDate = ref("");
const time = ref("");
const frequency = ref("");

//nu nog een string voor het simple te houden
const summary = ref<Array<Schedule>>([]);
const detailedDays = ref<Array<DetailedDay>>([]);

let scheduleCounter = 0;
let dayCounter = 0;

function add() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }
  const scheduleSummary: Schedule = {
    id: scheduleCounter,
    start: new Date(startDate.value),
    end: new Date(endDate.value),
    garbageType: garbageType.value,
    action: action.value,
    time: time.value,
    frequency: frequency.value,
  };
  summary.value.push(scheduleSummary);

  // Calculate all separate days
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const frequencyCount = frequencyDict[frequency.value];
  //elke dag berekenen afhankelijk van de frequentie
  for (let d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
    console.log(d);
    detailedDays.value.push({
      id: dayCounter++,
      scheduleId: scheduleCounter,
      date: new Date(d),
      garbageType: garbageType.value,
      action: action.value,
      time: time.value,
    });
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
