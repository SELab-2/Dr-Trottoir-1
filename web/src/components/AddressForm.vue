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
          v-model="address.street"
          label="Straat"
          type="text"
          required
          @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
        <!-- Text input field for the house number -->
        <v-text-field
          v-model="address.number"
          label="Huisnummer"
          type="number"
          required
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
          v-model="address.city"
          label="Stad"
          type="text"
          required
          @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
        <!-- Text input field for the zip code -->
        <v-text-field
          v-model="address.zip_code"
          label="Post code"
          type="number"
          required
          @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
/*
* All the states are emited to the parents using there name as emit name.
  They can be used like this in the parent
    <AddressForm
        @onUpdate="(newAddress) => parentAddress = newAddress"
    ></AddressForm>
*/

import { ref } from "vue";
import Address from "@/components/models/Address";

// reactive state of the address
const address = ref<Address>({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
});
</script>
