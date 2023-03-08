<template>
    <div>
        <!-- Text input field for the street name -->
        <v-text-field
            v-model="street"
            label="Straat"
            type="text"
            required
            @update:model-value="$emit('street', street)"
        ></v-text-field>

        <!-- Text input field for the house number -->
        <v-text-field
            v-model="number"
            label="Huisnummer"
            type="number"
            required
            @update:model-value="$emit('number', number)"
        ></v-text-field>

        <!-- Text input field for the city name -->
        <v-text-field
            v-model="city"
            label="Stad"
            type="text"
            required
            @update:model-value="$emit('city', city)"
        ></v-text-field>

        <!-- Text input field for the zip code -->
        <v-text-field
            v-model="zip_code"
            label="Post code"
            type="number"
            required
            @update:model-value="$emit('zip_code', zip_code)"
        ></v-text-field>
    </div>

</template>
<script lang="ts" setup>
/*
* All the states are emited to the parents using there name as emit name.
* 
*/

import { ref, Ref } from 'vue'

// reactive state of the street name
const street = ref('')

// reactive state of the house number
const number = ref(0)

// reactive state of the city name
const city = ref('')

// reactive state of the zip code
const zip_code = ref(0)

</script>