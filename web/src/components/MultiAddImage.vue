<template>
  <div>
    <!-- list to show all images -->
    <v-list v-for="index in images" :key="index">
      <v-card>
        <v-card-item>
          <AddImage> </AddImage>
          <div class="d-flex justify-end">
            <button type="button" @click="remove(index)" v-show="index != 0">
              Remove
            </button>
          </div>
        </v-card-item>
      </v-card>
    </v-list>

    <v-btn block variant="outlined" @click="addMore">
      afbeelding toevoegen
    </v-btn>
  </div>
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
