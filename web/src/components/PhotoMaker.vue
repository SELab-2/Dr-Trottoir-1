<template>
  <v-container>
    <v-form @submit.prevent="onSubmit">
      <v-file-input
        label="Select Image"
        v-model="image"
        accept="image/*"
        @change="previewImage"
      ></v-file-input>

      <div class="d-flex justify-center align-center">
        <v-img v-if="preview" :src="preview" width="200" height="200"></v-img>
      </div>
      <v-textarea label="Comments" v-model="comments"></v-textarea>
      <v-text-field label="Image Label" v-model="label"></v-text-field>

      <div class="d-flex justify-center align-center">
        <v-btn type="submit" color="primary">Submit</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      image: null,
      preview: null,
      label: "",
      comments: "",
    };
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      this.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result;
      };
      reader.readAsDataURL(file);
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
        this.preview = null;
        this.label = "";
        this.comments = "";
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