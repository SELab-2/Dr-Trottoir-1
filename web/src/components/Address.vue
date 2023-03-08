<template>
    <div>
        <v-text-field
            v-model="street"
            label="Straat"
            type="text"
            required
            @update:model-value="$emit('onUpdate', street)"
        ></v-text-field>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'

const street = ref('')

</script>