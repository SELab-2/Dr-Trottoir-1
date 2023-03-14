<template>
  <div>
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <!-- Text input field for the street name -->
        <v-text-field
          prepend-inner-icon="mdi-road-variant"
          v-model="address.street"
          label="Straat"
          type="text"
          required
          :variant="readonly ? 'plain' : 'filled'"
          :readonly="readonly"
          @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
        <!-- Text input field for the house number -->
        <v-text-field
          v-model="address.number"
          label="Huisnummer"
          :type="readonly ? 'text' : 'number'"
          required
          :variant="readonly ? 'plain' : 'filled'"
          :readonly="readonly"
          @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <!-- Text input field for the city name -->
        <v-text-field
          prepend-inner-icon="mdi-city-variant"
          v-model="address.city"
          label="Stad"
          type="text"
          required
          @update:model-value="$emit('onUpdate', address)"
          :variant="readonly ? 'plain' : 'filled'"
          :readonly="readonly"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
        <!-- Text input field for the zip code -->
        <v-text-field
          v-model="address.zip_code"
          label="Post code"
          :type="readonly ? 'text' : 'number'"
          required
          @update:model-value="$emit('onUpdate', address)"
          :variant="readonly ? 'plain' : 'filled'"
          :readonly="readonly"
        ></v-text-field>
      </v-col>
    </v-row>
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

import { ref } from "vue";
import Address from "@/components/models/Address";

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
    type: Number,
    default: 0,
  },
  city: {
    type: String,
    default: "",
  },
  zip_code: {
    type: Number,
    default: 0,
  },
});

// reactive state of the address
const address = ref<Address>({
  street: props.street,
  number: props.number,
  city: props.city,
  zip_code: props.zip_code,
});
</script>
