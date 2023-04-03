<template>
  <img v-if="img" alt="imagecard" class="image" :src="img" />
  <v-card v-else class="image">
    <v-card-item class="textcard">
      <div style="display: flex; justify-content: center">
        <v-icon v-if="titleIcon" color="#333333" :icon="titleIcon"></v-icon>
        <h3 v-if="title">{{ title }}</h3>
      </div>
      <div style="display: flex; justify-content: center">
        <v-icon v-if="textIcon" color="#333333" :icon="textIcon"></v-icon>
        <p v-if="text">{{ text }}</p>
      </div>
    </v-card-item>
  </v-card>
  <div style="position: absolute; bottom: 20px; right: 10px" v-if="btnText">
    <RoundedButton :icon="btnIcon" :value="btnText"></RoundedButton>
  </div>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/buttons/RoundedButton.vue.js";

defineProps({
  img: String,
  title: String,
  titleIcon: String,
  text: String,
  textIcon: String,
  btnIcon: String,
  btnText: String,
});
</script>

<style scoped lang="scss">
.image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 5px;
}

.textcard {
  display: grid;
  padding: 20px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
}
</style>
