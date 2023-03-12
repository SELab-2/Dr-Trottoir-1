<template>
  <div>
    <v-container>
      <v-form>
        <v-img
          v-if="preview"
          :src="preview"
          lazySrc="../assets/images/defaultImage.png"
          v-model="preview"
          aspect-ratio="1/1"
        ></v-img>
        <div class="d-flex justify-center align-center pad">
          <v-btn block variant="outlined" @click="submit">
            Afbeelding toevoegen</v-btn
          >
        </div>

        <v-file-input
          class="pa-md-4 mx-lg-auto"
          single
          v-model="image"
          label="Select Image"
          accept="image/*"
          prepend-icon=""
          prepend-inner-icon="mdi-image"
          @change="previewImage"
        ></v-file-input>
        <v-textarea label="Comments" rows="3" v-model="comments"></v-textarea>
        <v-text-field label="Image Label" v-model="label"></v-text-field>
        <div class="d-flex justify-center align-center">
          <v-btn @click="submit" color="primary">Submit</v-btn>
        </div>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import { ref } from "vue";
import pic from "../assets/images/defaultImage.png";

export default {
  setup({ emit }) {
    const preview = ref(pic);
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
        for (const value of formData.values()) {
          console.log(value);
        }

        //const response = await axios.post("/images", formData);
        //console.log(response.data);

        // reset form after submit
        //file.value = null;
        preview.value = pic;
        label.value = "";
        comments.value = "";
        image.value = null;
        emit("form-submitted", formData);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      preview,
      image,
      label,
      comments,
      previewImage,
      submit,
    };
  },
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
.pad {
  padding: 15px;
}
</style>
