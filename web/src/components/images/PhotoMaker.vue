<template>
  <div>
    <v-container>
      <v-form>
        <v-img
          cover
          v-if="imageUrl"
          :src="imageUrl"
          aspect-ratio="1/1"
          :with="300"
        ></v-img>
        <div class="d-flex justify-center align-center py-5">
          <v-btn block variant="outlined"> Maak foto</v-btn>
        </div>

        <v-file-input
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
      <div class="d-flex flex-row-reverse my-3">
        <v-btn prepend-icon="mdi-plus"> Toevoegen </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Photo from "@/components/models/Photo";

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
.d-flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.pad {
  padding: 15px;
}
</style>
