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
      @uploaded="(file) => addFile(id, file)"
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
import { reactive, ref } from "vue";
import AddImage from "./AddImage.vue";
const images = ref([0]);
const imageMap = ref<Map<Number, File | null>>(new Map());

//add image
const addMore = () => {
  images.value.push(images.value.length);
};
//remove image
const remove = (id: number) => {
  const index = images.value.indexOf(id);
  images.value.splice(index, 1);

  const file = imageMap.value.get(index);
  if (file) {
    imageMap.value.delete(index);
  }
};

const addFile = (id: number, file: File) => {
  imageMap.value.set(id, file);
};
</script>
