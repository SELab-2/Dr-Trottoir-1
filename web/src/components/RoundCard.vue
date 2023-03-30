<template>
  <!-- TODO: Container around the card to show the edges a bit more, should be removed in the future -->
  <v-card class="mb-3 mx-1 pb-2">
    <v-progress-linear
      absolute
      :model-value="progress()"
      :color="
        progress() === 0 ? 'error' : progress() === 100 ? 'success' : 'warning'
      "
    />
    <!-- Set round name as title -->
    <template v-slot:title>
      {{ round_name }}
      <v-icon end v-if="round_comments" class=""
        >mdi-comment-alert-outline</v-icon
      >
    </template>

    <!-- Set student as subtitle -->
    <template v-slot:subtitle>
      <Avatar :name="student_name" size="x-small" />
      {{ student_name }}
    </template>

    <!-- Set progress top right -->
    <template v-slot:append>
      <v-chip
        label
        :color="
          progress() === 0
            ? 'error'
            : progress() === 100
            ? 'success'
            : 'warning'
        "
      >
        <v-icon
          :icon="
            progress() === 0
              ? 'mdi-close'
              : progress() === 100
              ? 'mdi-check'
              : 'mdi-progress-clock'
          "
        ></v-icon>
        {{
          progress() === 0
            ? "Niet begonnen"
            : progress() === 100
            ? "Klaar"
            : "Bezig " + building_index + "/" + total_buildings
        }}
      </v-chip>
    </template>
    <v-chip label color="brown" class="ml-3">
      <v-icon icon="mdi-office-building"></v-icon>
      {{ total_buildings }}
    </v-chip>
    <v-chip label color="primary" class="ml-3">
      <v-icon icon="mdi-clock"></v-icon> {{ round_start }}
    </v-chip>
    <v-chip v-if="round_end" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock-check"></v-icon> {{ round_end }}
    </v-chip>
  </v-card>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";

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
function progress() {
  return Math.round((props.building_index / props.total_buildings) * 100);
}
</script>
