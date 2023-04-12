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

    <div class="d-flex flex-row-reverse">
      <v-btn
        class="mx-1"
        variant="plain"
        @click="submit"
        :disabled="detailedDays.length === 0"
        >Versturen</v-btn
      >
      <v-btn
        class="mx-1"
        @click="add"
        variant="plain"
        :disabled="
          garbageType === undefined ||
          action === undefined ||
          startDate === '' ||
          (endDate === '' && frequency !== 'enkel') ||
          time === ''
        "
        >Toevoegen</v-btn
      >
      <v-btn variant="plain" @click="clearAll">Alles verwijderen</v-btn>
    </div>

    <v-spacer></v-spacer>
    <v-slide-group class="pt-4" show-arrows>
      <v-slide-group-item v-for="schedule in summary" :key="schedule.id">
        <v-card color="grey-lighten-1" variant="flat" class="mx-1">
          <template v-slot:title> {{ schedule.garbageType }}</template>
          <template v-slot:append>
            <v-icon color="red" @click="deleteSummary(schedule.id)" icon="mdi-close" />
          </template>
          <div class="pa-4">
            <div><strong>Actie:</strong> {{ schedule.action }}</div>
            <div><strong>Start:</strong> {{ schedule.start.toDateString() }}</div>
            <div><strong>Einde:</strong> {{ schedule.end.toDateString() }}</div>
            <div><strong>Type:</strong> {{ schedule.garbageType }}</div>
            <div><strong>Actie:</strong> {{ schedule.action }}</div>
            <div><strong>Tijd:</strong> {{ schedule.time }}</div>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <v-table v-if="detailedDays.length > 0">
      <thead>
        <tr>
          <th class="text-left">Day</th>
          <th class="text-left">Vuilnis type</th>
          <th class="text-left">Actie</th>
          <th class="text-left">Tijd</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in detailedDays" :key="day.id">
          <td>{{ day.date.toDateString() }}</td>
          <td>{{ day.garbageType }}</td>
          <td>{{ day.action }}</td>
          <td>{{ day.time }}</td>
          <td>
            <v-icon color="red" icon="mdi-close" @click="deleteDay(day.id)"></v-icon>
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
  if (
    !(
      garbageType === undefined ||
      action === undefined ||
      startDate.value === "" ||
      (endDate.value === "" && frequency.value !== "enkel") ||
      time.value === ""
    )
  ) {
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
    let frequencyCount = frequencyDict[frequency.value];
    //elke dag berekenen afhankelijk van de frequentie
    for (let d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
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

    garbageType.value = undefined;
    action.value = undefined;
    startDate.value = "";
    endDate.value = "";
    time.value = "";
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
  clearAll();
}

function clearAll() {
  summary.value = [];
  detailedDays.value = [];
}

function deleteDay(id: number) {
  detailedDays.value = detailedDays.value.filter((day) => day.id !== id);
}
</script>
