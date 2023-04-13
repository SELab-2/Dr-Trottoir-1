<template>
  <div>
    <HFillWrapper margin="mx-4 mb-4">
      <BorderCard :title="`Inplannen voor ${roundName}`">
        <v-row class="py-0 my-4 mx-2">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0"
            ><v-autocomplete
              prepend-inner-icon="mdi-account"
              label="Student"
              :items="[
                'California',
                'Colorado',
                'Florida',
                'Georgia',
                'Texas',
                'Wyoming',
              ]"
              v-model="student"
              variant="solo"
            ></v-autocomplete></v-col
        ></v-row>
        <v-row class="py-0 my-4 mx-2">
          <v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-select
              prepend-inner-icon="mdi-replay"
              variant="solo"
              label="Frequentie"
              v-model="frequency"
              :items="frequencys"
              @update:model-value="frequencyCheck()"
            ></v-select></v-col
          ><v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0"
            ><div v-if="!multipleday">
              <v-text-field
                prepend-inner-icon="mdi-calendar"
                label="Startdatum"
                variant="solo"
                type="date"
                v-model="startDate"
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between" v-else>
              <v-text-field
                v-model="startDate"
                prepend-inner-icon="mdi-calendar"
                variant="solo"
                class="mr-2"
                type="date"
                label="Startdatum"
              ></v-text-field
              ><v-text-field
                v-model="endDate"
                prepend-inner-icon="mdi-calendar"
                variant="solo"
                class="ml-2"
                type="date"
                label="Einddatum"
              ></v-text-field></div></v-col
          ><v-col cols="3" class="flex-grow-0 flex-shrink-0"
            ><v-text-field
              prepend-inner-icon="mdi-clock-time-two-outline"
              label="Starttijd"
              variant="solo"
              type="time"
              v-model="time"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-card-actions
          ><v-btn prepend-icon="mdi-plus" @click="updateRounds()"
            >Toevoegen</v-btn
          >
          <v-spacer></v-spacer
          ><v-btn prepend-icon="mdi-check"
            >Ronde inplannen</v-btn
          ></v-card-actions
        >
      </BorderCard>
      <RoundSelectCard
        v-for="(round, i) in rounds"
        :key="i"
        @remove="removeFromRounds(i)"
        :name="round.name"
        :date="round.date"
        :time="round.time"
      >
      </RoundSelectCard>
    </HFillWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BorderCard from "@/layouts/CardLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import RoundSelectCard from "@/components/cards/RoundSelectCard.vue";

// TODO: rondenaam opvragen door id en die hierboven invullen, temporary variabele
const roundName = "Ronde zuid";

const student = ref<string>("");
const frequencys = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];
const frequencyDict: Record<string, number> = {
  enkel: 1,
  wekelijks: 7,
  tweewekelijks: 14,
  maandelijks: 28,
};
const startDate = ref<string>(new Date().toISOString().substring(0, 10));
const endDate = ref<string>("");
const time = ref<string>("");
const frequency = ref<string>(frequencys[0]);

const multipleday = ref<boolean>(false);

interface plannedRound {
  date: string;
  name: string;
  time: string;
}

let rounds = ref<plannedRound[]>([]);

function updateRounds() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  let frequencyCount = frequencyDict[frequency.value];
  for (const d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
    rounds.value.push({
      name: student.value,
      date: d.toISOString().substring(0, 10),
      time: time.value,
    });
  }
  startDate.value = "";
  endDate.value = "";
  time.value = "";
}

function frequencyCheck() {
  if (frequency.value == frequencys[0]) {
    multipleday.value = false;
  } else {
    endDate.value = "";
    multipleday.value = true;
  }
}

function removeFromRounds(index: number) {
  rounds.value.splice(index, 1);
}
</script>

<style lang="sass">
.flex
  display: flex
  gap: 20px
</style>
