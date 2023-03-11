<template>
  <v-card>
    <v-container>
      <v-form>
        <v-row>
          <v-col cols="3">
            <v-img
              v-if="preview"
              :src="preview"
              lazySrc="../assets/images/defaultImage.png"
              v-model="preview"
              width="350"
              height="350"
            ></v-img>
          </v-col>
          <v-col>
            <v-file-input
              single
              v-model="image"
              label="Select Image"
              accept="image/*"
              prepend-icon="mdi-image"
              @change="previewImage"
            ></v-file-input>
            <v-textarea label="Comments" v-model="comments"></v-textarea>
            <v-text-field label="Image Label" v-model="label"></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex justify-center align-center">
          <v-btn @click="submit" color="primary">Submit</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { ref } from "vue";
import pic from "../assets/images/defaultImage.png";

export default {
  setup() {
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
</style>
