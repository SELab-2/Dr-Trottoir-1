<template>
  <HFillWrapper>
    <!-- card met alle info over het gebouw -->
    <BorderCard prepend-icon="mdi-home" class="mb-3 px-4" title="Gebouw info">
      <v-text-field
        required
        type="text"
        v-model="building_name"
        label="Building Name"
      ></v-text-field>
      <v-text-field
        required
        type="text"
        v-model="building_ivago_id"
        label="Ivago id"
      ></v-text-field>

      <v-select label="Syndicus" :items="syndicusen" v-model="syndicus_id">
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :title="item.id" :subtitle="item.id">
            <p>{{ item.value.user.first_name + " " + item.value.user.last_name }}</p>
          </v-list-item>
        </template>

        <template v-slot:selection="{ item }">
          <p>{{ item.value.user.first_name + " " + item.value.user.last_name }}</p>
        </template>
      </v-select>

      <v-file-input
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        v-model="building_manual"
        label="Manual"
      ></v-file-input>
    </BorderCard>

    <!-- card met alle info over de locatie -->
    <BorderCard class="mb-3">
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
        <AddressForm @onUpdate="(newAddress) => (address2 = newAddress)"></AddressForm>
      </div>
    </BorderCard>

    <BorderCard prepend-icon="mdi-image">
      <!-- v-card met alle extra afbeeldingen -->
      <template v-slot:title> Extra afbeeldigen </template>
      <v-card-item>
        <MultiAddImage @form-submitted="handleMultiImages"> </MultiAddImage>
        <div ref="container"></div>
      </v-card-item>
    </BorderCard>
    <div class="d-flex flex-row-reverse mt-3">
      <v-btn
        @click="submit"
        to="/gebouw/0"
        type="submit"
        color="success"
        prepend-icon="mdi-check"
        >Maak gebouw</v-btn
      >
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import MultiAddImage from "@/components/images/MultiAddImage.vue";
import Address2 from "@/components/models/Address2";
import Building from "@/components/models/Building";
import AddressForm from "../../components/forms/AddressForm.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { Result, SyndicusQuery, BuildingQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

interface SyndicusData {
  id: number;
  name: string;
}

let syndicusen: Ref<Result<SyndicusQuery>[]> = ref([]);

async function getSyndicusen() {
  tryOrAlertAsync(async () => {
    syndicusen.value = await new SyndicusQuery().getAll();
  });
}

onMounted(() => {
  getSyndicusen();
  //extractUserNames()
});

const syndicus_id: Ref<Result<SyndicusQuery>> = ref(null);
const building_name = ref(null);
const building_ivago_id = ref(null);
const building_manual = ref([]);

const dummyMap = ref(null);
const address2 = ref<Address2>({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
  latitude: 0,
  longitude: 0,
});

//TODO: handle multi image
const handleMultiImages = () => {};
//TODO: api request

async function makeBuilding() {
  tryOrAlertAsync(async () => {
    await new BuildingQuery().createOne({
      name: building_name,
      ivago_id: "1",
      syndicus_id: 88,
      address_id: 66,
    });
  });
}

async function makeAddress() {
}

const submit = () => {
  try {
    console.log(syndicus_id.value.id);

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
