<template>
  <img v-if="img" alt="imagecard" class="image" :src="img" />
  <v-container v-else class="textcard image">
    <div>
      <div style="display: flex; justify-content: center">
        <v-icon v-if="titleIcon" color="#333333" :icon="titleIcon"></v-icon>
        <h3 v-if="title">{{ title }}</h3>
      </div>
      <div style="display: flex; justify-content: center">
        <v-icon v-if="textIcon" color="#333333" :icon="textIcon"></v-icon>
        <p v-if="text">{{ text }}</p>
      </div>
    </div>
  </v-container>
  <div style="position: absolute; bottom: 20px; right: 10px" v-if="btnText">
    <RoundedButton :icon="btnIcon" :value="btnText"></RoundedButton>
  </div>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/RoundedButton.vue";

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
  border: 2px solid #f1f1f1;
  background: #fafafa;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
