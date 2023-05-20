<template>
  <v-card class="ma-1">
    <!-- preview image -->
    <v-img
      cover
      :src="preview"
      lazySrc="@/assets/images/defaultImage.png"
      v-model="preview"
      max-height="300px"
    >
      <v-toolbar color="rgba(0, 0, 0, 0)" class="mt-2 pt-2">
        <template v-slot:append>
          <v-file-input
            single
            v-model="image"
            accept="image/*"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            append-inner-icon="mdi-upload"
            @change="{previewImage(); $emit('uploaded', image[0])}"
            variant="solo"
          />
        </template>
      </v-toolbar>
    </v-img>

    <v-card-actions>
      <v-btn
        @click="$emit('delete', id)"
        v-show="id !== 0"
        color="error"
        prepend-icon="mdi-delete"
      >
        Verwijder afbeelding
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>

import { ref } from "vue";
const preview = ref("");
const image = ref([]);
defineProps({ id: { type: Number, require: true } });

const previewImage = () => {
  const reader = new FileReader();
  reader.onload = () => {
    preview.value = String(reader.result);
  };
  reader.readAsDataURL(image.value[0]);
};



</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
</style>
