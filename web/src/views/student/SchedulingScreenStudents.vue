<template>
  <HFillWrapper>
    <!-- Day cards-->
    <v-card
      v-for="day in days"
      :key="day.name"
      :title="day.name"
      variant="flat"
      color="background"
    >
      <template v-slot:append>
        <v-chip label prepend-icon="mdi-calendar-month-outline" variant="text">
          {{ day.rounds[0].deadline.getDate() }}
          {{ formatter.format(day.rounds[0].deadline) }}
        </v-chip>
      </template>
      <!-- Round cards -->
      <BorderCard
        v-for="round in day.rounds"
        :key="round.name"
        class="mb-3 mx-1"
        :title="round.name"
        prepend-icon="mdi-transit-detour"
        @click="redirect_to_detail()"
      >
        <!-- Time -->
        <template v-slot:subtitle>
          <v-chip
            label
            prepend-icon="mdi-clock-time-ten-outline"
            variant="text"
            size="compact"
          >
            {{ round.deadline.getHours() }}:{{
              ("0" + round.deadline.getUTCMinutes()).slice(-2)
            }}
          </v-chip>
        </template>

        <!-- Status -->
        <template v-slot:append>
          <v-btn
            v-if="
              calculateProgress(round.buildings_done, round.buildings) === 0
            "
            color="primary"
            v-on:click.stop="snackbar = !snackbar"
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
              calculateProgress(round.buildings_done, round.buildings) === 100
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
      </BorderCard>

      <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
      <v-overlay v-model="snackbar">
        <v-snackbar
          v-model="snackbar"
          timeout="-1"
          elevation="24"
          color="background"
        >
          <StartRoundPopupContent
            :oncancel="() => (snackbar = false)"
            :onsubmit="() => redirect_to_detail()"
          />
        </v-snackbar>
      </v-overlay>
    </v-card>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import { useRouter } from "vue-router";
import StartRoundPopupContent from "@/components/popups/StartRoundPopupContent.vue";
import BorderCard from "@/components/cards/BorderCard.vue";

// the router constant
const router = useRouter();

function redirect_to_detail() {
  router.push({ name: "round_detail", params: { id: 0 } });
}

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
