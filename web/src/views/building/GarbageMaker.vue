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
        <v-select v-model="action" :items="actions" label="Actie"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select v-model="frequency" :items="frequencys" label="Frequentie"></v-select>
      </v-col>
      <v-col>
        <v-text-field v-model="startDate" label="Start Datum" type="date"></v-text-field>
      </v-col>
      <v-col v-if="frequency !== 'enkel'">
        <v-text-field
          v-model="endDate"
          v-if="frequency !== 'enkel'"
          label="Einde Datum"
          type="date"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="time" label="Tijd" type="time"></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      @click="add"
      :disabled="
        garbageType === undefined ||
        action === undefined ||
        startDate === '' ||
        endDate === '' ||
        time === ''
      "
      >Add</v-btn
    >
    <v-btn @click="submit" :disabled="detailedDays.length === 0">Submit</v-btn>
    <v-btn @click="clearAll">Clear All</v-btn>

    <v-spacer></v-spacer>
    <v-slide-group class="pt-4" show-arrows>
      <v-slide-group-item v-for="schedule in summary" :key="schedule.id">
        <v-card variant="flat" class="mx-1">
          <v-card-title> {{ schedule.garbageType }} </v-card-title>
          <div class="pa-4">
            <div><strong>Action:</strong> {{ schedule.action }}</div>
            <div><strong>Start:</strong> {{ schedule.start.toDateString() }}</div>
            <div><strong>End:</strong> {{ schedule.end.toDateString() }}</div>
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

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Day</th>
          <th class="text-left">Vuilnis type</th>
          <th class="text-left">Actie</th>
          <th class="text-left">Tijd</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in detailedDays" :key="day.id">
          <td>{{ day.date.toDateString() }}</td>
          <td>{{ day.garbageType }}</td>
          <td>{{ day.action }}</td>
          <td>{{ day.time }}</td>
          <td>
            <v-icon icon="mdi-cancel" @click="deleteDay(day.id)"></v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
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

const garbageType = ref<string>();
const action = ref<string>();
const startDate = ref("");
const endDate = ref("");
const time = ref("");
const frequency = ref<string>("wekelijks");

//nu nog een string voor het simple te houden
const summary = ref<Array<Schedule>>([]);
const detailedDays = ref<Array<DetailedDay>>([]);

let scheduleCounter = 0;
let dayCounter = 0;

function add() {
  if (garbageType && action && startDate && endDate && time && frequency) {
    if (frequency.value === "enkel") {
      endDate.value = startDate.value;
    }
    const scheduleSummary: Schedule = {
      id: scheduleCounter,
      start: new Date(startDate.value),
      end: new Date(endDate.value),
      garbageType: garbageType.value!,
      action: action.value!,
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
        garbageType: garbageType.value!,
        action: action.value!,
        time: time.value,
      });
    }
    scheduleCounter++;
  }
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
