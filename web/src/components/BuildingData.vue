<template>
  <h2>uitgevoerd door {{ student }}</h2>
  <v-card class="comments" title="Opmerkingen">
    <v-list>
      <v-list-item
        v-for="comment of building.comments"
        :key="comment.title"
        class="comment"
        :title="comment.title"
        :subtitle="comment.comment"
      ></v-list-item>
    </v-list>
  </v-card>
  <div class="photos" title="Foto's">
    <v-card class="photo" cover>
      <v-img
        class="photo-image"
        cover
        src="https://source.unsplash.com/350x350?1"
      />
      <div>
        <v-card-title>Foto aankomst</v-card-title>
        <v-card-subtitle>18u30</v-card-subtitle>
      </div>
    </v-card>
    <v-card class="photo" cover>
      <v-img
        class="photo-image"
        cover
        src="https://source.unsplash.com/350x350?2"
      />
      <div>
        <v-card-title>Foto afval</v-card-title>
        <v-card-subtitle>18u40</v-card-subtitle>
      </div>
    </v-card>
    <v-card class="photo" cover>
      <v-img
        class="photo-image"
        cover
        src="https://source.unsplash.com/350x350?3"
      />
      <div>
        <v-card-title>Foto vertrek</v-card-title>
        <v-card-subtitle>18u45</v-card-subtitle>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  building: Object,
});

const student = "Julius Caesar";
</script>

<style lang="scss" scoped>
.v-card {
  margin: 10px 10px 10px 0;
}

.photo {
  display: flex;
}

.photo-image {
  height: inherit;
  width: inherit;
  max-height: 200px;
  max-width: 200px;
}
</style>
