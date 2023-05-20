<template>
  <HFillWrapper margin="mx-4">
    <v-form v-model="valid" @submit.prevent>
      <!-- Personal info -->
      <BorderCard prepend-icon="mdi-account-details">
        <template v-slot:title> Persoonlijke gegevens </template>
        <v-row class="py-0 my-0 mt-2">
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-5"
          >
            <!-- Text input field for the first name -->
            <v-text-field
              id="firstname"
              v-model="first_name"
              label="Voornaam"
              type="text"
              :rules="nameRules"
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
              id="lastname"
              v-model="last_name"
              label="Achternaam"
              type="text"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <ContactForm
          id="personal"
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
          id="address"
          :class="spacing"
          :street="String(address.street)"
          :city="String(address.city)"
          :number="address.number"
          :zip_code="address.zip_code"
          @onUpdate="(newAddress) => (address = newAddress)"
        ></AddressForm>
      </BorderCard>

      <!-- Text input field for the password-->
      <PasswordInputCard
        class="mt-4"
        prepend-icon="mdi-lock"
        @password="(v) => (password1 = v)"
        @passwordRepeat="(v) => (password2 = v)"
      />

      <!-- Selection box to determine the roles -->
      <BorderCard class="mt-4" prepend-icon="mdi-account-multiple">
        <template v-slot:title> Rollen </template>
        <RolesForm id="roles" v-model="roles" />
      </BorderCard>

      <!-- Account creation button -->
      <div class="d-flex flex-row-reverse my-3">
        <v-btn
          id="create"
          color="success"
          prepend-icon="mdi-check"
          type="submit"
          @click="submitForm"
        >
          Maak account
        </v-btn>
      </div>
    </v-form>
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
import RolesForm from "@/components/forms/RolesForm.vue";
import { UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRouter } from "vue-router";
import PasswordInputCard from "@/components/cards/PasswordInputCard.vue";

const router = useRouter();

// define the spacing for the input fields
const spacing: String = "mx-5";
// reactive first name state

const first_name = ref("");
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
  number: "0",
  city: "",
  zip_code: "0",
});
// reactive psswd1 state
const password1 = ref("");
// reactive password confirmation state
const password2 = ref("");

// reactive array keeping track of all the roles for this new user
const roles: Ref<string[]> = ref([]);

/* below are the rule checks*/

// form model, to know if all forms are filled correctly
const valid = ref(false);

// first name rules
const nameRules = [
  // check if a name was given
  (name: string) => {
    return name ? true : "Geef een naam op.";
  },
];

/* Form submission */

async function submitForm() {
  // check if form is valid before submitting
  if (valid.value) {
    // :to="{ name: 'account_settings', params: { id: 0 } }"
    let user;
    await tryOrAlertAsync(async () => {
      user = await new UserQuery().createOne({
        first_name: first_name.value,
        last_name: last_name.value,
        email: contact.value.email,
        phone: contact.value.phone,
        student: roles.value.includes("Student"),
        super_student: roles.value.includes("Superstudent"),
        admin: roles.value.includes("Admin"),
        //@ts-ignore TODO: fix build errors
        password: password2.value,
        address: {
          //@ts-ignore TODO: fix build errors
          create: {
            city: address.value.city,
            latitude: 0,
            longitude: 0,
            number: Number(address.value.number),
            street: address.value.street,
            zip_code: Number(address.value.zip_code),
          },
        },
        date_added: new Date(),
        last_login: new Date(),
      });
      router.push({ name: "account_settings", params: { id: user.id } });
    });
  }
}
</script>
