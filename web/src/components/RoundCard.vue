<template>
  <!-- TODO: Container around the card to show the edges a bit more, should be removed in the future -->
  <v-card class="d-flex align-center justify-center mb-6" height="160px">
    <v-list class="ma-2 pa-2 me-auto">
      <!-- All the basic information of a round, used v-card titles and subtitles -->
      <v-card-title
        >{{ round_name }}
        <v-icon end v-if="round_comments" class="">mdi-comment-alert</v-icon>
      </v-card-title>
      <v-card-subtitle>
        <v-icon icon="mdi-account"></v-icon>{{ student_name }}
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-card-subtitle>
        <v-icon icon="mdi-office-building"></v-icon
        >{{ total_buildings }} gebouwen
      </v-card-subtitle>
      <v-card-subtitle class="align-center">
        <v-icon icon="mdi-clock"></v-icon> {{ time_description }}
      </v-card-subtitle>
      <v-card-subtitle class="align-center" v-if="round_end">
        <v-icon icon="mdi-clock-check"></v-icon> Beëindigd om {{ round_end }}
      </v-card-subtitle>
    </v-list>

    <!-- The progress bar at the right hand side of the screen -->
    <v-progress-circular
      class="ma-2 pa-2"
      :rotate="360"
      :size="100"
      :width="8"
      :model-value="progress"
      color="#777799"
    >
      {{ building_index }}/{{ total_buildings }}
    </v-progress-circular>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// TODO: maybe too much props to give to a component, could be changed to an object in the future
// Default props for this component
const props = defineProps({
  round_name: String,
  round_start: String,
  round_end: String,
  student_name: String,
  round_started: { type: Boolean, required: true },
  total_buildings: { type: Number, required: true },
  building_index: { type: Number, required: true },
  round_comments: { type: Boolean, default: false },
});

// Value which calculates the percentage that will be shown in the progressbar
const progress = ref(
  Math.round((props.building_index / props.total_buildings) * 100),
);

// The description of the timeslot will be calculated inside this value
const time_description = ref(
  props.round_started
    ? `Begonnen om ${props.round_start}`
    : `Start op ${props.round_start}`,
);
</script>
