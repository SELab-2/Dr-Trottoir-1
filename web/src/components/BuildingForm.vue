<template>
    <div>
        <!-- Text input field for the building name -->
        <v-text-field
            v-model="building.name"
            label="Naam gebouw"
            type="text"
            required
            @update:model-value="$emit('onUpdate', building)"
        ></v-text-field>

        <!-- Text input field for the building ivago id -->
        <v-text-field
            v-model="building.ivago_id"
            label="Ivago id"
            type="text"
            required
            @update:model-value="$emit('onUpdate', building)"
        ></v-text-field>

        <!-- Form for the address of the building -->
        <AddressForm
            @onUpdate="(newAddress) => building.address = newAddress"
            @update:model-value="$emit('onUpdate', building)"
        ></AddressForm>

    </div>    

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Building from './models/Building';
import AddressForm from './AddressForm.vue';

// reactive building state
const building = ref<Building>({
    // building name
    name: '',

    // ivago id
    ivago_id: '',

    // building address
    address: {
        street: '',
        number: 0,
        city: '',
        zip_code: 0
    }
});



</script>