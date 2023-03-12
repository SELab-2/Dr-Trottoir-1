<template>
    <div>
        <!-- Top section with profile picture and edit button-->
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
                color="primary"      
            >Bewerk Account</v-btn>
            <v-btn
                v-else
                prepend-icon="mdi-delete"
                @click="edit = !edit"
                color="error"
            >Verwijder aanpassingen</v-btn>
        </div>

        <!-- Section with the contact info -->
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

        <!-- Section with the adress -->
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

        <!-- Section to set new password -->
        <v-card
            v-if="edit"
            class="mt-4"
            prepend-icon="mdi-lock"
        >
            <template v-slot:title>
            Nieuw wachtwoord
            </template>
            <v-list density="compact" class="mx-10">
                <v-text-field
                    v-model="password1"
                    :prepend-inner-icon="'mdi-lock'"
                    :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPsswd ? 'text' : 'password'"
                    label="Nieuw wachtwoord"
                    @click:append-inner="showPsswd = !showPsswd"
                    bg
                ></v-text-field>
                <v-text-field
                    v-model="password2"
                    :prepend-inner-icon="'mdi-lock'"
                    :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPsswd ? 'text' : 'password'"
                    label="Bevestig nieuw wachtwoord"
                    @click:append-inner="showPsswd = !showPsswd"
                    bg
                ></v-text-field>
            </v-list>
        </v-card>

        <!-- Section that allows to save the settings -->
        <v-card
            v-if="edit"
            class="mt-4"
            prepend-icon="mdi-check"
        >
            <template v-slot:title>
            Sla bewerkingen op
            </template>
            <div class="d-flex">

                <v-text-field
                    class="mx-10 me-auto"
                    v-model="confirm_psswd"
                    :prepend-inner-icon="'mdi-lock'"
                    :append-inner-icon="show_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show_confirm ? 'text' : 'password'"
                    label="Huidig wachtwoord"
                    @click:append-inner="show_confirm = !show_confirm"
                    bg
                ></v-text-field>

                <v-btn
                    prepend-icon="mdi-check"
                    @click="edit = !edit"
                    color="success"
                    class="ma-3"
                >Sla op</v-btn>
            </div>
            
        </v-card>

    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// reactive state to keep track if we are edeting or not
const edit = ref(false)

const email = ref('jens.pots@example.com')

const gsm = ref('+32 412 34 56 78')

// reactive states for the new password
const password1 = ref('')
const password2 = ref('')
const showPsswd = ref(false)

// reactive state for the submission
const confirm_psswd = ref('')
const show_confirm = ref(false)

</script>