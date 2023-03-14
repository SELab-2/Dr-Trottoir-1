<template>
  <v-container style="background: ##fafafa">
    <v-card class="d-flex align-center justify-center mb-6" height="160px">
      <v-card></v-card>
      <v-card></v-card>
      <v-card></v-card>

      <v-list class="ma-2 pa-2 me-auto">
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
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";

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

const progress = ref(
  Math.round((props.building_index / props.total_buildings) * 100),
);

const time_description = ref(
  props.round_started
    ? `Begonnen om ${props.round_start}`
    : `Start op ${props.round_start}`,
);
</script>
