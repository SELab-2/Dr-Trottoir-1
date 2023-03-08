<template>

    <div>
        
        <!-- Text input field for the first name -->
        <v-text-field
            v-model="first_name"
            label="Voornaam"
            type="text"
            required    
        ></v-text-field>

        <!-- Text input field for the last name -->
        <v-text-field
            v-model="last_name"
            label="Achternaam"
            type="text"
            required    
        ></v-text-field>

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
        <AddressForm
            @onUpdate="(newAddress) => address = newAddress"
        ></AddressForm>

        <!-- Text input field for the password-->
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

        <!-- Selection box to determine the roles-->
        <v-select
            chips
            label="Rol"
            :items="['Student', 'Superstudent', 'Syndicus', 'Admin']"
            multiple
            v-model="roles"
        ></v-select>
        <div v-if="roles.includes('Syndicus')">
            Extra input velden nodig voor Syndicus.
        </div>
        <v-btn>
            Maak Account
        </v-btn>

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

<style lang="sass">

</style>