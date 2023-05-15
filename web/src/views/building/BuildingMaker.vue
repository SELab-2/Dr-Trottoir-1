<template>
  <HFillWrapper>
    <!-- card met alle info over het gebouw -->
    <BorderCard prepend-icon="mdi-home" class="mb-3 px-4" title="Gebouw info">
      <v-text-field
        required
        type="text"
        v-model="building.name"
        label="Building Name"
      ></v-text-field>
      <v-text-field
        required
        type="text"
        v-model="building.ivago_id"
        label="Ivago ID"
      ></v-text-field>
      <v-select
        label="Syndicus"
        :items="syndici.map((e) => e.id)"
        v-model="building.syndicus_id"
      ></v-select>

      <v-file-input
        disabled
        prepend-icon=""
        prepend-inner-icon="mdi-file"
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
              v-model="address.longitude"
              label="Longitude"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              required
              type="number"
              v-model="address.latitude"
              label="Latitude"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- addres forum gebruiken -->
        <AddressForm
          @onUpdate="(newAddress) => (address = newAddress)"
        ></AddressForm>
      </div>
    </BorderCard>

    <v-btn
      @click="submit"
      type="submit"
      color="success"
      prepend-icon="mdi-check"
      class="mb-12"
      >Maak gebouw</v-btn
    >
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AddressForm from "../../components/forms/AddressForm.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { tryOrAlertAsync } from "@/try";
import {
  AddressQuery,
  BuildingQuery,
  SyndicusQuery,
} from "@selab-2/groep-1-query";
import router from "@/router";

const dummyMap = ref(null);

const syndici = await new SyndicusQuery().getAll();

const address = ref({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
  latitude: 0,
  longitude: 0,
});

const building = ref({
  name: "",
  ivago_id: "",
  syndicus_id: 0,
  address_id: 0,
  manual_id: null,
});

const submit = () => {
  tryOrAlertAsync(async () => {
    const { id } = await new AddressQuery().createOne(address.value);
    building.value.address_id = id;
    const { id: buildingId } = await new BuildingQuery().createOne(
      building.value,
    );
    await router.push(`/gebouw/${buildingId}`);
  });
};
</script>
