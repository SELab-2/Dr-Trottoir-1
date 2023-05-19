<template>
  <!-- TODO: Container around the card to show the edges a bit more, should be removed in the future -->
  <BorderCard class="mb-3 mx-1 pb-2">
    <v-progress-linear
      absolute
      :model-value="progress()"
      :color="
        progress() === 0 ? 'error' : progress() === 100 ? 'success' : 'warning'
      "
    />
    <!-- Set round name as title -->
    <template v-slot:title>
      {{ roundName }}
      <v-icon
        end
        v-if="amountOfComments !== 0"
        icon="mdi-comment-alert-outline"
        size="small"
      />
    </template>

    <!-- Set student as subtitle -->
    <template v-slot:subtitle>
      <Avatar :name="studentName" size="x-small" />
      {{ studentName }}
    </template>

    <!-- Set progress top right -->
    <template v-slot:append>
      <v-chip
        label
        :color="
          progress() === 0 && !roundStart
            ? 'error'
            : progress() === 100
            ? 'success'
            : 'warning'
        "
      >
        <v-icon
          :icon="
            progress() === 0 && !roundStart
              ? 'mdi-close'
              : progress() === 100
              ? 'mdi-check'
              : 'mdi-progress-clock'
          "
        ></v-icon>
        {{
          progress() === 0 && !roundStart
            ? "Niet begonnen"
            : progress() === 100
            ? "Klaar"
            : "Bezig " + completedBuildings + "/" + totalBuildings
        }}
      </v-chip>
    </template>
    <v-chip label color="brown" class="ml-3">
      <v-icon icon="mdi-office-building"></v-icon>
      {{ totalBuildings }}
    </v-chip>
    <v-chip label color="primary" class="ml-3">
      <v-icon icon="mdi-calendar" class="pr-1" />
      {{ new Date(roundDate).toLocaleDateString("nl") }}
    </v-chip>
    <v-chip v-if="roundStart" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock"></v-icon>
      {{
        new Date(roundStart).toLocaleTimeString("nl", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </v-chip>
    <v-chip v-if="roundEnd" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock-check"></v-icon>
      {{
        new Date(roundEnd).toLocaleTimeString("nl", {
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

const props = defineProps({
  roundName: { type: String, required: true },
  roundStart: {
    type: [String, null] as PropType<string | null>,
    required: true,
  },
  roundEnd: { type: [String, null] as PropType<string | null>, required: true },
  roundDate: { type: String, required: true },
  studentName: { type: String, required: true },
  completedBuildings: { type: Number, required: true },
  totalBuildings: { type: Number, required: true },
  amountOfComments: { type: Number, required: true },
  roundProgress: { type: Number, required: true },
});

// Value which calculates the percentage that will be shown in the progressbar
function progress() {
  return Math.round((props.completedBuildings / props.totalBuildings) * 100);
}
</script>
