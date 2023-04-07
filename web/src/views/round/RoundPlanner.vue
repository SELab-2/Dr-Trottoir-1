<template>
  <v-container fluid>
    <v-card>
      <v-card-actions>
        <v-select
          variant="solo"
          label="Selecteer type week"
          v-model="selectedWeek"
          :items="['Even', 'Oneven']"
        ></v-select>
        <v-spacer></v-spacer>
        <v-select
          variant="solo"
          label="Selecteer student"
          v-model="selectedStudent"
          :items="['Jonathan', 'Oscar', 'Pol', 'Annemie']"
        ></v-select>
        <v-spacer></v-spacer>
        <VueDatePicker
          class="date-select"
          v-model="selectedDate"
          :enable-time-picker="false"
          input-class-name="v-field__input"
          :format="format"
        ></VueDatePicker>
      </v-card-actions>

      <v-container fluid>
        <v-card title="Rondes">
          <v-card-actions>
            <v-select
              variant="solo"
              v-model="selectedRound"
              label="Aangemaakte rondes"
              :items="rounds"
            ></v-select>
            <v-spacer></v-spacer>

            <v-btn
              :to="{ name: 'round_new' }"
              v-if="selectedRound"
              prepend-icon="mdi-pencil"
              color="primary"
              >Bewerk ronde</v-btn
            >
          </v-card-actions>
          <v-list v-if="selectedRound">
            <v-list-item v-for="building in buildings" :key="building.name">
              <template v-slot:prepend>
                <v-icon icon="mdi-office-building"></v-icon>
              </template>
              <v-list-item-title>{{ building.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ building.adress }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
      <v-spacer></v-spacer>
      <v-card-actions class="">
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-cancel" color="error">Annuleren</v-btn>
        <v-btn prepend-icon="mdi-check" color="primary">Ronde opslaan</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";

const selectedWeek = ref("");
const selectedStudent = ref("");
const selectedDate = ref("");
const selectedRound = ref("");

const format = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const rounds = ref(["Gent Zuid", "Station", "Koremarkt"]);

const buildings = ref([
  { adress: "Lange Violettestraat 50", name: "Upkot" },
  { adress: "Vlaanderenstraat 4", name: "Appartement 21" },
  { adress: "Zuidstraat 2", name: "Shopping Gent Zuid" },
  { adress: "Krookstraat 345", name: "De krook" },
]);
</script>

<style>
.date-select {
  margin-left: 10%;
  width: 20%;
}
</style>
