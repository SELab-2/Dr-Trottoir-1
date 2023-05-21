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
            @change="previewImage"
            variant="solo"
          />
        </template>
      </v-toolbar>
    </v-img>
    <v-textarea
      label="Commentaar"
      rows="3"
      v-model="comments"
      class="mx-4 mt-3"
    />

    <v-card-actions>
      <v-btn
        @click="$emit('delete', id)"
        v-show="id != 0"
        color="error"
        prepend-icon="mdi-delete"
      >
        Verwijder afbeelding
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
// export default {
//   name: "HelpView",
// };
import { ref } from "vue";
const preview = ref("");
const image = ref([]);
const comments = ref("");
defineProps({ id: { type: Number, require: true } });
// function to preview image
//TODO: type warning
const previewImage = () => {
  const reader = new FileReader();
  reader.onload = () => {
    preview.value = String(reader.result);
  };
  reader.readAsDataURL(image.value[0]);
};
// code voor later
// const submit = () => {
//   tryOrAlert(() => {
//     const formData = new FormData();
//     formData.append("image", image.value);
//     formData.append("label", label.value);
//     formData.append("comment", comments.value);
//     //const response = await axios.post("/images", formData);
//     // reset form after submit
//     //file.value = null;
//     preview.value = ref(null);
//     label.value = "";
//     comments.value = "";
//     image.value = null;
//     //emit("form-submitted", formData);
//   });
// };
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
