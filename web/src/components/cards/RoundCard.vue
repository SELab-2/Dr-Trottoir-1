<template>
  <!-- TODO: Container around the card to show the edges a bit more, should be removed in the future -->
  <BorderCard id="roundcard" class="mb-3 mx-1 pb-2">
    <v-progress-linear
      id="progress"
      absolute
      :model-value="progress()"
      :color="
        progress() === 0 ? 'error' : progress() === 100 ? 'success' : 'warning'
      "
    />
    <!-- Set round name as title -->
    <template v-slot:title>
      {{ filtered.roundName }}
      <v-icon
        end
        id="comments"
        v-if="filtered.amountOfComments !== 0"
        icon="mdi-comment-alert-outline"
        size="small"
      />
    </template>

    <!-- Set student as subtitle -->
    <template v-slot:subtitle>
      <Avatar :name="filtered.studentName" size="x-small" />
      {{ filtered.studentName }}
    </template>

    <!-- Set progress top right -->
    <template v-slot:append>
      <v-chip
        label
        :color="
          progress() === 0 && !filtered.roundStart
            ? 'error'
            : progress() === 100
            ? 'success'
            : 'warning'
        "
      >
        <v-icon
          :icon="
            progress() === 0 && !filtered.roundStart
              ? 'mdi-close'
              : progress() === 100
              ? 'mdi-check'
              : 'mdi-progress-clock'
          "
        ></v-icon>
        {{
          progress() === 0 && !filtered.roundStart
            ? "Niet begonnen"
            : progress() === 100
            ? "Klaar"
            : "Bezig " +
              filtered.completedBuildings +
              "/" +
              filtered.totalBuildings
        }}
      </v-chip>
    </template>
    <v-chip id="buildings" label color="brown" class="ml-3">
      <v-icon icon="mdi-office-building"></v-icon>
      {{ filtered.totalBuildings }}
    </v-chip>
    <v-chip label color="primary" class="ml-3">
      <v-icon icon="mdi-calendar" class="pr-1" />
      {{ new Date(filtered.roundDate).toLocaleDateString() }}
    </v-chip>
    <v-chip v-if="filtered.roundStart" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock"></v-icon>
      {{
        new Date(filtered.roundStart).toLocaleTimeString("nl", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </v-chip>
    <v-chip v-if="filtered.roundEnd" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock-check"></v-icon>
      {{
        new Date(filtered.roundEnd).toLocaleTimeString("nl", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </v-chip>
  </BorderCard>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import Avatar from "@/components/Avatar.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import FilteredSchedule from "@/components/models/FilteredSchedule";

const props = defineProps({
  filtered: { type: Object as PropType<FilteredSchedule>, required: true },
});

// Value which calculates the percentage that will be shown in the progressbar
function progress() {
  return Math.round(
    (props.filtered.completedBuildings / props.filtered.totalBuildings) * 100,
  );
}
</script>
