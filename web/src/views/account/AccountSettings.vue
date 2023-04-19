<template>
  <HFillWrapper margin="mx-4" v-if="user !== null">
    <!-- Top section with profile picture and edit button-->
    <div class="d-flex">
      <v-list-item
        class="me-auto"
        lines="two"
        :title="`${user.first_name} ${user.last_name}`"
      >
        <template v-slot:prepend>
          <Avatar :name="`${user.first_name} ${user.last_name}`" />
        </template>
      </v-list-item>
      <div
        v-if="
          useAuthStore().auth?.admin || user?.id === useAuthStore().auth?.id
        "
      >
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
      <v-row class="py-0 my-0" v-if="useAuthStore().auth?.admin && edit">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0 ml-4"
        >
          <!-- Text input field for the first name -->
          <v-text-field
            v-model="user!.first_name"
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
            v-model="user!.last_name"
            label="Achternaam"
            type="text"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <ContactForm
        :class="edit ? 'mx-4' : 'mx-10'"
        :readonly="!edit"
        :phone="user?.phone"
        :email="user?.email"
      >
      </ContactForm>
    </BorderCard>

    <!-- Section with the adress -->
    <BorderCard class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressFrom
        :class="edit ? 'mx-4' : 'mx-10'"
        :readonly="!edit"
        :street="user?.address.street"
        :city="user?.address.city"
        :number="user?.address.number"
        :zip_code="user?.address.zip_code"
      ></AddressFrom>
    </BorderCard>

    <!-- Section to pick the roles -->
    <BorderCard
      v-if="useAuthStore().auth?.admin"
      class="mt-4"
      prepend-icon="mdi-account-multiple"
    >
      <template v-slot:title> Rollen </template>
      <v-row class="ml-1 mb-0">
        <v-col>
          <v-checkbox
            v-model="user!.student"
            label="Student"
            value="Student"
            color="primary"
            density="compact"
            hide-details
            :disabled="!edit"
          />
          <v-checkbox
            v-model="user!.super_student"
            label="Superstudent"
            value="Superstudent"
            color="primary"
            density="compact"
            hide-details
            :disabled="!edit"
          />
        </v-col>
        <v-col>
          <v-checkbox
            v-model="user!.admin"
            label="Admin"
            value="Admin"
            color="primary"
            density="compact"
            hide-details
            :disabled="!edit"
          />
        </v-col>
      </v-row>
    </BorderCard>

    <!-- Section to set new password -->
    <BorderCard v-if="edit" class="mt-4" prepend-icon="mdi-lock">
      <template v-slot:title> Nieuw wachtwoord </template>
      <v-list density="compact" class="mx-4">
        <v-text-field
          v-model="password"
          :prepend-inner-icon="'mdi-lock'"
          :append-inner-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordHidden ? 'text' : 'password'"
          label="Nieuw wachtwoord"
          @click:append-inner="passwordHidden = !passwordHidden"
          bg
        ></v-text-field>
        <v-text-field
          v-model="passwordCheck"
          :prepend-inner-icon="'mdi-lock'"
          :append-inner-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordHidden ? 'text' : 'password'"
          label="Bevestig nieuw wachtwoord"
          @click:append-inner="passwordHidden = !passwordHidden"
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
          v-if="
            useAuthStore().auth?.admin && user?.id !== useAuthStore().auth?.id
          "
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
import Avatar from "@/components/Avatar.vue";
import { Ref, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const props = defineProps(["id"]);

const edit = ref(false);
const password = ref("");
const passwordCheck = ref("");
const passwordHidden = ref(false);
const user: Ref<Result<UserQuery> | null> = ref(null);

tryOrAlertAsync(async () => {
  user.value = await new UserQuery().getOne(props.id);
});
</script>

<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
