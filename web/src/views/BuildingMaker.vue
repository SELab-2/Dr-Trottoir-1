<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="name" label="Building Name"></v-text-field>
      <v-text-field v-model="ivagoid" label="Ivago id"></v-text-field>
      <v-text-field v-model="syndicus" label="Syndicus"></v-text-field>
      <v-text-field v-model="address" label="Address"></v-text-field>
      <v-file-input v-model="file" label="Manual"></v-file-input>
      <v-btn type="submit">Submit</v-btn>
      <!--image id, adress inline , meerdere afbeeldigen met commetns
      onder elkaar als er 1 gemaakt is kunnen er meerdere bij
      leaf let -->
    </v-form>
  </v-container>
</template>

<script>
//import axios from "axios";

export default {
  data() {
    return {
      name: "",
      ivagoid: "",
      syndicus: "",
      address: "",
      file: null,
    };
  },
  methods: {
    submitForm() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("ivagoid", this.ivagoid);
      formData.append("syndicus", this.syndicus);
      formData.append("address", this.address);
      formData.append("file", this.file);

      //   axios
      //     .post("/building", formData)
      //     .then((response) => {
      //       console.log(response.data);
      //       // handle successful response
      //     })
      //     .catch((error) => {
      //       console.log(error.response.data);
      //       // handle error response
      //     });
    },
  },
};
</script>