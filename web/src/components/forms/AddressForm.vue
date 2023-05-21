<template>
  <div>
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
          :variant="readonly ? 'plain' : 'outlined'"
          :readonly="readonly"
          :rules="streetRules"
          @update:model-value="$emit('onUpdate', address)"
        >
          <template v-slot:prepend-inner>
            <v-icon icon="mdi-road-variant" :class="readonly ? 'mt-1' : ''" />
          </template>
        </v-text-field>
      </v-col>
      <v-col
        v-show="!mobile"
        cols="3"
        class="flex-grow-0 flex-shrink-0 py-0 my-0"
      >
        <!-- Text input field for the house number -->
        <HomeNumberInputField
          :readonly="readonly"
          v-model="address.number"
          @update:model-value="$emit('onUpdate', address)"
        />
      </v-col>
    </v-row>

    <!-- Text input field for the house number -->
    <HomeNumberInputField
      v-show="mobile"
      :readonly="readonly"
      v-model="address.number"
      @update:model-value="$emit('onUpdate', address)"
    />
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
          @update:model-value="$emit('onUpdate', address)"
          :variant="readonly ? 'plain' : 'outlined'"
          :readonly="readonly"
          :rules="cityRules"
        >
          <template v-slot:prepend-inner>
            <v-icon icon="mdi-city-variant" :class="readonly ? 'mt-1' : ''" />
          </template>
        </v-text-field>
      </v-col>
      <v-col
        v-show="!mobile"
        cols="3"
        class="flex-grow-0 flex-shrink-0 py-0 my-0"
      >
        <!-- Text input field for the zip code -->
        <ZipCodeInputField
          :readonly="readonly"
          v-model="address.zip_code"
          @update:model-value="$emit('onUpdate', address)"
        />
      </v-col>
    </v-row>
    <ZipCodeInputField
      v-show="mobile"
      :readonly="readonly"
      v-model="address.zip_code"
      @update:model-value="$emit('onUpdate', address)"
    />
  </div>
</template>
<script lang="ts" setup>
/*
* All the states are emited to the parents using onUpdate emit.
  They can be used like this in the parent
  Default values can be set, but are not required.
    <AddressForm
        :street = "parentstreet"
        @onUpdate="(newAddress) => parentAddress = newAddress"
    ></AddressForm>
*/

import { Ref, ref } from "vue";
import Address from "@/components/models/Address";
import { useDisplay } from "vuetify";
import HomeNumberInputField from "@/components/inputfields/HomeNumberInputField.vue";
import ZipCodeInputField from "@/components/inputfields/ZipCodeInputField.vue";

const display = useDisplay();
const mobile: Ref<boolean> = display.mobile;

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  number: {
    type: String,
    default: "0",
  },
  city: {
    type: String,
    default: "",
  },
  zip_code: {
    type: String,
    default: "0",
  },
});

// reactive state of the address
const address = ref<Address>({
  street: props.street,
  number: props.number,
  city: props.city,
  zip_code: props.zip_code,
});

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
</script>
