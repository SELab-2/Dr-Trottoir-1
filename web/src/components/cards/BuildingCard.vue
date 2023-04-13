<template>
  <BorderCard
    :clickable="building!.data.length === 1"
    class="mx-1 mb-3"
    @click="
      () => {
        if (building) {
          atClick(building.data[0].date);
        }
      }
    "
  >
    <v-row class="flex-nowrap">
      <v-col cols="2" class="flex-grow-0 flex-shrink-0">
        <!-- The image -->
        <v-img
          cover
          src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
          class="prepend-img"
        />
      </v-col>
      <v-col
        class="flex-grow-1 flex-shrink-0"
        style="min-width: 100px; max-width: 100%"
      >
        <!-- The content -->
        <v-card variant="flat" size="compact">
          <!-- Title -->
          <template v-slot:title>
            {{ building!.name }}
            <v-icon end v-if="comments"> mdi-comment-alert-outline </v-icon>
          </template>
          <!-- Subtitle -->
          <template v-slot:subtitle>
            <Avatar
              :name="building!.syndicus"
              size="x-small"
              :key="building!.syndicus"
            />
            {{ building!.syndicus }} <br />
            <v-chip label color="brown" class="mt-4">
              <v-icon icon="mdi-office-building-marker-outline"></v-icon>
              <p class="ml-2">{{ building!.adres }}</p>
            </v-chip>
          </template>

          <template v-slot:append>
            <!-- Date -->
            <v-chip
              label
              color="blue"
              class="ml-3 align-top"
              v-if="building!.data.length === 1"
            >
              <v-icon icon="mdi-calendar-clock"></v-icon>
              <p class="ml-2">{{ building!.data[0].date }}</p>
            </v-chip>
            <!-- Date expansion button-->
            <v-btn
              @click.stop="expanded = !expanded"
              :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
              class="dropdown-button"
              variant="text"
              v-else
            />
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-expand-transition v-on:click.stop>
      <div v-show="building!.data.length > 1 && expanded">
        <v-divider></v-divider>
        <div class="w-100 px-4 py-2">
          <v-chip
            v-for="(datum, id) of building!.data"
            :key="id"
            label
            class="w-100"
            @click="atClick(datum.date)"
            variant="text"
          >
            <v-icon color="blue" icon="mdi-calendar-clock"></v-icon>
            <p class="ml-2">{{ datum.date }}</p>
            <v-icon end color="black" v-if="datum.comments">
              mdi-comment-alert-outline
            </v-icon>
          </v-chip>
        </div>
      </div>
    </v-expand-transition>
  </BorderCard>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import BorderCard from "@/layouts/CardLayout.vue";

const router = useRouter();

const props = defineProps({
  building: Object,
});

const expanded = ref<Boolean>(false);
const comments = ref<Boolean>(false);

function atClick(date: string) {
  if (props.building) {
    router.push({
      name: "building_id_detail",
      params: { id: props.building.id, date: date },
    });
  }
}
</script>

<style scoped lang="scss">
.prepend-img {
  height: 100%;
}

.dropdown-button {
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.align-top {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
