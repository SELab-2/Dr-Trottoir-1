<template>

    <div class="background">
        <div class="form">
            <h4 class="py-2">Persoonlijke gegevens</h4>
            <v-row class="py-0 my-0">
                <v-col
                cols="1"
                style="min-width: 100px; max-width: 100%;"
                class="flex-grow-1 flex-shrink-0 py-0 my-0"
                >
                    <!-- Text input field for the first name -->
                    <v-text-field
                        v-model="first_name"
                        label="Voornaam"
                        type="text"
                        required
                    ></v-text-field>
                </v-col>

                <v-col
                cols="1"
                style="min-width: 100px; max-width: 100%;"
                class="flex-grow-1 flex-shrink-0 py-0 my-0"
                >
                    <!-- Text input field for the last name -->
                    <v-text-field
                        v-model="last_name"
                        label="Achternaam"
                        type="text"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <!-- Text input field for the phone number -->
            <v-text-field
                v-model="phone_number"
                :prepend-inner-icon="'mdi-phone'"
                label="Telefoon nummer"
                type="text"
                required
            ></v-text-field>


            <!-- Text input field for the email -->
            <v-text-field
                v-model="email"
                :prepend-inner-icon="'mdi-email'"
                label="E-mail"
                type="text"
                required
            ></v-text-field>

            <!-- Address input form of the user -->
            <h4 class="py-2">Adres</h4>
            <AddressForm
                @onUpdate="(newAddress) => address = newAddress"
            ></AddressForm>

            <!-- Text input field for the password-->
            <h4 class="py-2">Wachtwoord</h4>
            <v-text-field
                v-model="password1"
                :prepend-inner-icon="'mdi-lock'"
                :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPsswd ? 'text' : 'password'"
                label="Wachtwoord"
                @click:append-inner="showPsswd = !showPsswd"
                bg
            ></v-text-field>

            <!-- Text input field for the password confirmation-->
            <v-text-field
                v-model="password2"
                :prepend-inner-icon="'mdi-lock'"
                :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPsswd ? 'text' : 'password'"
                label="Bevestig wachtwoord"
                @click:append-inner="showPsswd = !showPsswd"
                bg
            ></v-text-field>

            <!-- Selection box to determine the roles -->
            <h4 class="py-2">Rollen</h4>
            <v-select
                chips
                label="Rol"
                :items="['Student', 'Superstudent', 'Syndicus', 'Admin']"
                multiple
                v-model="roles"
            ></v-select>
            <!-- Account creation button -->
            <v-btn>
                Maak Account
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import Address from '@/components/models/Address';
import AddressForm from '@/components/AddressForm.vue';

// reactive first name state
const first_name: string = ''

// reactive last name state
const last_name = ref('')

// reactive phone numeber state
const phone_number = ref('')

// reactive email state
const email = ref('')

// user address
const address = ref<Address>({
    street: '',
    number: 0,
    city: '',
    zip_code: 0
});

// reactive psswd1 state
const password1 = ref('')

// reactive password confirmation state
const password2 = ref('')

// reactive state to know if you must show both password fields or not
const showPsswd = ref(false)

// reactive array keeping track of all the roles for this new user
const roles: Ref<String[]> = ref([])

</script>

<style lang="scss">
    @import "@/assets/styles/base.scss";

    .background{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    .form {
        width: 720px;
        max-width: 90%;
        padding: 10px;
        align-content: center;
    }

</style>
