<template>
  <v-container>
    <div class="text-h1">Gebouw toevoegen</div>
    <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
    <v-form>
      <div class="text-h3">Gebouw info</div>
      <v-row>
        <v-col cols="3">
          <v-img cover src="@/assets/images/defaultImage.png"></v-img>
        </v-col>
        <v-col>
          <v-file-input
            label="Building Image"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
          ></v-file-input>
          <v-text-field label="Building Name"></v-text-field>
          <v-text-field label="Ivago id"></v-text-field>
          <v-select
            label="Syndicus"
            :items="['Jeff', 'Elon', 'Tim', 'Bill', 'Warren', 'Steve']"
          ></v-select>
        </v-col>
      </v-row>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <v-file-input label="Manual"></v-file-input>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <div class="text-h3">Locatie info</div>
      <v-row>
        <v-col cols="3">
          <v-img src="@/assets/images/dummyMap.png" v-model="dummyMap"></v-img>
        </v-col>
        <!-- TODO: vervagen door adress forum component -->
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
      <div class="text-h3">Extra afbeeldigen</div>
      <AddImage @form-submitted="handleFormSubmitted"> </AddImage>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <div class="d-flex justify-center">
        <v-btn type="submit">Submit gebouw</v-btn>
      </div>
      <!--image id, adress inline , meerdere afbeeldigen met commetns
      onder elkaar als er 1 gemaakt is kunnen er meerdere bij
      leaf let -->
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AddImage from "../components/addImage.vue";

const dummyMap = ref(null);
// const name = ref("");
// const ivagoid = ref("");
// const syndicus = ref("");
// const adress = ref("");
// const file = ref(null);
const previewBuildingImage = ref(null);
// const mapImage = ref(null);
// return name, ivagoid, syndicus, adress, file, buildingImage, mapImage;
</script>