<template>
  <v-card class="mx-2 my-2" max-width="350px" min-width="300px">
    <template v-slot:title
      ><v-card-title v-if="isPhoto">Foto toevoegen</v-card-title>
      <v-card-title v-else>Opmerking toevoegen</v-card-title></template
    >
    <template v-slot:append
      ><v-icon @click="$emit('cancel')" color="error" icon="mdi-close"></v-icon
    ></template>

    <div class="mx-4 my-2">
      <v-file-input
        v-if="isPhoto"
        single
        v-model="photo.image"
        id="upload-progress"
        label="Selecteer afbeelding"
        accept="image/*"
        prepend-icon=""
        prepend-inner-icon="mdi-image"
        @update:model-value="$emit('onUpdate', photo)"
        variant="outlined"
      ></v-file-input>
      <v-select
        v-if="isPhoto"
        variant="outlined"
        :items="ImageTypes"
        @update:model-value="$emit('onUpdate', photo)"
        label="Type"
        v-model="photo.type"
      ></v-select>
      <v-textarea
        @update:model-value="$emit('onUpdate', photo)"
        label="Commentaar"
        rows="3"
        v-model="photo.comments"
        variant="outlined"
      ></v-textarea>
      <div class="d-flex mb-4">
        <v-spacer></v-spacer
        ><SimpleButton
          @click="
            upload();
            $emit('update', newProgress?.id);
          "
          color="primary"
          prepend-icon="mdi-check"
          >Opslaan</SimpleButton
        >
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import Photo from "@/components/models/Photo";
import { ref } from "vue";
import SimpleButton from "@/components/buttons/SimpleButton.vue";
import { ProgressQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { PropType } from "vue";
import { ProgressImageType } from "@selab-2/groep-1-orm";

const ImageTypes = ["ARRIVAL", "DEPARTURE", "GARBAGE"];

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  isPhoto: {
    type: Boolean,
    default: true,
  },
  progress: { type: Object as PropType<Result<ProgressQuery>>, required: true },
});

const newProgress = ref<Result<ProgressQuery>>(props.progress);

const photo = ref<Photo>({
  image: [],
  comments: "geen commentaar",
  type: "ARRIVAL",
});

async function upload() {
  if (props.isPhoto) {
    await uploadImage();
  } else {
    await report();
  }
}

async function report() {
  console.log(props.progress?.id);
  tryOrAlertAsync(async () => {
    newProgress.value = await new ProgressQuery().updateOne({
      id: newProgress.value?.id,
      report: photo.value.comments,
    });
  });
}

async function uploadImage() {
  tryOrAlertAsync(async () => {
    newProgress.value = await new ProgressQuery().createImage(
      newProgress.value!,
      "upload-progress",
      photo.value.type as ProgressImageType,
      photo.value.comments,
    );
  });
}

if (!props.isPhoto) {
  photo.value.comments = "";
}
</script>
