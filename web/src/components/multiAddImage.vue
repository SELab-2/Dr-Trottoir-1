<template>
  <div>
    <v-list v-for="image in images" :key="image">
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
import AddImage from "../components/addImage.vue";

const images = reactive([1]);
const addMore = () => {
  console.log("hier");
  images.push(1);
};

const remove = (index) => {
  images.splice(index, 1);
};
</script>
