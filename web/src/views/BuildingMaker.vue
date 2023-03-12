<template>
  <v-container>
    <div class="text-h1">Gebouw toevoegen</div>
    <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
    <v-form>
      <div class="text-h3">Gebouw info</div>
      <v-row>
        <v-col cols="3">
          <v-img
            cover
            :src="previewBuildingImage"
            v-model="previewBuildingImage"
            lazy-src="@/assets/images/defaultImage.png"
          ></v-img>
        </v-col>
        <v-col>
          <v-file-input
            label="Building Image"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            required
            v-model="buildingImage"
            @change="previewImage"
          ></v-file-input>
          <v-text-field
            required
            type="text"
            v-model="building.name"
            label="Building Name"
          ></v-text-field>
          <v-text-field
            required
            type="text"
            v-model="building.ivagoId"
            label="Ivago id"
          ></v-text-field>
          <v-select
            label="Syndicus"
            :items="['Jeff', 'Elon', 'Tim', 'Bill', 'Warren', 'Steve']"
            v-model="building.syndicus"
          ></v-select>
        </v-col>
      </v-row>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <v-file-input v-model="building.manual" label="Manual"></v-file-input>
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
              <v-text-field
                required
                type="number"
                v-model="building.address.longitude"
                label="Longitude"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                required
                type="number"
                v-model="building.address.latitude"
                label="Latitude"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                required
                type="text"
                v-model="building.address.street"
                label="Straat"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                required
                type="number"
                v-model="building.address.number"
                label="Huisnummer"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                required
                type="text"
                v-model="building.address.city"
                label="Stad"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                required
                type="number"
                v-model="building.address.zip_code"
                label="Post code"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <div class="text-h3">Extra afbeeldigen</div>
      <AddImage @form-submitted="handleFormSubmitted"> </AddImage>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <div class="d-flex justify-center">
        <v-btn @click="submit" type="submit">Submit gebouw</v-btn>
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
import Address from "../models/Address";
import Building from "../models/Building";
//import defaultImg from "../assets/images/defaultImage.png";

const dummyMap = ref(null);

const previewImage = () => {
  const reader = new FileReader();
  reader.onload = () => {
    previewBuildingImage.value = reader.result;
  };
  reader.readAsDataURL(buildingImage.value[0]);
};

const building = ref<Building>({
  name: "",
  ivagoId: "",
  syndicus: "",
  address: ref<Address>({
    street: "",
    number: null,
    city: "",
    zip_code: null,
    latitude: null,
    longitude: null,
  }),
  manual: null,
});

const submit = () => {
  try {
    //alle data zit in building
    //const response = await axios.post("", );
    //console.log(response.data);

    // reset form after submit
    previewBuildingImage.value = ref(null);
  } catch (error) {
    console.log(error);
  }
};

const previewBuildingImage = ref(null);
const buildingImage = ref(null);
</script>