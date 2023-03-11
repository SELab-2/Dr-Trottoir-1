<template>
    <div>
        <!-- Top section with profile picture and  edit button-->
        <div
            class="d-flex"
        >
            <v-list-item
                class="me-auto"
                lines="two"
                prepend-avatar="https://avatars.githubusercontent.com/u/38297449?v=4"
                title="Jens Pots"
                subtitle="Superstudent"
            ></v-list-item>
            <v-btn
                v-if="!edit"
                prepend-icon="mdi-pencil"     
                @click="edit = !edit"           
            >Bewerk Account</v-btn>
            <v-btn
                v-else
                @click="edit = !edit"
            >Sla aanpassingen op</v-btn>
        </div>

        <!-- Sectie met de contact gegevens -->
        <v-card
            class="mt-4"
            prepend-icon="mdi-account-details"
        >
            <template v-slot:title>
            Contact
            </template>
            <v-list density="compact" class="mx-10">
                <v-text-field
                prepend-inner-icon="mdi-phone"
                    label="Telefoon nummer"
                    v-model="gsm"
                    :variant="edit ?  'filled' : 'plain'"
                    :readonly="!edit"
                ></v-text-field>
                <v-text-field
                    prepend-inner-icon="mdi-email"
                    label="e-mail"
                    v-model="email"
                    :variant="edit ?  'filled' : 'plain'"
                    :readonly="!edit"
                ></v-text-field>
            </v-list>
        </v-card>

        <!-- Sectie met het adress -->
        <v-card
            class="mt-4"
            prepend-icon="mdi-map-marker"
        >
            <template v-slot:title>
            Adres
            </template>

            <v-card-text
                v-if="edit"
            >
            Hier komt address input component zodra PR #36 approved wordt.
            </v-card-text>
            <v-card-text
                v-else
            >
            Krijgslaan 281 - 9000 Gent
            </v-card-text>
        </v-card>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// reactive state to keep track if we are edeting or not
const edit = ref(false)

const email = ref('jens.pots@example.com')

const gsm = ref('+32 412 34 56 78')


</script>