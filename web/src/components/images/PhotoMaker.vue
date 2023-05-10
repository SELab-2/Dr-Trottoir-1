<template>
  <v-card class="mx-2 my-2" max-width="350px" min-width="300px">
    <template v-slot:title
      ><v-card-title v-if="isPhoto">Foto toevoegen</v-card-title>
      <v-card-title v-else>Opmerking toevoegen</v-card-title></template
    >
    <template v-slot:append
      ><v-icon
        @click="$emit('confirm', photo)"
        color="error"
        icon="mdi-close"
      ></v-icon
    ></template>

    <div class="mx-4 my-2">
      <v-file-input
        v-if="isPhoto"
        single
        v-model="photo.image"
        label="Selecteer afbeelding"
        accept="image/*"
        prepend-icon=""
        prepend-inner-icon="mdi-image"
        @update:model-value="$emit('onUpdate', photo)"
        variant="outlined"
      ></v-file-input>
      <v-text-field
        v-if="isPhoto"
        variant="outlined"
        @update:model-value="$emit('onUpdate', photo)"
        label="Titel"
        v-model="photo.label"
      ></v-text-field>
      <v-textarea
        @update:model-value="$emit('onUpdate', photo)"
        label="Commentaar"
        rows="3"
        v-model="photo.comments"
        variant="outlined"
      ></v-textarea>
      <div class="d-flex mb-4">
        <v-spacer></v-spacer
        ><v-btn
          @click="$emit('confirm', photo, isPhoto)"
          color="primary"
          prepend-icon="mdi-check"
          >Opslaan</v-btn
        >
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import Photo from "@/components/models/Photo";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  isPhoto: {
    type: Boolean,
    default: true,
  },
  currentComments: String,
});

const photo = ref<Photo>({
  image: [],
  comments: "",
  label: "",
});

if (!props.isPhoto) {
  photo.value.comments = String(props.currentComments);
}
</script>
