<template>
  <v-card variant="">
    <!-- list to show all images -->
    <v-card v-for="index in images" :key="index" class="ma-1">
      <AddImage> </AddImage>
      <v-card-actions>
        <v-btn
          @click="remove(index)"
          v-show="index != 0"
          color="error"
          prepend-icon="mdi-delete"
        >
          Verwijder afbeelding
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card-actions>
      <v-btn
        block
        @click="addMore"
        prepend-icon="mdi-plus"
        color="success"
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
