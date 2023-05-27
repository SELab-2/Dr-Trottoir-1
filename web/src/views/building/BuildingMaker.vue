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
        :items="possibleUsers"
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
        v-model="building.expectedTimeInHours"
        label="Verwachte werktijd in uur"
      ></v-text-field>

      <v-file-input
        id="manual-id"
        v-model="uploadedManual"
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        :label="edit ? `${manualName}` : 'Handleiding'"
      ></v-file-input>
    </BorderCard>

    <BorderCard prepend-icon="mdi-text" class="mb-3 px-4" title="Beschrijving">
      <v-textarea
        rows="4"
        label="Beschrijving van het gebouw"
        prepend-inner-icon="mdi-text"
        v-model="building.description"
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
        <v-row class="py-0 my-0 mt-2">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0"
          >
            <!-- Text input field for the street name -->
            <v-text-field
              v-model="address.street"
              label="Straat"
              type="text"
              required
              variant="outlined"
              :rules="streetRules"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-road-variant" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
            <!-- Text input field for the house number -->
            <HomeNumberInputField :readonly="false" v-model="address.number" />
          </v-col>
        </v-row>

        <v-row class="py-0 my-0 mt-2 mb-1">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0"
          >
            <!-- Text input field for the city name -->
            <v-text-field
              v-model="address.city"
              label="Stad"
              type="text"
              required
              variant="outlined"
              :rules="cityRules"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-city-variant" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
            <!-- Text input field for the zip code -->
            <ZipCodeInputField :readonly="false" v-model="address.zip_code" />
          </v-col>
        </v-row>
      </div>
    </BorderCard>

    <BorderCard v-if="!edit" class="mb-3 px-4">
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
        </v-list-item> </v-list
    ></BorderCard>

    <BorderCard v-else class="mb-3 px-4">
      <template v-slot:prepend><v-icon icon="mdi-image" /></template>
      <template v-slot:title>Foto's</template>
      <v-file-input
        id="soloImage"
        class="mt-1 mx-5"
        :multiple="false"
        accept="image/jpeg"
        prepend-icon=""
        prepend-inner-icon="mdi-file"
        label="Nieuwe afbeelding"
      ></v-file-input
      ><v-btn type="submit" color="success" class="ml-5" @click="addSoloImage()"
        >Voeg afbeelding toe</v-btn
      >
      <v-list>
        <v-list-item v-for="entry in images" :key="entry.id"
          ><BorderCard class="mb-3 px-4">
            <template v-slot:prepend
              ><v-img
                :src="ImgProxy.env.url(entry.image)"
                style="width: 75px; height: 75px; object-fit: cover"
            /></template>
            <template v-slot:append
              ><v-icon
                class="ml-2"
                icon="mdi-delete"
                @click="removeSoloImage(entry.image_id)"
              ></v-icon
            ></template> </BorderCard
        ></v-list-item>
      </v-list>
    </BorderCard>

    <v-btn
      @click="submit"
      type="submit"
      color="success"
      prepend-icon="mdi-check"
      class="mb-12"
      >{{ edit ? "Pas wijzigingen toe" : "Maak gebouw" }}</v-btn
    >
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { tryOrAlertAsync } from "@/try";
import {
  Result,
  AddressQuery,
  BuildingQuery,
  UserQuery,
  FileQuery,
} from "@selab-2/groep-1-query";
import { File, BuildingImages } from "@selab-2/groep-1-orm";
import router from "@/router";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { ImgProxy } from "@/imgproxy";
import HomeNumberInputField from "@/components/inputfields/HomeNumberInputField.vue";
import ZipCodeInputField from "@/components/inputfields/ZipCodeInputField.vue";

const possibleUsers = await new UserQuery().getAll({
  admin: false,
  student: false,
  super_student: false,
});

const address = ref({
  street: "",
  number: "0",
  city: "",
  zip_code: "0",
});
const latitude = ref(0);
const longitude = ref(0);

const address_id = ref<number>(0);

const building = ref({
  name: "",
  ivago_id: "",
  description: "",
  syndicus: {
    id: 0,
    first_name: "",
    last_name: "",
  },
  address_id: 0,
  manual_id: 1,
  expectedTimeInHours: 0,
});

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

const images = ref<
  (BuildingImages & {
    image: File;
  })[]
>();

const fileIds = ref<string[]>(["Hoofdafbeelding"]);

const uploadedManual = ref();
const manualName = ref<string>();

function addFileId() {
  fileIds.value.push("Afbeelding " + fileIds.value.length);
}

function removeFileId() {
  if (fileIds.value.length > 1) {
    fileIds.value.pop();
  }
}

const fullBuilding = ref<Result<BuildingQuery>>();

const buildingId = ref<number>(Number(props.id));
const edit: boolean = props.id !== "";

if (edit) {
  const requestedBuilding: Result<BuildingQuery> =
    await new BuildingQuery().getOne(buildingId.value);
  setFields(requestedBuilding);
}

async function setFields(requestedBuilding: Result<BuildingQuery>) {
  await tryOrAlertAsync(async () => {
    const thisSyndicus = requestedBuilding.syndicus;
    const thisAddress = requestedBuilding.address;

    fullBuilding.value = requestedBuilding;
    building.value.name = requestedBuilding.name;
    building.value.ivago_id = requestedBuilding.ivago_id;
    building.value.syndicus = {
      id: thisSyndicus.id,
      first_name: thisSyndicus.first_name,
      last_name: thisSyndicus.last_name,
    };
    building.value.description = requestedBuilding.description
      ? requestedBuilding.description
      : "";
    building.value.manual_id = requestedBuilding.manual?.id ?? 1;

    address_id.value = thisAddress.id;
    building.value.expectedTimeInHours = requestedBuilding.expected_time
      ? Math.floor(requestedBuilding.expected_time / 60)
      : 0;

    address.value = {
      street: thisAddress.street,
      number: thisAddress.number.toString(),
      city: thisAddress.city,
      zip_code: thisAddress.zip_code.toString(),
    };
    latitude.value = requestedBuilding.address.latitude;
    longitude.value = requestedBuilding.address.longitude;
    images.value = requestedBuilding.images;
    manualName.value = requestedBuilding.manual?.original_name;
  });
}

async function addSoloImage() {
  if (fullBuilding.value) {
    const newBuilding: Result<BuildingQuery> =
      await new BuildingQuery().createImage(fullBuilding.value, "soloImage");
    await setFields(newBuilding);
  }
}

async function removeSoloImage(id: number) {
  const removeBuilding = await new BuildingQuery().deleteImage(
    buildingId.value,
    { id: id },
    true,
  );

  setFields(removeBuilding);
}

const submit = () => {
  tryOrAlertAsync(async () => {
    const buildingUnwrapped = building.value;

    const formattedAddress = {
      ...{
        street: address.value.street,
        number: Number(address.value.number),
        city: address.value.city,
        zip_code: Number(address.value.zip_code),
      },
      ...{ latitude: latitude.value, longitude: longitude.value },
    };

    if (!edit) {
      // Create address
      const newAddress = await new AddressQuery().createOne(formattedAddress);

      const file = await new FileQuery().createOne("manual-id");

      const newBuilding = await new BuildingQuery().createOne({
        name: buildingUnwrapped.name,
        address_id: newAddress.id,
        description: buildingUnwrapped.description,
        ivago_id: buildingUnwrapped.ivago_id,
        expected_time: buildingUnwrapped.expectedTimeInHours * 60,
        syndicus_id: buildingUnwrapped.syndicus.id,
        manual_id: file.id,
      });

      for (const fileId of fileIds.value) {
        const element: any = document.getElementById(fileId);
        if (element.files.length > 0) {
          await new BuildingQuery().createImage(newBuilding, fileId);
        }
      }
      await router.push(`/gebouw/${newBuilding.id}`);
    } else {
      if (uploadedManual.value) {
        const file = await new FileQuery().createOne("manual-id");
        building.value.manual_id = file.id;
      }

      // Create address
      const newAddress = await new AddressQuery().updateOne({
        ...{ id: address_id.value },
        ...formattedAddress,
      });

      const newBuilding = await new BuildingQuery().updateOne({
        id: buildingId.value,
        name: buildingUnwrapped.name,
        address_id: newAddress.id,
        description: buildingUnwrapped.description,
        ivago_id: buildingUnwrapped.ivago_id,
        expected_time: buildingUnwrapped.expectedTimeInHours * 60,
        manual_id: building.value.manual_id,
        syndicus_id: buildingUnwrapped.syndicus.id,
      });

      await router.push(`/gebouw/${newBuilding.id}`);
    }
  });
};

function getFullStudentName(s: Result<UserQuery> | undefined): string {
  if (s) {
    return s.first_name + " " + s.last_name;
  } else {
    return " ";
  }
}

/* below are the rule checks*/

const streetRules = [
  // check if street is present
  (street: string) => {
    return street ? true : "Geef een straat op.";
  },
];

const cityRules = [
  // check if city is present
  (city: string) => {
    return city ? true : "Geef een stad op.";
  },

  // check if city only contains chars
  (city: string) => {
    return /^[a-zA-Z]+$/.test(city) ? true : "Stad kan geen nummers bevatten.";
  },
];

const zoom = ref(8);
</script>
