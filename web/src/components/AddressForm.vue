<template>
    <div>
        <!-- Text input field for the street name -->
        <v-text-field
            v-model="address.street"
            label="Straat"
            type="text"
            required
            @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>

        <!-- Text input field for the house number -->
        <v-text-field
            v-model="address.number"
            label="Huisnummer"
            type="number"
            required
            @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>

        <!-- Text input field for the city name -->
        <v-text-field
            v-model="address.city"
            label="Stad"
            type="text"
            required
            @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>

        <!-- Text input field for the zip code -->
        <v-text-field
            v-model="address.zip_code"
            label="Post code"
            type="number"
            required
            @update:model-value="$emit('onUpdate', address)"
        ></v-text-field>
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

import { ref } from 'vue'
import Address from '@/components/models/Address';

// reactive state of the address
const address = ref<Address>({
    street: '',
    number: 0,
    city: '',
    zip_code: 0
});

</script>