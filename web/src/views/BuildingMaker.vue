<template>
  <v-container>
    <v-form>
      <!-- card met alle info over het gebouw -->
      <v-card prepend-icon="mdi-home">
        <template v-slot:title> Gebouw info </template>
        <v-card-item>
          <v-row>
            <v-col cols="3">
              <v-img
                cover
                :src="preview"
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
          <v-file-input
            prepend-icon=""
            prepend-inner-icon="mdi-file"
            v-model="building.manual"
            label="Manual"
          ></v-file-input>
        </v-card-item>
      </v-card>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
      <v-card prepend-icon="mdi-access-point">
        <!-- card met alle info over de locatie -->
        <template v-slot:title> Locatie info </template>
        <v-card-item>
          <v-row>
            <v-col cols="3">
              <v-img
                src="@/assets/images/dummyMap.png"
                v-model="dummyMap"
              ></v-img>
            </v-col>
            <v-col>
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
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
      <v-divider :thickness="5" class="pa-md-4 mx-lg-auto"></v-divider>
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
        <v-btn @click="submit" type="submit" color="primary"
          >Submit gebouw</v-btn
        >
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MultiAddImage from "@/components/MultiAddImage.vue";
import Address2 from "@/components/models/Address2";
import Building from "@/components/models/Building";
import AddressForm from "../components/AddressForm.vue";
//import defaultImg from "../assets/images/defaultImage.png";

const dummyMap = ref(null);
const buildingImage = ref([]);
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

const preview = ref("");

// TODO: fix typing here
const previewImage = () => {
  const reader = new FileReader();
  reader.onload = () => {
    preview.value = String(reader.result);
  };
  reader.readAsDataURL(buildingImage.value[0]);
};
</script>
