<template>
  <div>
    <HFillWrapper margin="mx-4 mb-4">
      <RoundedButton
        icon="mdi-arrow-left"
        value="Terugkeren"
        class="mb-4"
        @click="() => router.push({ name: 'building_id', params: { id: 0 } })"
      ></RoundedButton>

      <h2>Afvalkalender</h2>

      <p class="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>

      <div class="flex">
        <v-select
          v-model="garbageType"
          :items="garbageTypes"
          label="Garbage Type"
        ></v-select>
        <v-select v-model="action" :items="actions" label="Actie"></v-select>
        <v-select
          v-model="frequency"
          :items="frequenties"
          label="Frequentie"
        ></v-select>
      </div>

      <div class="flex">
        <v-text-field
          v-model="startDate"
          label="Start Datum"
          type="date"
        ></v-text-field>
        <v-text-field
          v-model="endDate"
          v-if="frequency !== 'enkel'"
          label="Einde Datum"
          type="date"
        ></v-text-field>
        <v-text-field v-model="time" label="Tijd" type="time"></v-text-field>
      </div>

      <div class="flex">
        <v-btn
          prepend-icon="mdi-check"
          variant="tonal"
          @click="submit"
          :disabled="detailedDays.length === 0"
          >Inplannen</v-btn
        >
        <v-btn
          prepend-icon="mdi-plus-circle"
          @click="add"
          variant="tonal"
          :disabled="
            garbageType === undefined ||
            action === undefined ||
            startDate === '' ||
            (endDate === '' && frequency !== 'enkel') ||
            time === ''
          "
          >Toevoegen</v-btn
        >
        <v-btn prepend-icon="mdi-delete" variant="tonal" @click="clearAll"
          >Alles verwijderen</v-btn
        >
      </div>
    </HFillWrapper>

    <Table
      v-bind:entries="detailedDays"
      v-bind:headers="GarbageTable.headers()"
    ></Table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import Table from "@/components/table/Table.vue";
import { DetailedDay } from "@/types/GarbageTable";
import { GarbageTable } from "@/types/GarbageTable";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";

const garbageTypes = ["REST", "PMD", "GFT", "Papier"];
const actions = ["buiten zetten", "binnen halen"];
const frequenties = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];

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
const detailedDays = ref<Array<DetailedDay | null>>([]);

let dayCounter = 0;

function add() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  let frequencyCount = frequencyDict[frequency.value];

  for (const d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
    detailedDays.value.push({
      id: dayCounter++,
      date: new Date(d),
      garbageType: garbageType.value!,
      action: action.value!,
      time: time.value,
    });
  }

  garbageType.value = undefined;
  action.value = undefined;
  startDate.value = "";
  endDate.value = "";
  time.value = "";
}

function submit() {
  // TODO: upload to server
  clearAll();
}

function clearAll() {
  while (detailedDays.value.length > 0) {
    detailedDays.value.pop();
  }
}
</script>

<style lang="sass">
.flex
  display: flex
  gap: 20px
</style>
