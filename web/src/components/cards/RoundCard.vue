<template>
  <BorderCard class="mb-3 mx-1 pb-2">
    <v-progress-linear
      absolute
      :model-value="ratio * 100"
      :color="ratio === 0 ? 'error' : ratio ? 'success' : 'warning'"
    />

    <template v-slot:title>
      {{ schedule.round.name }}
    </template>

    <template v-slot:subtitle>
      <Avatar
        :name="schedule.user.first_name + ' ' + schedule.user.last_name"
        size="x-small"
      />
      {{ schedule.user.first_name + " " + schedule.user.last_name }}
    </template>

    <template v-slot:append>
      <v-chip
        label
        :color="ratio === 0 ? 'error' : ratio === 1 ? 'success' : 'warning'"
      >
        <v-icon
          :icon="
            ratio === 0
              ? 'mdi-close'
              : ratio === 1
              ? 'mdi-check'
              : 'mdi-progress-clock'
          "
        ></v-icon>
        {{
          schedule.start === null
            ? "Niet begonnen"
            : schedule.end !== null
            ? "Klaar"
            : "Bezig " +
              progresses.filter((e) => e.departure !== null).length +
              "/" +
              progresses.length
        }}
      </v-chip>
    </template>
    <v-chip label color="brown" class="ml-3">
      <v-icon icon="mdi-office-building"></v-icon>
      {{ schedule.round.buildings.length }}
    </v-chip>

    <v-chip label color="primary" class="ml-3">
      <v-icon icon="mdi-calendar" class="pr-1" />
      {{ new Date(schedule.day).toLocaleDateString("nl") }}
    </v-chip>

    <v-chip v-if="schedule.start" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock"></v-icon>
      {{ new Date(schedule.start).toLocaleTimeString() }}
    </v-chip>

    <v-chip v-if="schedule.end" label color="primary" class="ml-3">
      <v-icon icon="mdi-clock-check"></v-icon>
      {{ new Date(schedule.end).toLocaleTimeString() }}
    </v-chip>

    <v-chip
      v-if="progresses.filter((e) => e.report !== '').length > 0"
      label
      color="gray"
      class="ml-3"
    >
      <v-icon icon="mdi-comment-alert-outline"></v-icon> Opmerkingen
    </v-chip>
  </BorderCard>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ScheduleQuery, Result, ProgressQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { Ref, ref } from "vue";

const props = defineProps<{
  schedule: Result<ScheduleQuery>;
}>();

const progresses: Ref<Array<Result<ProgressQuery>>> = ref([]);

await tryOrAlertAsync(async () => {
  progresses.value = await new ProgressQuery().getAll({
    schedule: props.schedule.id,
  });
});

const ratio =
  progresses.value.filter((e) => e.departure !== null).length /
  progresses.value.length;
</script>
