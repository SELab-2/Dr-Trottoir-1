<template>
  <div>
    <v-select v-model="garbageType" :items="garbageTypes" label="Garbage Type"></v-select>
    <v-select v-model="action" :items="actions" label="Action"></v-select>
    <v-text-field v-model="startDate" label="Start Date" type="date"></v-text-field>
    <v-text-field v-model="endDate" label="End Date" type="date"></v-text-field>
    <v-select v-model="day" :items="days" label="Day"></v-select>
    <v-text-field v-model="time" label="Time" type="time"></v-text-field>

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
        <v-list-item-title>{{ day.details }}</v-list-item-title>
        <v-btn @click="deleteDay(day.id)">Delete</v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const garbageTypes = ['REST', 'PMD', 'GFT',"Papier"];
const actions = ['buiten zetten', 'binnen halen'];
const days = ['Maanday', 'Dinsdag', 'Donderdag'];

const garbageType = ref('');
const action = ref('');
const startDate = ref('');
const endDate = ref('');
const day = ref('');
const time = ref('');

//nu nog een string voor het simple te houden
const summary = ref<Array<{ id: number; summary: string }>>([]);
const detailedDays = ref<Array<{ id: number; details: string }>>([]);

let idCounter = 0;

function add() {
  const scheduleSummary = {
    id: idCounter++,
    summary: `${startDate.value} - ${endDate.value}, ${garbageType.value}, ${time.value}, ${action.value}`,
    start: new Date(startDate.value),
    end: new Date(endDate.value),
    day: day.value,
  };
  summary.value.push(scheduleSummary);

  // Calculate all separate days
  // simple version
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const oneDay = 24 * 60 * 60 * 1000;

  for (let d = start; d <= end; d.setTime(d.getTime() + oneDay)) {
    if (days[d.getDay()] === day.value) {
      detailedDays.value.push({
        id: idCounter++,
        details: `${d.toISOString().slice(0, 10)}, ${garbageType.value}, ${time.value}, ${action.value}`,
      });
    }
  }
}

function deleteSummary(id: number) {
  console.log("delete");
}


function submit() {
  console.log('All days:');
  detailedDays.value.forEach(day => console.log(day.details));
}

function clearAll() {
  summary.value = [];
  detailedDays.value = [];
}

function deleteDay(id: number) {
  detailedDays.value = detailedDays.value.filter(day => day.id !== id);
}

</script>