<template>
  <HFillWrapper margin="mx-4">
    <!-- Top section with profile picture and edit button-->
    <div class="d-flex">
      <v-list-item
        class="me-auto"
        lines="two"
        :title="`${firstname} ${lastname}`"
        subtitle="Superstudent"
      >
        <template v-slot:prepend>
          <Avatar :name="`${firstname} ${lastname}`" />
        </template>
      </v-list-item>
      <v-btn
        v-if="!edit"
        prepend-icon="mdi-pencil"
        @click="edit = !edit"
        color="primary"
        >Bewerk Account</v-btn
      >
      <v-btn
        v-else
        prepend-icon="mdi-close"
        @click="edit = !edit"
        color="warning"
        >Annuleer aanpassingen</v-btn
      >
    </div>

    <!-- Section with the contact info -->
    <v-card class="mt-4" prepend-icon="mdi-account-details">
      <template v-slot:title> Persoonlijke gegevens </template>
      <!-- Name, only shows when the admin wants to edit -->
      <v-row class="py-0 my-0" v-if="isAdmin && edit">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-4"
        >
          <!-- Text input field for the first name -->
          <v-text-field
            v-model="firstname"
            label="Voornaam"
            type="text"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0 mr-4"
        >
          <!-- Text input field for the last name -->
          <v-text-field
            v-model="lastname"
            label="Achternaam"
            type="text"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <ContactForm
        :class="edit ? spacing : 'mx-10'"
        :readonly="!edit"
        :phone="String(contact.phone)"
        :email="String(contact.email)"
        @onUpdate="(newContact) => (contact = newContact)"
      >
      </ContactForm>
    </v-card>

    <!-- Section with the adress -->
    <v-card class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressFrom
        :class="edit ? spacing : 'mx-10'"
        :readonly="!edit"
        :street="String(address.street)"
        :city="String(address.city)"
        :number="address.number"
        :zip_code="address.zip_code"
        @onUpdate="(newAddress) => (address = newAddress)"
      ></AddressFrom>
    </v-card>

    <!-- Section to pick the roles -->
    <v-card v-if="isAdmin" class="mt-4" prepend-icon="mdi-account-multiple">
      <template v-slot:title> Rollen </template>
      <v-select
        v-if="edit"
        :class="spacing"
        chips
        label="Rollen"
        :items="['Student', 'Superstudent', 'Syndicus', 'Admin']"
        multiple
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
      <v-list density="compact" :class="spacing">
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
    <v-card v-if="edit" class="my-4" prepend-icon="mdi-check">
      <template v-slot:title> Sla bewerkingen op </template>
      <div class="d-flex">
        <v-text-field
          class="mx-5 me-auto"
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
          class="mx-5 my-3"
          >Sla op</v-btn
        >
      </div>
    </v-card>
    <v-divider :thickness="3" />

    <!-- Section that allows to remove the account -->
    <v-card v-if="edit" class="my-4" prepend-icon="mdi-delete">
      <template v-slot:title> Verwijder account </template>
      <div class="d-flex">
        <v-text-field
          class="mx-5 me-auto"
          v-model="remove_psswd"
          :prepend-inner-icon="'mdi-lock'"
          :append-inner-icon="show_remove ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_remove ? 'text' : 'password'"
          :label="isAdmin ? 'Jouw admin wachtwoord' : 'Huidig wachtwoord'"
          @click:append-inner="show_remove = !show_remove"
          bg
        ></v-text-field>

        <v-btn
          prepend-icon="mdi-delete"
          @click="edit = !edit"
          color="error"
          class="mx-5 my-3"
          >Verwijder account</v-btn
        >
      </div>
    </v-card>
  </HFillWrapper>
</template>
<script lang="ts" setup>
import ContactForm from "@/components/forms/ContactForm.vue";
import Address from "@/components/models/Address";
import AddressFrom from "@/components/forms/AddressForm.vue";
import Contact from "@/components/models/Contact";
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

// define the spacing for the input fields
const spacing: String = "mx-4";
const props = defineProps(["gebruikerid", "isadmin"]);
const isAdmin = ref<Boolean>(props.isadmin === "true");
// reactive state for name
const firstname = ref("Mats");
const lastname = ref("Van Belle");
// reactive state for the roles
const roles = ref<String[]>(["Student", "Superstudent"]);
// reactive state to keep track if we are edeting or not
const edit = ref(false);
// contact data
const default_phone = "+32 412 34 56 78";
const default_email = "mats.vanbelle@example.com";
const contact = ref<Contact>({
  phone: default_phone,
  email: default_email,
});
// address data
const address = ref<Address>({
  street: "Krijgslaan",
  number: 281,
  city: "Gent",
  zip_code: 9000,
});
// reactive states for the new password
const password1 = ref("");
const password2 = ref("");
const showPsswd = ref(false);
// reactive state for the submission
const confirm_psswd = ref("");
const show_confirm = ref(false);
// state for the remove password
const remove_psswd = ref("");
const show_remove = ref(false);
</script>
<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
