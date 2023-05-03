<template>
  <CardLayout v-if="entry">
    <div
      style="
        align-items: center;
        display: flex;
        position: relative;
        cursor: pointer;
        gap: 12px;
      "
      class="mt-8 pl-7 pb-8 pr-2"
      @click="
        router.push({
          name: 'building_id',
          params: { id: entry.building.id },
        })
      "
    >
      <div>
        <div class="ml-1">
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
        <div class="d-flex mt-1" v-if="mobile">
          <RoundedButton
            class="mr-1"
            v-if="progress"
            icon="mdi-clock-start"
            :value="
              new Date(progress.arrival).toLocaleTimeString('nl', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @click.stop="() => start()"
          />
          <RoundedButton
            class="ml-1"
            v-if="progress"
            icon="mdi-clock-end"
            :value="
              new Date(progress.departure).toLocaleTimeString('nl', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @click.stop="() => end()"
          />
        </div>
      </div>
      <div class="flex-grow-1"></div>

      <div class="d-flex" v-if="!mobile">
        <RoundedButton
          class="ma-1"
          v-if="progress"
          icon="mdi-clock-start"
          :value="
            new Date(progress.arrival).toLocaleTimeString('nl', {
              hour: '2-digit',
              minute: '2-digit',
            })
          "
          @click.stop="() => start()"
        />
        <RoundedButton
          class="ma-1"
          v-if="progress"
          icon="mdi-clock-end"
          :value="
            new Date(progress.departure).toLocaleTimeString('nl', {
              hour: '2-digit',
              minute: '2-digit',
            })
          "
          @click.stop="() => end()"
        />
      </div>
      <v-icon icon="mdi-chevron-right" />
      <v-btn
        @click.stop="expanded = !expanded"
        :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
        class="dropdown-button"
        variant="text"
      />
    </div>

    <v-expand-transition v-on:click.stop>
      <div v-show="expanded" class="px-8 pb-8">
        <divider-layout class="mb-4"></divider-layout>

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

        <divider-layout class="my-4" />

        <div>
          <h3 class="mb-2">Afbeeldingen</h3>
          <div class="carousel" v-if="progress?.images.length ?? 0 > 0">
            <div
              class="carousel-item"
              v-for="image in progress?.images"
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
            @click="() => addImage()"
          ></RoundedButton>
        </div>
      </div>
    </v-expand-transition>
  </CardLayout>
</template>

<script lang="ts" setup>
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import { ProgressQuery } from "@selab-2/groep-1-query";
import { useAuthStore } from "@/stores/auth";

const props = defineProps(["entry"]);
const progress = ref(props.entry.progress);

const router = useRouter();

const display = useDisplay();
const mobile = display.mobile;

const expanded = ref<Boolean>(false);
const editMode = ref(false);

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
  right: 0
  bottom: 0
  margin-bottom: 0

.timeabsolute
  position: absolute
  top: 0
  right: 0
</style>
