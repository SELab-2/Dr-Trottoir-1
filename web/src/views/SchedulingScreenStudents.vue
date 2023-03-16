<template>
  <!-- Day cards -->
  <v-card
    v-for="day in days"
    :key="day.name"
    class="mx-4 mt-4"
    :title="day.name"
  >
    <!-- Building cards -->
    <router-link
      v-for="round in day.rounds"
      :key="round.name"
      to="/rondes/detail"
    >
      <v-card
        class="ma-3"
        :title="round.name"

        prepend-icon="mdi-transit-detour"
      >
        <v-progress-linear
          v-if="calculateProgress(round.buildings_done, round.buildings) !== 0"
          absolute
          bottom
          :color="calculateProgress(round.buildings_done, round.buildings) === 100 ? 'success' : 'warning'"
          :model-value="calculateProgress(round.buildings_done, round.buildings)"
        ></v-progress-linear>
        <template v-slot:subtitle>
          {{ round.deadline.getHours() }}:{{
            ("0" + round.deadline.getUTCMinutes()).slice(-2)
          }}
          <v-icon icon="mdi-clock-time-ten-outline"></v-icon>
        </template>

        <template v-slot:append>
          <v-btn
            v-if="calculateProgress(round.buildings_done, round.buildings) === 0"
            color="primary"
          > Start ronde</v-btn>
          <v-chip
            v-else-if="calculateProgress(round.buildings_done, round.buildings) === 100"
            label
            color="success"
          >
            <v-icon icon="mdi-check"></v-icon>
            Klaar
          </v-chip>
          <v-chip
            v-else
            label
            color="warning"
          >
            Bezig {{ round.buildings_done }}/{{ round.buildings }}
          </v-chip>
        </template>
      </v-card>
    </router-link>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const calculateProgress = (done: number, toDo: number) => {
  return Math.round((done/toDo)*100)
}

const days = ref({
  monday: {
    name: "Vandaag",
    rounds: [
      {
        name: "Grote Markt",
        deadline: new Date(2023, 0o2, 0o6, 10, 30),
        buildings: 5,
        buildings_done: 5,
      },
      {
        name: "Vrijdagsmarkt",
        deadline: new Date(2023, 0o2, 0o6, 12, 45),
        buildings: 5,
        buildings_done: 3,
      },
      {
        name: "Overpoort",
        deadline: new Date(2023, 0o2, 0o6, 15, 30),
        buildings: 5,
        buildings_done: 0,
      }
    ],
  },
  tuesday: {
    name: "Morgen",
    rounds: [
      {
        name: "Korenmarkt",
        deadline: new Date(2023, 0o2, 0o6, 10, 0),
        buildings: 5,
        buildings_done: 0,
      }
    ],
  },
  wednesday: {
    name: "Maandag",
    rounds: [
      {
        name: "Overpoort",
        deadline: new Date(2023, 0o2, 0o6, 15, 30),
        buildings: 5,
        buildings_done: 0,
      }
    ],
  },
});
</script>
