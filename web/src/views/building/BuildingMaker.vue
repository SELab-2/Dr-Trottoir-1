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
        :items="syndici"
        v-model="building.syndicus"
        prepend-inner-icon="mdi-account"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.name"
            :subtitle="item.name"
          >
            <p>{{ getFullStudentName(item.value) }}</p>
          </v-list-item>
        </template>

        <template v-slot:selection="{ item }">
          <p>{{ getFullStudentName(item.value) }}</p>
        </template>
      </v-select>

      <v-file-input
        disabled
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        label="Manual"
      ></v-file-input>
    </BorderCard>

    <!-- card met alle info over de locatie -->
    <BorderCard prepend-icon="mdi-map-marker" class="mb-3" title="Locatie info">
      <CardLayout style="height: 400px">
        <l-map ref="map" v-model:zoom="zoom" :center="[51, 4.4699]">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <l-marker
            :key="building.id"
            :lat-lng="[address.longitude, address.latitude]"
            name="building"
          >
            <l-tooltip :options="{ permanent: true }">
              {{ building.name }}
            </l-tooltip>
          </l-marker>
        </l-map>
      </CardLayout>

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
  UserQuery,
} from "@selab-2/groep-1-query";
import router from "@/router";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import CardLayout from "@/layouts/CardLayout.vue";

const dummyMap = ref(null);

const syndici = await new UserQuery().getAll();

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
  syndicus: {
    id: 0,
    first_name: "",
    last_name: ""
  },
  address_id: 0,
  manual_id: null,
});

function getFullStudentName(s: Result<UserQuery> | undefined): string {
  if (s) {
    return s.first_name + " " + s.last_name;
  } else {
    return " ";
  }
}

const zoom = ref(8);

const submit = () => {
  tryOrAlertAsync(async () => {
    const { id } = await new AddressQuery().createOne(address.value);
    building.value.address_id = id;
    const { id: buildingId } = await new BuildingQuery().createOne({
      id: building.value.id,
      ivago_id: building.value.ivago_id,
      syndicus_id: building.value.syndicus.id,
      address_id: building.value.address_id,
      manual_id: building.value.manual_id,
      }
    );
    await router.push(`/gebouw/${buildingId}`);
  });
};
</script>
