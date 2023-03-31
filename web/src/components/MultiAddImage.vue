<template>
  <v-card>
    <!-- list to show all images -->
    <AddImage
      v-for="id in images"
      :key="id"
      :id="id"
      @delete="
        (id) => {
          remove(id);
        }
      "
      class="mb-4"
    />
    <v-card-actions>
      <v-btn
        block
        @click="addMore"
        prepend-icon="mdi-plus"
        color="primary"
        variant="elevated"
      >
        afbeelding toevoegen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import AddImage from "./AddImage.vue";

const images = reactive([1]);

//add image
const addMore = () => {
  images.push(1);
};

//remove image
const remove = (index: number) => {
  images.splice(index, 1);
};
</script>
