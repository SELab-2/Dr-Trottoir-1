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

        <!-- Text input field for the password-->
        <v-text-field
            v-model="password1"
            :prepend-inner-icon="'mdi-lock'"
            :append-inner-icon="showPsswd1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPsswd1 ? 'text' : 'password'"
            label="Wachtwoord"
            @click:append-inner="showPsswd1 = !showPsswd1"
            bg
        ></v-text-field>

        <!-- Text input field for the password confirmation-->
        <v-text-field
            v-model="password2"
            :prepend-inner-icon="'mdi-lock'"
            :append-inner-icon="showPsswd1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPsswd1 ? 'text' : 'password'"
            label="Bevestig wachtwoord"
            @click:append-inner="showPsswd1 = !showPsswd1"
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

<script lang="ts">
import { def } from '@vue/shared';

export default{
    data() {
        return{
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            password1: '',
            showPsswd1: false,
            password2: '',
            roles: [] as String[]
        }
    },
    methods:{
        handleCreation(){
            console.log('create new account')

        }
    }
}
</script>

<style lang="sass">

</style>