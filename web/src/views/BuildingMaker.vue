<template>
  <HFillWrapper>
    <!-- card met alle info over het gebouw -->
    <v-card prepend-icon="mdi-home" class="mb-4 px-4" title="Gebouw info">
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

      <v-file-input
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        v-model="building.manual"
        label="Manual"
      ></v-file-input>
    </v-card>

    <!-- card met alle info over de locatie -->
    <v-card class="mb-4">
      <v-img
        src="@/assets/images/dummyMap.png"
        v-model="dummyMap"
        max-height="300px"
        cover
      >
        <v-toolbar color="rgb(250, 250, 250, 0)" class="pl-4">
          <template v-slot:title>
            <v-card-title> Locatie info </v-card-title>
          </template>
          <template v-slot:prepend>
            <v-icon icon="mdi-access-point" size="large"></v-icon>
          </template>
        </v-toolbar>
      </v-img>

      <div class="mx-4 mt-3">
        <v-row>
          <v-col>
            <v-text-field
              required
              type="number"
              v-model="address2.longitude"
              label="Longitude"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              required
              type="number"
              v-model="address2.latitude"
              label="Latitude"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- addres forum gebruiken -->
        <AddressForm
          @onUpdate="(newAddress) => (address2 = newAddress)"
        ></AddressForm>
      </div>
    </v-card>

    <v-card prepend-icon="mdi-image">
      <!-- v-card met alle extra afbeeldingen -->
      <template v-slot:title> Extra afbeeldigen </template>
      <v-card-item>
        <MultiAddImage @form-submitted="handleMultiImages"> </MultiAddImage>
        <div ref="container"></div>
      </v-card-item>
    </v-card>
    <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
    <div class="d-flex flex-row-reverse">
      <v-btn
        @click="submit"
        to="/dashboard/gebouwen"
        type="submit"
        color="success"
        prepend-icon="mdi-check"
        >Maak gebouw</v-btn
      >
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MultiAddImage from "@/components/MultiAddImage.vue";
import Address2 from "@/components/models/Address2";
import Building from "@/components/models/Building";
import AddressForm from "../components/AddressForm.vue";
import HFillWrapper from "@/components/HFillWrapper.vue";

//import defaultImg from "../assets/images/defaultImage.png";

const dummyMap = ref(null);
const address2 = ref<Address2>({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
  latitude: 0,
  longitude: 0,
});

const building = ref<Building>({
  name: "",
  ivagoId: "",
  syndicus: "",
  manual: [],
});

//TODO: handle multi image
const handleMultiImages = () => {};
//TODO: api request
const submit = () => {
  try {
    //alle data zit in building
    //const response = await axios.post("", );
    //console.log(response.data);
    // reset form after submit
    //previewBuildingImage.value = ref(null);
  } catch (error) {
    console.log(error);
  }
};
</script>
