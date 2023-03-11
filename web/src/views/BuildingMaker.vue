<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="3">
          <v-img :src="previewBuildingImage"></v-img>
        </v-col>
        <v-col>
          <v-file-input
            label="Building Image"
            prepend-icon="mdi-image"
          ></v-file-input>
          <v-text-field label="Building Name"></v-text-field>
          <v-text-field label="Ivago id"></v-text-field>
          <v-select
            label="Syndicus"
            :items="[
              'California',
              'Colorado',
              'Florida',
              'Georgia',
              'Texas',
              'Wyoming',
            ]"
          ></v-select>
        </v-col>
      </v-row>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <v-row>
        <v-col cols="3">
          <v-img :src="dummyMap" v-model="dummyMap"></v-img>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field label="Longitude"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Latitude"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="Straat"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Huisnummer"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="Stad"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Post code"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <v-file-input label="Manual"></v-file-input>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <AddImage> hallo </AddImage>
      <v-btn type="submit">Submit</v-btn>
      <!--image id, adress inline , meerdere afbeeldigen met commetns
      onder elkaar als er 1 gemaakt is kunnen er meerdere bij
      leaf let -->
    </v-form>
  </v-container>
</template>

<script>
import { ref } from "vue";
import dummy from "../assets/images/dummyMap.png";
import defaultImg from "../assets/images/defaultImage.png";
import AddImage from "../components/addImage.vue";
export default {
  setup() {
    const dummyMap = dummy;
    // const name = ref("");
    // const ivagoid = ref("");
    // const syndicus = ref("");
    // const adress = ref("");
    // const file = ref(null);
    const previewBuildingImage = defaultImg;
    // const mapImage = ref(null);
    // return name, ivagoid, syndicus, adress, file, buildingImage, mapImage;
    return { dummyMap, previewBuildingImage };
  },
};
</script>