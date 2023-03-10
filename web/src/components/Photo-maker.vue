<template>
  <v-container>
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