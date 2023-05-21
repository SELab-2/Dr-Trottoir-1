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
        :items="users"
        v-model="building.syndicus"
        prepend-inner-icon="mdi-account"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :title="item.name" :subtitle="item.name">
            <p>{{ getFullStudentName(item.value) }}</p>
          </v-list-item>
        </template>

        <template v-slot:selection="{ item }">
          <p>{{ getFullStudentName(item.value) }}</p>
        </template>
      </v-select>

      <v-text-field
        required
        type="number"
        prepend-inner-icon="mdi-clock"
        v-model="expectedTimeInHours"
        label="Verwachte werktijd in uur"
      ></v-text-field>

      <v-file-input
        id="manual-id"
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        label="Handleiding"
      ></v-file-input>
    </BorderCard>

    <BorderCard prepend-icon="mdi-text" class="mb-3 px-4" title="Beschrijving">
      <v-textarea
        rows="4"
        label="Beschrijving van het gebouw"
        prepend-inner-icon="mdi-text"
        v-model="description"
      ></v-textarea>
    </BorderCard>

    <!-- card met alle info over de locatie -->
    <BorderCard
      prepend-icon="mdi-map-marker"
      class="mb-3 px-4"
      title="Locatie info"
    >
      <BorderCard style="height: 400px" class="mx-4">
        <l-map ref="map" v-model:zoom="zoom" :center="[51, 4.4699]">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <l-marker
            :key="building.ivago_id"
            :lat-lng="[latitude, longitude]"
            name="building"
          >
            <l-tooltip :options="{ permanent: true }">
              {{ building.name }}
            </l-tooltip>
          </l-marker>
        </l-map>
      </BorderCard>

      <div class="mx-4 mt-3">
        <v-row>
          <v-col>
            <v-text-field
              required
              type="number"
              v-model="latitude"
              label="Latitude"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              required
              type="number"
              v-model="longitude"
              label="Longitude"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- addres forum gebruiken -->
        <AddressForm
          @onUpdate="(newAddress) => (address = newAddress)"
        ></AddressForm>
      </div>
    </BorderCard>

    <BorderCard class="mb-3 px-4">
      <template v-slot:prepend><v-icon icon="mdi-image" /></template>
      <template v-slot:title>Foto's</template>
      <template v-slot:append
        ><v-icon class="mr-2" icon="mdi-plus" @click="addFileId()"></v-icon
        ><v-icon class="ml-2" icon="mdi-delete" @click="removeFileId()"></v-icon
      ></template>
      <v-list>
        <v-list-item v-for="fileId of fileIds" :key="fileId">
          <v-file-input
            class="mt-1"
            :multiple="false"
            :id="fileId"
            accept="image/jpeg"
            prepend-icon=""
            prepend-inner-icon="mdi-file"
            :label="fileId"
          ></v-file-input>
        </v-list-item>
      </v-list>
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
import AddressForm from "@/components/forms/AddressForm.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { tryOrAlertAsync } from "@/try";
import {
  Result,
  AddressQuery,
  BuildingQuery,
  UserQuery,
  SyndicusQuery,
} from "@selab-2/groep-1-query";
import router from "@/router";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";

const fileIds = ref<string[]>(["Hoofdafbeelding"]);

function addFileId() {
  fileIds.value.push("Afbeelding " + fileIds.value.length);
}

function removeFileId() {
  if (fileIds.value.length > 1) {
    fileIds.value.pop();
  }
}

const users = await new UserQuery().getAll({
  admin: false,
  student: false,
  super_student: false,
});

const expectedTimeInHours = ref<number>(0);
const syndici = await new SyndicusQuery().getAll();
console.log(syndici);

const address = ref({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
});

// latitude and longitude have to be separated from address,
// because the AddressForm overwrites the address and that messes up the coordinates
const latitude = ref(0);
const longitude = ref(0);

const building = ref({
  name: "",
  ivago_id: "",
  syndicus: {
    id: 0,
    first_name: "",
    last_name: "",
  },
  address_id: 0,
  manual_id: 1,
});

const description = ref("");

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
    /*
    const newAddress = await new AddressQuery().createOne({
      street: address.value.street,
      number: address.value.number,
      city: address.value.city,
      zip_code: address.value.zip_code,
      latitude: latitude.value,
      longitude: longitude.value,
    });

    // create File object for manual
    // const response = await fetch('http://10.0.0.5:8080/file/',  {method: "POST", body: JSON.stringify(manual)});
    // const man = await response.json()

    const element = document.getElementById("manual-id");

    //

    /*
    const { id: buildingId } = await new BuildingQuery().createOne({
      name: building.value.name,
      ivago_id: building.value.ivago_id,
      description: description.value,
      address: newAddress,
      // manual_id: man.id,
      }
    );

    /*
    for(const image of images){
      // create Image object from the image
      const response = await fetch('http://10.0.0.5:8080/image/',  {method: "POST", body: JSON.stringify(image)});
      const im = await response.json()

      // add the image to the building
      await new BuildingQuery().createImage({
        id: buildingId,
        image: im,
        });
    };
     */

    // Upload file
    //const file = await new FileQuery().createOne("manual-id");
    //building.value.manual_id = file.id;
    const buildingUnwrapped = building.value;

    const isNewSyndicus: boolean = syndici.some((s: Result<SyndicusQuery>) => {
      return s.user_id === buildingUnwrapped.syndicus.id;
    });

    // Create address
    const newAddress = await new AddressQuery().createOne({
      ...address.value,
      ...{ latitude: latitude.value, longitude: longitude.value },
    });

    if (isNewSyndicus) {
      let { id: syndicusId } = await new SyndicusQuery().createOne({
        user_id: buildingUnwrapped.syndicus.id,
      });
      buildingUnwrapped.syndicus.id = syndicusId;
    }

    /*
    const file = await new FileQuery().createOne("manual-id");
    */

    const newBuilding = await new BuildingQuery().createOne({
      name: buildingUnwrapped.name,
      address_id: newAddress.id,
      description: description.value,
      ivago_id: buildingUnwrapped.ivago_id,
      expected_time: expectedTimeInHours.value * 60,
      syndicus_id: buildingUnwrapped.syndicus.id,
      manual_id: buildingUnwrapped.manual_id,
    });

    for (const fileId of fileIds.value) {
      const element: any = document.getElementById(fileId);
      console.log(element.files.length);
      if (element.files.length > 0) {
        await new BuildingQuery().createImage(newBuilding, fileId);
      }
    }

    // Redirect
    await router.push(`/gebouw/${newBuilding.id}`);
  });
};
</script>
