<template>
  <div>
    <v-btn @click="addMore"> Add More </v-btn>
    <v-list v-for="image in images" :key="image">
      <AddImage> </AddImage>
      <button type="button" @click="remove(index)" v-show="index != 0">
        Remove
      </button>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
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

