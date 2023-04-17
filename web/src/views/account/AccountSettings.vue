<template>
  <HFillWrapper margin="mx-4">
    <!-- Top section with profile picture and edit button-->
    <div class="d-flex">
      <v-list-item
        class="me-auto"
        lines="two"
        :title="`${firstname} ${lastname}`"
        :subtitle="roles.join(' ')"
      >
        <template v-slot:prepend>
          <Avatar :name="`${firstname} ${lastname}`" />
        </template>
      </v-list-item>
      <div v-if="isAdmin || account_id === user_id">
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
    </div>

    <!-- Section with the contact info -->
    <BorderCard class="mt-4" prepend-icon="mdi-account-details">
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
    </BorderCard>

    <!-- Section with the adress -->
    <BorderCard class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressFrom
        v-if="address"
        :class="edit ? spacing : 'mx-10'"
        :readonly="!edit"
        :street="String(address.street)"
        :city="String(address.city)"
        :number="address.number"
        :zip_code="address.zip_code"
        @onUpdate="(newAddress) => (address = newAddress)"
      ></AddressFrom>
    </BorderCard>

    <!-- Section to pick the roles -->
    <BorderCard v-if="isAdmin" class="mt-4" prepend-icon="mdi-account-multiple">
      <template v-slot:title> Rollen </template>
      <v-row v-if="edit" class="ml-1 mb-0">
        <v-col>
          <v-checkbox
            v-model="roles"
            label="Student"
            value="Student"
            color="primary"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-model="roles"
            label="Superstudent"
            value="Superstudent"
            color="primary"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col>
          <v-checkbox
            v-model="roles"
            label="Syndicus"
            value="Syndicus"
            color="primary"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-model="roles"
            label="Admin"
            value="Admin"
            color="primary"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>
      <v-list lines="one" density="compact" v-if="!edit" class="mx-10">
        <v-list-item
          v-for="role in roles"
          :key="String(role)"
          :title="'- ' + String(role)"
        ></v-list-item>
      </v-list>
    </BorderCard>

    <!-- Section to set new password -->
    <BorderCard v-if="edit" class="mt-4" prepend-icon="mdi-lock">
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
    </BorderCard>

    <!-- Section that allows to save and remove the account -->
    <div v-if="edit" class="my-4">
      <div class="d-flex flex-row-reverse">
        <v-btn
          prepend-icon="mdi-check"
          @click="edit = !edit"
          color="success"
          class="my-3"
          >Sla op</v-btn
        >

        <v-btn
          v-if="isAdmin && account_id !== user_id"
          prepend-icon="mdi-delete"
          @click="edit = !edit"
          color="error"
          class="mx-5 my-3"
          >Verwijder account</v-btn
        >
      </div>
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import ContactForm from "@/components/forms/ContactForm.vue";
import AddressFrom from "@/components/forms/AddressForm.vue";
import Contact from "@/components/models/Contact";
import Avatar from "@/components/Avatar.vue";
import { Ref, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getRoles } from "@/assets/scripts/roles";
import { UserQuery } from "@selab-2/groep-1-query";
import { User, Address } from "@selab-2/groep-1-orm";

// define the spacing for the input fields
const spacing: String = "mx-4";
// get the account id from the route
const props = defineProps(["id"]);
const account_id = Number(props.id);

const isAdmin: Boolean = useAuthStore().auth!.admin;
const user_id = useAuthStore().auth!.id;

const user: Ref<(User & { address: Address }) | null> = ref(null);
try {
  user.value = (await new UserQuery().getOne(props.id)) as User & {
    address: Address;
  };
} catch (e) {
  alert(e);
}

// reactive state for name
const firstname = ref(user.value?.first_name);
const lastname = ref(user.value?.last_name);
// reactive state for the roles
const roles = ref<String[]>(getRoles(user.value));

// reactive state to keep track if we are editing or not
const edit = ref(false);
// contact data
const contact = ref<Contact>({
  phone: user.value?.phone ? user.value?.phone : "",
  email: user.value?.email ? user.value?.email : "",
});
// address data
const address = ref(user.value?.address);

// reactive states for the new password
const password1 = ref("");
const password2 = ref("");
const showPsswd = ref(false);
</script>
<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
