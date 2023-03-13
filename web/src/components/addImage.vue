<template>
  <div>
    <v-container>
      <v-form>
        <v-row>
          <v-col cols="3">
            <v-img
              cover
              :src="preview"
              lazySrc="../assets/images/defaultImage.png"
              v-model="preview"
            ></v-img>
          </v-col>
          <v-col>
            <v-file-input
              single
              v-model="image"
              label="Select Image"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              @change="previewImage"
            ></v-file-input>
            <v-textarea
              label="Comments"
              rows="3"
              v-model="comments"
            ></v-textarea>
            <v-text-field label="Image Label" v-model="label"></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn @click="submit">Afbeelding toevoegen</v-btn>
        </div>
      </v-form>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
// export default {
//   name: "HelpView",
// };
import { ref, reactive } from "vue";

const preview = ref(null);
const image = ref(null);
const label = ref("");
const comments = ref("");
const previewImage = () => {
  const reader = new FileReader();
  reader.onload = () => {
    preview.value = reader.result;
  };
  reader.readAsDataURL(image.value[0]);
};
const submit = () => {
  try {
    const formData = new FormData();
    formData.append("image", image.value);
    formData.append("label", label.value);
    formData.append("comment", comments.value);
    console.log("verzonden");
    // for (const value of formData.values()) {
    //   console.log(value);
    // }
    //const response = await axios.post("/images", formData);
    //console.log(response.data);
    // reset form after submit
    //file.value = null;
    preview.value = ref(null);
    label.value = "";
    comments.value = "";
    image.value = null;
    //emit("form-submitted", formData);
  } catch (error) {
    console.log(error);
  }
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