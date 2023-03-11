<template>
  <v-card>
    <v-container>
      <v-form @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="3">
            <v-img
              v-if="preview"
              :src="preview"
              lazySrc="@/assets/images/defaultImage.png"
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
              @change="previewImage"
              prepend-icon="mdi-image"
            ></v-file-input>
            <v-textarea label="Comments" v-model="comments"></v-textarea>
            <v-text-field label="Image Label" v-model="label"></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex justify-center align-center">
          <v-btn type="submit" color="primary">Submit</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      image: null,
      preview: "@/assets/images/defaultImage.png",
      label: "",
      comments: "",
    };
  },
  methods: {
    previewImage(event) {
      //const file = event.target.files[0];
      //console.log(file);
      //console.log(this.image[0]);
      //this.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result;
      };
      reader.readAsDataURL(this.image[0]);
    },

    async onSubmit() {
      try {
        const formData = new FormData();
        formData.append("image", this.file);
        formData.append("label", this.label);
        formData.append("comment", this.comments);
        console.log("verzonden");
        for (const value of formData.values()) {
          console.log(value);
        }
        //const response = await axios.post("/images", formData);
        //console.log(response.data);

        // reset form after submit
        this.file = null;
        this.preview = "@/assets/images/defaultImage.png";
        this.label = "";
        this.comments = "";
        this.image = null;
      } catch (error) {
        console.log(error);
      }
    },
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