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
        v-if="comments"
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
      {{ roundDate.toLocaleDateString("nl") }}
    </v-chip>
    <v-chip v-if="roundStart" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock"></v-icon> {{ roundStart.toLocaleTimeString() }}
    </v-chip>
    <v-chip v-if="roundEnd" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock-check"></v-icon> {{ roundEnd.toLocaleTimeString() }}
    </v-chip>
  </BorderCard>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue";
import Avatar from "@/components/Avatar.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { getCompletedBuildings, getCommentsAmount } from "@/assets/scripts/roundProgress"

const props = defineProps({
  schedule: {type: Object as PropType<Result<ScheduleQuery>>, required: true},
});

console.log(props.schedule)

const progresses = ref<Result<ProgressQuery>[]>([])

await tryOrAlertAsync(async () => {
  progresses.value = await new ProgressQuery().getAll({schedule: props.schedule.id})
})

const roundName = props.schedule.round.name
const roundStart = props.schedule.start? new Date(props.schedule.start) : null
const roundEnd = props.schedule.end? new Date(props.schedule.end) : null
const roundDate = new Date(props.schedule.day)
const studentName = props.schedule.user.first_name

const completedBuildings = getCompletedBuildings(progresses.value)
const totalBuildings = progresses.value.length
const comments = getCommentsAmount(progresses.value) === 0


// Value which calculates the percentage that will be shown in the progressbar
function progress() {
  return Math.round((completedBuildings / totalBuildings) * 100);
}
</script>
