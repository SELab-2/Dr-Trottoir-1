<template>
  <div>
    <!-- Top section with profile picture and edit button-->
    <div class="d-flex">
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
        >Bewerk Account</v-btn
      >
      <v-btn
        v-else
        prepend-icon="mdi-delete"
        @click="edit = !edit"
        color="error"
        >Verwijder aanpassingen</v-btn
      >
    </div>

    <!-- Section with the contact info -->
    <v-card class="mt-4" prepend-icon="mdi-account-details">
      <template v-slot:title> Persoonlijke gegevens </template>
      <!-- Name, only shows when the admin wants to edit -->
      <div v-if="isAdmin && edit" class="mx-10">
        <!-- Text input field for the first name -->
        <v-text-field
          v-model="firstname"
          label="Voornaam"
          type="text"
          required
        ></v-text-field>
        <!-- Text input field for the last name -->
        <v-text-field
          v-model="lastname"
          label="Voornaam"
          type="text"
          required
        ></v-text-field>
      </div>
      <ContacForm
        class="mx-10"
        :readonly="!edit"
        :phone="default_phone"
        :email="default_email"
        @onUpdate="(newContact) => (contact = newContact)"
      >
      </ContacForm>
    </v-card>

    <!-- Section with the adress -->
    <v-card class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressFrom
        class="mx-10"
        :readonly="!edit"
        :street="default_street"
        :city="default_city"
        :number="default_number"
        :zip_code="default_zip_code"
        @onUpdate="(newAddress) => (address = newAddress)"
      ></AddressFrom>
    </v-card>

    <!-- Section to pick the roles -->
    <v-card v-if="isAdmin" class="mt-4" prepend-icon="mdi-account-multiple">
      <template v-slot:title> Rollen </template>
      <v-select
        v-if="edit"
        class="mx-10"
        chips
        label="Rollen"
        :items="['Student', 'Superstudent', 'Syndicus', 'Admin']"
        multiple
        :variant="!edit ? 'plain' : 'filled'"
        :readonly="!edit"
        v-model="roles"
      ></v-select>
      <v-list lines="one" density="compact" v-if="!edit" class="mx-10">
        <v-list-item
          v-for="role in roles"
          :key="String(role)"
          :title="'- ' + String(role)"
        ></v-list-item>
      </v-list>
    </v-card>

    <!-- Section to set new password -->
    <v-card v-if="edit" class="mt-4" prepend-icon="mdi-lock">
      <template v-slot:title> Nieuw wachtwoord </template>
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
    <v-card v-if="edit" class="mt-4" prepend-icon="mdi-check">
      <template v-slot:title> Sla bewerkingen op </template>
      <div class="d-flex">
        <v-text-field
          class="mx-10 me-auto"
          v-model="confirm_psswd"
          :prepend-inner-icon="'mdi-lock'"
          :append-inner-icon="show_confirm ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_confirm ? 'text' : 'password'"
          :label="isAdmin ? 'Jouw admin wachtwoord' : 'Huidig wachtwoord'"
          @click:append-inner="show_confirm = !show_confirm"
          bg
        ></v-text-field>

        <v-btn
          prepend-icon="mdi-check"
          @click="edit = !edit"
          color="success"
          class="ma-3"
          >Sla op</v-btn
        >
      </div>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
import ContacForm from "@/components/ContactForm.vue";
import Address from "@/components/models/Address";
import AddressFrom from "@/components/AddressForm.vue";
import Contact from "@/components/models/Contact";
import { ref } from "vue";

const props = defineProps(["gebruikerid", "isadmin"]);
const isAdmin = ref<Boolean>(props.isadmin === "true");

// reactive state for name
const firstname = ref("Jens");
const lastname = ref("Pots");

// reactive state for the roles
const roles = ref<String[]>(["Student", "Superstudent"]);

// reactive state to keep track if we are edeting or not
const edit = ref(false);

// contact data
const default_phone = "+32 412 34 56 78";
const default_email = "jenst.pots@example.com";
const contact = ref<Contact>({
  phone: default_phone,
  email: default_email,
});

// address data
const default_street = "Krijgslaan";
const default_number = 281;
const default_city = "Gent";
const default_zip_code = 9000;

const address = ref<Address>({
  street: default_street,
  number: default_number,
  city: default_city,
  zip_code: default_zip_code,
});

// reactive states for the new password
const password1 = ref("");
const password2 = ref("");
const showPsswd = ref(false);

// reactive state for the submission
const confirm_psswd = ref("");
const show_confirm = ref(false);
</script>
<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
