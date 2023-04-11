<template>
  <v-card class="card">
    <v-container>
      <h2 v-if="showPhoto">Foto toevoegen</h2>
      <h2 v-else class="pb-4">Opmerking toevoegen</h2>
      <v-form>
        <v-img
          cover
          v-if="imageUrl && showPhoto"
          :src="imageUrl"
          aspect-ratio="1/1"
          :with="300"
        ></v-img>
        <div class="d-flex justify-center align-center py-5" v-if="showPhoto">
          <v-btn block variant="outlined"> Maak foto</v-btn>
        </div>

        <v-file-input
          v-if="showPhoto"
          single
          v-model="photo.image"
          label="Selecteer afbeelding"
          accept="image/*"
          prepend-icon=""
          prepend-inner-icon="mdi-image"
          @update:model-value="$emit('onUpdate', photo)"
        ></v-file-input>
        <v-text-field
          @update:model-value="$emit('onUpdate', photo)"
          label="Titel"
          v-model="photo.label"
        ></v-text-field>
        <v-textarea
          @update:model-value="$emit('onUpdate', photo)"
          label="Commentaar"
          rows="3"
          v-model="photo.comments"
        ></v-textarea>
      </v-form>
      <div class="d-flex flex-row my-3">
        <v-btn
          prepend-icon="mdi-delete"
          color="error"
          class="mx-2"
          @click="$emit('cancel')"
        >
          Annuleer
        </v-btn>
        <v-btn
          prepend-icon="mdi-plus"
          color="success"
          class="mx-2"
          @click="$emit('confirm', photo)"
        >
          Toevoegen
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
import Photo from "@/components/models/Photo";
import { ref } from "vue";

defineProps({
  showPhoto: {
    type: Boolean,
    default: true,
  },
});

const photo = ref<Photo>({
  image: [],
  comments: "",
  label: "",
});

const imageUrl = ref("");

/*TODO: fix typing here, commented this for deadline 1
  Should be added in <v-file-input>
    @change="previewImage"

const previewImage = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    if (e.target != null) {
      imageUrl.value = e.target.result;
    }
  };

  reader.readAsDataURL(file);
};
*/

// later voor het submit van afbeelding
//const submit = () => {
//   try {
//     const formData = new FormData();
//     formData.append("image", photo.image.value);
//     formData.append("label", label.value);
//     formData.append("comment", comments.value);
//     console.log("verzonden");
//     for (const value of formData.values()) {
//       console.log(value);
//     }

//     //const response = await axios.post("/images", formData);
//     //console.log(response.data);

//     // reset form after submit
//     //file.value = null;
//     preview.value = null;
//     label.value = "";
//     comments.value = "";
//     image.value = null;
//     //emit("form-submitted", formData);
//   } catch (error) {
//     console.log(error);
//   }
// };
</script>

<style scoped>
.card {
  max-width: 350px;
}
</style>
