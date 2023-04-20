<template>
  <CardLayout class="pa-8" v-if="entry">
    <div
      style="align-items: center; display: flex; cursor: pointer; gap: 12px"
      @click="
        router.push({
          name: 'building_id',
          params: { id: entry.building.id },
        })
      "
    >
      <div>
        <h2>{{ entry.building.name }}</h2>
        <p>
          {{ entry.building.address.street }}
          {{ entry.building.address.number }}
        </p>
        <p>
          {{ entry.building.address.zip_code }}
          {{ entry.building.address.city }}
        </p>
      </div>
      <div class="flex-grow-1"></div>
      <div class="d-flex" v-if="!mobile">
        <!-- TODO make also visible on mobile -->
        <RoundedButton
          class="mx-1"
          v-if="entry.progress"
          icon="mdi-clock-start"
          :value="
            new Date(entry.progress.arrival).toLocaleTimeString('nl', {
              hour: '2-digit',
              minute: '2-digit',
            })
          "
        ></RoundedButton>
        <RoundedButton
          class="mx-1"
          v-if="entry.progress"
          icon="mdi-clock-end"
          :value="
            new Date(entry.progress.departure).toLocaleTimeString('nl', {
              hour: '2-digit',
              minute: '2-digit',
            })
          "
        ></RoundedButton>
      </div>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </div>

    <v-btn
      @click.stop="expanded = !expanded"
      :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
      class="dropdown-button"
      variant="text"
    />
  </CardLayout>
  <v-expand-transition v-on:click.stop>
    <div v-show="expanded">
      <CardLayout class="pa-8 pb-0 space-y">
        <div v-if="entry.progress?.report">
          <div style="display: flex; align-items: center">
            <h3 class="mb-2">Notities</h3>
            <div class="flex-grow-1"></div>
          </div>
          <p>{{ entry.progress.report }}</p>
          <RoundedButton
            icon="mdi-pencil"
            value="Bewerken"
            class="mt-4"
          ></RoundedButton>
        </div>
        <divider-layout v-if="entry.progress?.report"></divider-layout>

        <div>
          <h3 class="mb-2">Afbeeldingen</h3>
          <div class="carousel" v-if="entry.progress?.images.length ?? 0 > 0">
            <div
              class="carousel-item"
              v-for="image in entry.progress?.images"
              :key="image.id"
            >
              <img
                src="https://unsplash.com/photos/u_khkgVDmxA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFzZW1lbnR8ZW58MHx8fHwxNjgxNzA5NzIx&force=true&w=640"
                alt="opvolgfoto"
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
          ></RoundedButton>
        </div>
      </CardLayout>
    </div>
  </v-expand-transition>
</template>

<script lang="ts" setup>
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { ref } from "vue";

defineProps(["entry"]);

const router = useRouter();

const display = useDisplay();
const mobile = display.mobile;

const expanded = ref<Boolean>(false);
</script>

<style scoped lang="sass">
.space-y
  & > *
    margin-bottom: 24px


.carousel
  img
    width: 100%
    aspect-ratio: 1
    border-radius: 5px
    overflow: clip
    object-fit: cover

  display: grid
  @media (min-width: 1000px)
    grid-template-columns: repeat(3, minmax(0, 1fr))
  @media (min-width: 500px) and (max-width: 1000px)
    grid-template-columns: repeat(2, minmax(0, 1fr))
  @media (max-width: 500px)
    grid-template-columns: repeat(1, minmax(0, 1fr))
  gap: 24px

.dropdown-button
  position: absolute
  bottom: 0
  right: 3px
  margin-bottom: 0
</style>
