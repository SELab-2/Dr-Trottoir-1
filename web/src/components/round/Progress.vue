<template>
  <CardLayout class="pa-8 pb-0 space-y">
    <div style="align-items: center; display: flex; cursor: pointer; gap: 12px">
      <div
        @click="
          router.push({ name: 'building_id', params: { id: building.id } })
        "
      >
        <h2>{{ building.name }}</h2>
        <p>
          {{ building.address.street }}
          {{ building.address.number }}
        </p>
        <p>
          {{ building.address.zip_code }}
          {{ building.address.city }}
        </p>
      </div>
      <div class="flex-grow-1"></div>

      <RoundedButton
        v-if="progress"
        icon="mdi-clock-start"
        :value="
          progress.arrival
            ? new Date(progress.arrival).toLocaleTimeString()
            : 'Start'
        "
        @click="() => start()"
      ></RoundedButton>
      <RoundedButton
        v-if="progress"
        icon="mdi-clock-end"
        :value="
          progress.departure
            ? new Date(progress.departure).toLocaleTimeString()
            : 'Einde'
        "
        @click="() => end()"
      ></RoundedButton>

      <v-icon
        icon="mdi-chevron-right"
        @click="
          router.push({ name: 'building_id', params: { id: building.id } })
        "
      ></v-icon>
    </div>

    <divider-layout></divider-layout>

    <div>
      <h3 class="mb-2">Notities</h3>
      <p v-if="!editMode">{{ progress?.report }}</p>
      <!-- eslint-disable-next-line vue/no-mutating-props -->
      <v-text-field
        type="text"
        v-else
        v-model="progress.report"
        style="margin-bottom: -20px"
      ></v-text-field>
      <RoundedButton
        v-if="editMode"
        icon="mdi-check"
        value="Opslaan"
        class="mt-4"
        @click="() => report()"
      ></RoundedButton>
      <RoundedButton
        v-else-if="progress?.report !== ''"
        icon="mdi-pencil"
        value="Bewerken"
        class="mt-4"
        @click="() => (editMode = !editMode)"
      ></RoundedButton>
      <RoundedButton
        v-else
        icon="mdi-plus"
        value="Toevoegen"
        class="mt-4"
        @click="() => (editMode = !editMode)"
      ></RoundedButton>
    </div>

    <divider-layout></divider-layout>

    <div>
      <h3 class="mb-2">Afbeeldingen</h3>
      <div class="carousel" v-if="progress?.images.length ?? 0 > 0">
        <div
          class="carousel-item"
          v-for="image in progress.images"
          :key="image.id"
        >
          <img
            src="https://unsplash.com/photos/u_khkgVDmxA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFzZW1lbnR8ZW58MHx8fHwxNjgxNzA5NzIx&force=true&w=640"
          />
          <p style="font-weight: 700; font-size: 14px" class="mt-2">
            {{ image.type }}
          </p>
          <p style="opacity: 90%">{{ image.description }}</p>
        </div>
      </div>
      <p v-else style="opacity: 75%">Geen foto's toegevoegd.</p>
      <RoundedButton
        icon="mdi-plus"
        value="Toevoegen"
        class="mt-4"
        @click="() => addImage()"
      ></RoundedButton>
    </div>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ProgressQuery, Result } from "@selab-2/groep-1-query";
import { Prisma } from "@selab-2/groep-1-orm";
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import { ref, watchEffect } from "vue";
import { tryOrAlertAsync } from "@/try";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
  progress: Result<ProgressQuery>;
  building: Prisma.BuildingGetPayload<{
    select: {
      id: boolean;
      name: boolean;
      ivago_id: boolean;
      deleted: boolean;
      hash: boolean;
      address: boolean;
    };
  }>;
}>();

const editMode = ref(false);
const progress = ref(props.progress);
watchEffect(() => (progress.value = props.progress));

function report() {
  tryOrAlertAsync(async () => {
    progress.value = await new ProgressQuery().updateOne({
      id: progress.value.id,
      report: progress.value.report,
    });
    editMode.value = !editMode.value;
  });
}

function start() {
  tryOrAlertAsync(async () => {
    progress.value = await new ProgressQuery().updateOne({
      id: progress.value.id,
      arrival: new Date(),
    });
  });
}

function end() {
  tryOrAlertAsync(async () => {
    progress.value = await new ProgressQuery().updateOne({
      id: progress.value.id,
      departure: new Date(),
    });
  });
}

function addImage() {
  tryOrAlertAsync(async () => {
    progress.value = await new ProgressQuery().createImage(progress.value.id, {
      location: "EXTERNAL",
      description: "Net aangemaakt",
      path: "/",
      time: new Date(),
      type: "GARBAGE",
      user_id: useAuthStore().auth?.id ?? -1,
    });
  });
}
</script>

<style scoped lang="sass">
.carousel
  img
    width: 100%
    aspect-ratio: 1
    border-radius: 5px
    overflow: clip
    object-fit: cover

  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 24px

  @media (min-width: 500px) and (max-width: 800px)
    grid-template-columns: repeat(2, minmax(0, 1fr))

  @media (max-width: 500px)
    grid-template-columns: repeat(1, minmax(0, 1fr))

.space-y
  & > *
    margin-bottom: 24px
</style>
