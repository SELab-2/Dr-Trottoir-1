<template>
  <div v-if="building">
    <v-card
      class="mt-3 mx-1"
      @click="
        () => {
          if (building && building.data.length === 1) {
            atClick(building.data[0].date);
          }
        }
      "
    >
      <template v-slot:prepend>
        <v-img
          cover
          src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
          class="prepend-img"
        />
      </template>
      <template v-slot:title>
        {{ building.name }}
        <v-icon end v-if="comments"> mdi-comment-alert-outline </v-icon>
      </template>
      <template v-slot:subtitle>
        <Avatar
          :name="building.syndicus"
          size="x-small"
          :key="building.syndicus"
        />
        {{ building.syndicus }} <br />
        <v-chip label color="brown" class="mt-4">
          <v-icon icon="mdi-office-building-marker-outline"></v-icon>
          <p class="ml-2">{{ building.adres }}</p>
        </v-chip>
      </template>
      <template v-slot:append>
        <v-chip
          label
          color="blue"
          class="ml-3 align-top"
          v-if="building.data.length === 1"
        >
          <v-icon icon="mdi-calendar-clock"></v-icon>
          <p class="ml-2">{{ building.data[0].date }}</p>
        </v-chip>
        <v-icon
          @click="expanded = !expanded"
          :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
          class="dropdown-button"
          v-else
        />
      </template>
    </v-card>
    <div v-if="building.data.length > 1 && expanded">
      <div
        v-for="(datum, id) of building.data"
        :key="id"
        class="w-100 px-2 pt-1"
      >
        <v-chip label color="black" class="w-100" @click="atClick(datum.date)">
          <v-icon color="blue" icon="mdi-calendar-clock"></v-icon>
          <p class="ml-2">{{ datum.date }}</p>
          <v-icon end color="black" v-if="datum.comments">
            mdi-comment-alert-outline
          </v-icon>
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  building: Object,
});

const expanded = ref<Boolean>(false);
const comments = ref<Boolean>(false);

function atClick(date: string) {
  if (props.building) {
    router.push({
      name: "Gebouw detail",
      params: { id: props.building.id, date: date },
    });
  }
}
</script>

<style scoped lang="scss">
.prepend-img {
  aspect-ratio: 1;
  width: 105px;
  border-radius: 5px;
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
