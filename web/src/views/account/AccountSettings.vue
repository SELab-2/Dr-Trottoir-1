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
          @click="handleCancelEdit()"
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
        :number="String(user?.address.number)"
        :zip_code="String(user?.address.zip_code)"
        @onUpdate="(newAddress: Address) => handleAddressUpdate(newAddress)"
      ></AddressFrom>
    </BorderCard>

    <!-- Section to pick the roles -->
    <BorderCard
      v-if="useAuthStore().auth?.admin"
      class="mt-4"
      prepend-icon="mdi-account-multiple"
    >
      <template v-slot:title> Rollen </template>
      <RolesForm :readonly="!edit" v-model="roles"/>
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
          @click="handleSavePopup()"
          color="success"
          class="my-3"
          >Sla op</v-btn
        >

        <v-btn
          v-if="
            useAuthStore().auth?.admin && user?.id !== useAuthStore().auth?.id
          "
          prepend-icon="mdi-delete"
          @click="handleRemovePopup()"
          color="error"
          class="mx-5 my-3"
          >Verwijder account</v-btn
        >
      </div>
    </div>
  </HFillWrapper>

  <CardPopup v-model="showPopup" :title="popupTitle" :prepend-icon="popupIcon" width="400">
    <p class="mx-3">
      {{ popupMsg }}
    </p>
    <v-card-actions>
      <v-btn 
        prepend-icon="mdi-close" 
        color="error" 
        @click="showPopup = false"
        variant="elevated"
      >
        Annuleer
      </v-btn>
      <v-btn prepend-icon="mdi-check" color="success" @click="popupSubmit()">
        {{ popupSubmitMsg }}
      </v-btn>
    </v-card-actions>
  </CardPopup>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import ContactForm from "@/components/forms/ContactForm.vue";
import AddressFrom from "@/components/forms/AddressForm.vue";
import Avatar from "@/components/Avatar.vue";
import { Ref, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import RolesForm from "@/components/forms/RolesForm.vue";
import CardPopup from "@/components/popups/CardPopup.vue";
import Address from "@/components/models/Address";

import { Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRouter } from "vue-router";


const router = useRouter();

const props = defineProps(["id"]);

const edit = ref(false);
const password = ref("");
const passwordCheck = ref("");
const passwordHidden = ref(false);
const user: Ref<Result<UserQuery> | null> = ref(null);

function handleAddressUpdate(address: Address){
  if(user.value){
    user.value.address.street = address.street;
    user.value.address.city = address.city;
    user.value.address.number = Number(address.number);
    user.value.address.zip_code = Number(address.zip_code);
  }  
}

async function fetchUser() {
  tryOrAlertAsync(async () => {
    user.value = await new UserQuery().getOne(props.id);
    console.log(user.value);
    if(user.value.admin){
      roles.value.push('Admin');
    }
    if(user.value.super_student){
      roles.value.push('Superstudent');
    } 
    if(user.value.student){
      roles.value.push('Student');
    }
  });
}
fetchUser();


// reactive state for the roles
const roles = ref<string[]>([])

/* Action handle functions */
async function handleCancelEdit() {
  fetchUser();
  edit.value = false;  
}

async function handleRemove() {
  await tryOrAlertAsync(async () => {new UserQuery().deleteOne({id: user.value?.id})});
  showPopup.value = false;
  edit.value = false;
  router.push({name: "user_overview"})
}

function handleRemovePopup(){
  popupIcon.value = "mdi-delete-alert-outline";
  popupTitle.value = "Verwijder account";
  popupMsg.value = "Je staat op het punt deze account permanent te verwijderen. Ben je zeker dat je wilt verdergaan?";
  popupSubmitMsg.value = "Verwijder account";
  popupSubmit.value = handleRemove;
  showPopup.value = true;
}

async function handleSave() {
  // TODO: API-call to save the account
  await tryOrAlertAsync(async () => {
      await new UserQuery().updateOne({
        id: user.value?.id,
        email: user.value?.email,
        first_name: user.value?.first_name,
        last_name: user.value?.last_name,
        phone: user.value?.phone,
        address_id: user.value?.address_id,
        student: roles.value.includes('Student'),
        super_student: roles.value.includes('Superstudent'),
        admin: roles.value.includes('Admin'), 
      });
    });
  showPopup.value = false;
  edit.value = false;
}

function handleSavePopup(){
  popupIcon.value = "mdi-content-save-alert-outline";
  popupTitle.value = "Bewaar aanpassingen";
  popupMsg.value = "Je staat op het punt deze account permanent te bewerken. Ben je zeker dat je wilt verdergaan?";
  popupSubmitMsg.value = "Bewaar aanpassingen";
  popupSubmit.value = handleSave;
  showPopup.value = true;
}

// popup content

const showPopup = ref(false);
const popupIcon = ref("")
const popupTitle = ref("");
const popupMsg = ref("");
const popupSubmitMsg = ref("");
const popupSubmit: Ref<() => void> = ref(() => {});


</script>

<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
