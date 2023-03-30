<template>
  <HFillWrapper>
      <v-card
        v-for="day in days"
        :key="day.name"
        :title="day.name"
        variant="flat"
      >
        <template v-slot:append>
          <v-chip
            label
            prepend-icon="mdi-calendar-month-outline"
            variant="text"
          >
            {{ day.rounds[0].deadline.getDate() }}
            {{ formatter.format(day.rounds[0].deadline) }}
          </v-chip>
        </template>
        <!-- Round cards -->
        <router-link
          v-for="round in day.rounds"
          :key="round.name"
          to="/rondes/detail"
        >
          <v-card
            class="mb-3 mx-1"
            :title="round.name"
            prepend-icon="mdi-transit-detour"
          >
            <!-- Time -->
            <template v-slot:subtitle>
              {{ round.deadline.getHours() }}:{{
                ("0" + round.deadline.getUTCMinutes()).slice(-2)
              }}
              <v-icon icon="mdi-clock-time-ten-outline"></v-icon>
            </template>

            <!-- Status -->
            <template v-slot:append>
              <v-btn
                v-if="
                  calculateProgress(round.buildings_done, round.buildings) === 0
                "
                color="primary"
                @click="snackbar = !snackbar"
                v-on:click.prevent
                :variant="
                  round.name == 'Sterre' || round.name == 'Korenmarkt'
                    ? 'flat'
                    : 'elevated'
                "
                :disabled="round.name == 'Sterre' || round.name == 'Korenmarkt'"
              >
                Start ronde</v-btn
              >
              <v-chip
                v-else-if="
                  calculateProgress(round.buildings_done, round.buildings) ===
                  100
                "
                label
                color="success"
              >
                <v-icon icon="mdi-check"></v-icon>
                Klaar
              </v-chip>
              <v-chip v-else label color="warning">
                Bezig {{ round.buildings_done }}/{{ round.buildings }}
              </v-chip>
            </template>
          </v-card>
        </router-link>

        <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
        <v-overlay v-model="snackbar">
          <v-snackbar
            v-model="snackbar"
            timeout="-1"
            elevation="24"
            color="white"
          >
            <v-card prepend-icon="mdi-exclamation" variant="flat">
              <template v-slot:title> Start ronde </template>
              <p class="mx-3">
                Je staat op het punt een ronde te starten. Het huidige tijdstip
                zal opgeslagen worden als start tijdstip. Ben je zeker dat je de
                ronde wilt starten?
              </p>
              <div class="d-flex flex-row-reverse ma-3">
                <router-link to="/rondes/detail">
                  <v-btn color="success"> Start ronde </v-btn>
                </router-link>

                <v-btn @click="snackbar = false" color="error" class="mr-3">
                  Annuleer
                </v-btn>
              </div>
            </v-card>
          </v-snackbar>
        </v-overlay>
      </v-card>
    </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HFill from "@/components/HFill.vue";
import HFillWrapper from "@/components/HFillWrapper.vue";

// https://stackoverflow.com/questions/1643320/get-month-name-from-date
const formatter = new Intl.DateTimeFormat("nl", { month: "long" });

const snackbar = ref(false);

const calculateProgress = (done: number, toDo: number) => {
  return Math.round((done / toDo) * 100);
};

const days = ref({
  monday: {
    name: "Vandaag",
    rounds: [
      {
        name: "Grote Markt",
        deadline: new Date(2023, 2, 6, 10, 30),
        buildings: 5,
        buildings_done: 5,
      },
      {
        name: "Vrijdagsmarkt",
        deadline: new Date(2023, 2, 6, 12, 45),
        buildings: 5,
        buildings_done: 3,
      },
      {
        name: "Overpoort",
        deadline: new Date(2023, 2, 6, 15, 30),
        buildings: 5,
        buildings_done: 0,
      },
    ],
  },
  tuesday: {
    name: "Morgen",
    rounds: [
      {
        name: "Korenmarkt",
        deadline: new Date(2023, 2, 7, 10, 0),
        buildings: 5,
        buildings_done: 0,
      },
    ],
  },
  wednesday: {
    name: "Maandag",
    rounds: [
      {
        name: "Sterre",
        deadline: new Date(2023, 2, 8, 15, 30),
        buildings: 5,
        buildings_done: 0,
      },
    ],
  },
});
</script>
