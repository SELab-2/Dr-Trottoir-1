<template>
  <HFillWrapper margin="mx-4">
    <!-- Personal info -->
    <BorderCard prepend-icon="mdi-account-details">
      <template v-slot:title> Persoonlijke gegevens </template>
      <v-row class="py-0 my-0">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-5"
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
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0 mr-5"
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

      <ContactForm
        :class="spacing"
        :phone="String(contact.phone)"
        :email="String(contact.email)"
        @onUpdate="(newContact) => (contact = newContact)"
      >
      </ContactForm>
    </BorderCard>

    <!-- Address input form of the user -->
    <!-- Section with the adress -->
    <BorderCard class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressForm
        :class="spacing"
        :street="String(address.street)"
        :city="String(address.city)"
        :number="address.number"
        :zip_code="address.zip_code"
        @onUpdate="(newAddress) => (address = newAddress)"
      ></AddressForm>
    </BorderCard>

    <!-- Text input field for the password-->
    <BorderCard class="mt-4" prepend-icon="mdi-lock">
      <template v-slot:title> Wachtwoord </template>
      <v-list density="compact" :class="spacing">
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
      </v-list>
    </BorderCard>

    <!-- Selection box to determine the roles -->
    <BorderCard class="mt-4" prepend-icon="mdi-account-multiple">
      <template v-slot:title> Rollen </template>
      <v-select
        :class="spacing"
        chips
        label="Rollen"
        :items="['Student', 'Superstudent', 'Syndicus', 'Admin']"
        multiple
        v-model="roles"
      ></v-select>
    </BorderCard>

    <!-- Account creation button -->
    <div class="d-flex flex-row-reverse my-3">
      <v-btn color="success" prepend-icon="mdi-check" to="settings/0/false">
        Maak account</v-btn
      >
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import Address from "@/components/models/Address";
import AddressForm from "@/components/forms/AddressForm.vue";
import Contact from "@/components/models/Contact";
import ContactForm from "@/components/forms/ContactForm.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
// define the spacing for the input fields
const spacing: String = "mx-5";
// reactive first name state
const first_name: string = "";
// reactive last name state
const last_name = ref("");
// contact data
const contact = ref<Contact>({
  phone: "",
  email: "",
});
// user address
const address = ref<Address>({
  street: "",
  number: 0,
  city: "",
  zip_code: 0,
});
// reactive psswd1 state
const password1 = ref("");
// reactive password confirmation state
const password2 = ref("");
// reactive state to know if you must show both password fields or not
const showPsswd = ref(false);
// reactive array keeping track of all the roles for this new user
const roles: Ref<String[]> = ref([]);
</script>
