<template>
  <CardLayout
    v-if="schedule"
    class="building-card"
    @click="
      router.push({
        name: 'round_detail',
        params: { id: schedule.round_id, schedule: schedule.id },
      })
    "
  >
    <div>
      <h3>{{ new Date(schedule?.day).toLocaleDateString("nl") }}</h3>
      <p>{{ schedule.user.first_name }} {{ schedule?.user.last_name }}</p>
    </div>
    <div class="flex-grow-1"></div>
    <!-- Amount of images taken indicator -->
    <v-chip
      color="border"
      variant="outlined"
      v-show="getImagesAmount(progress) !== 0"
    >
      <v-icon icon="mdi-image-outline" class="mr-1" color="black"/>
      <p class="text-black">{{ getImagesAmount(progress) }}</p>
    </v-chip>

    <!-- Amount of comments made indicator -->
    <v-chip
      color="border"
      variant="outlined"
      v-show="getCommentsAmount(progress) !== 0"
    >
      <v-icon icon="mdi-comment-outline" class="mr-1" color="black"/>
      <p class="text-black">{{ getCommentsAmount(progress) }}</p>
    </v-chip>

    <!-- Active round indication -->
    <v-chip
      color="yellow-darken-3"
      variant="outlined"
      v-show="roundStarted(progress) && getCompletedBuildings(progress) !== progress.length"
    >
      <v-icon icon="mdi-bicycle-cargo" class="mr-1"/>
      Actief
    </v-chip>

    <!-- Done round indication -->
    <v-chip
      color="success"
      variant="outlined"
      v-show="getCompletedBuildings(progress) === progress.length"
    >
      <v-icon icon="mdi-check" class="mr-1" />
      Klaar
    </v-chip>

    <v-icon
      icon="mdi-chevron-right"
      @click="
        router.push({
          name: 'round_detail',
          params: { id: schedule.round_id, schedule: schedule.id },
        })
      "
    ></v-icon>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import {ProgressQuery, Result, ScheduleQuery} from "@selab-2/groep-1-query";
import {ref, Ref} from "vue";
import {tryOrAlertAsync} from "@/try";
import {getCommentsAmount, getCompletedBuildings, getImagesAmount, roundStarted} from "@/assets/scripts/roundProgress";

const props = defineProps<{
  schedule: Result<ScheduleQuery>;
}>();

const progress: Ref<Array<Result<ProgressQuery>>> = ref([]);

tryOrAlertAsync(async () => {
  progress.value = await new ProgressQuery().getAll({
    schedule: props.schedule.id
  });
  console.log(progress.value);
});


</script>

<style lang="sass">
.space-y-8
  & > *
    margin-bottom: 8px

.building-card
  padding: 16px 0 16px 16px
  display: flex
  align-items: center
  gap: 16px
</style>
