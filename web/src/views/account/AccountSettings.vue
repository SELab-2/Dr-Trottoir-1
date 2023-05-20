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
        v-show="
          (useAuthStore().auth?.admin || user.id === useAuthStore().auth?.id) &&
          !user.deleted
        "
        class="align-self-center"
      >
        <!-- Not mobile edit button -->
        <v-btn
          id="editcancel"
          class="text-none"
          v-show="!mobile"
          :prepend-icon="!edit ? 'mdi-pencil' : 'mdi-close'"
          @click="
            async () => {
              if (!edit) {
                handleBeginEdit();
              } else {
                handleCancelEdit();
              }
            }
          "
          :color="!edit ? 'primary' : 'warning'"
        >
          {{ !edit ? "Bewerk Account" : "Annuleer aanpassingen" }}
        </v-btn>
        <!-- Mobile edit button -->
        <v-btn
          id="mobileedit"
          v-show="mobile"
          :icon="!edit ? 'mdi-pencil' : 'mdi-close'"
          @click="
            () => {
              if (!edit) {
                handleBeginEdit();
              } else {
                handleCancelEdit();
              }
            }
          "
          variant="text"
        />
      </div>
    </div>
    <!-- Display if user has been removed -->
    <RemovedCard
      :show="useAuthStore().auth?.admin && user.deleted"
      title="Deze account is verwijderd"
      :restore="
        async () => {
          await restore();
        }
      "
    />
    <UserAnalyticCard
      v-if="
        !edit &&
        (useAuthStore().auth?.admin || useAuthStore().auth?.super_student) &&
        !user.deleted
      "
      :id="user.id"
    />
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
            id="firstname"
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
            id="lastname"
            v-model="user!.last_name"
            label="Achternaam"
            type="text"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <ContactForm
        id="personal"
        :class="edit ? 'mx-4' : 'mx-10'"
        :readonly="!edit"
        :phone="user.phone"
        :email="user.email"
        @onUpdate="(contact: Contact) => handleContactUpdate(contact)"
      />
    </BorderCard>

    <!-- Section with the adress -->
    <BorderCard class="mt-4" prepend-icon="mdi-map-marker">
      <template v-slot:title> Adres </template>
      <AddressForm
        id="address"
        :class="edit ? 'mx-4' : 'mx-10'"
        :readonly="!edit"
        :street="user?.address.street"
        :city="user?.address.city"
        :number="String(user?.address.number)"
        :zip_code="String(user?.address.zip_code)"
        @onUpdate="(newAddress: Address) => handleAddressUpdate(newAddress)"
      ></AddressForm>
    </BorderCard>

    <!-- Section to pick the roles -->
    <BorderCard
      v-if="useAuthStore().auth?.admin"
      class="mt-4"
      prepend-icon="mdi-account-multiple"
    >
      <template v-slot:title> Rollen </template>
      <RolesForm id="roles" :readonly="!edit" v-model="roles" />
    </BorderCard>

    <!-- Section to set new password -->
    <BorderCard v-if="edit" class="mt-4" prepend-icon="mdi-lock">
      <template v-slot:title> Nieuw wachtwoord </template>
      <v-list density="compact" class="mx-4">
        <v-text-field
          id="password"
          v-model="password"
          :prepend-inner-icon="'mdi-lock'"
          :append-inner-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordHidden ? 'text' : 'password'"
          label="Nieuw wachtwoord"
          @click:append-inner="passwordHidden = !passwordHidden"
          bg
        ></v-text-field>
        <v-text-field
          id="repeat"
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
          id="save"
          prepend-icon="mdi-check"
          @click="handleSavePopup()"
          color="success"
          class="my-3 text-none"
        >
          Sla op
        </v-btn>

        <v-btn
          v-if="
            useAuthStore().auth?.admin && user?.id !== useAuthStore().auth?.id
          "
          id="delete"
          prepend-icon="mdi-delete"
          @click="handleRemovePopup()"
          color="error"
          class="mx-5 my-3 text-none"
        >
          Verwijder account
        </v-btn>
      </div>
    </div>
  </HFillWrapper>

  <CardPopup v-model="showPopup">
    <div class="pa-4" style="max-width: 400px">
      <div class="d-flex align-center" style="gap: 12px">
        <v-icon icon="mdi-content-save-alert-outline" size="large"></v-icon>
        <h2>{{ popupTitle }}</h2>
      </div>
      <p style="opacity: 90%" class="pt-2 pb-4">
        {{ popupMsg }}
      </p>
      <div
        style="
          display: grid;
          gap: 12px;
          min-width: fit-content;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        "
      >
        <v-btn
          id="cancel"
          prepend-icon="mdi-close"
          color="error"
          @click="showPopup = false"
          variant="elevated"
          class="text-none"
        >
          Annuleer
        </v-btn>
        <v-btn
          id="submit"
          prepend-icon="mdi-check"
          color="success"
          @click="popupSubmit()"
          variant="elevated"
          class="text-none"
        >
          Bevestig
        </v-btn>
      </div>
    </div>
  </CardPopup>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import ContactForm from "@/components/forms/ContactForm.vue";
import AddressForm from "@/components/forms/AddressForm.vue";
import Avatar from "@/components/Avatar.vue";
import { Ref, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import RolesForm from "@/components/forms/RolesForm.vue";
import CardPopup from "@/components/popups/CardPopup.vue";
import Address from "@/components/models/Address";
import { AddressQuery, Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import UserAnalyticCard from "@/components/cards/UserAnalyticCard.vue";
import Contact from "@/components/models/Contact";
import RemovedCard from "@/components/cards/RemovedCard.vue";

const display = useDisplay();
const mobile: Ref<boolean> = display.mobile;

const router = useRouter();

const props = defineProps(["id"]);

const edit = ref(false);
const password = ref("");
const passwordCheck = ref("");
const passwordHidden = ref(false);
const user: Ref<Result<UserQuery> | null> = ref(null);
const roles = ref<string[]>([]);

function handleAddressUpdate(address: Address) {
  if (user.value) {
    user.value.address.street = address.street;
    user.value.address.city = address.city;
    user.value.address.number = Number(address.number);
    user.value.address.zip_code = Number(address.zip_code);
  }
}

function handleContactUpdate(contact: Contact) {
  if (user.value) {
    user.value.email = contact.email;
    user.value.phone = contact.phone;
  }
}

async function fetchUser() {
  // Force reactivity;
  user.value = null;
  roles.value = [];

  await tryOrAlertAsync(async () => {
    user.value = await new UserQuery().getOne(props.id);
    if (user.value.admin) {
      roles.value.push("Admin");
    }
    if (user.value.super_student) {
      roles.value.push("Superstudent");
    }
    if (user.value.student) {
      roles.value.push("Student");
    }
  });
}
await fetchUser();

// reactive state for the roles

/* Action handle functions */
function handleBeginEdit() {
  edit.value = true;
}

function handleCancelEdit() {
  edit.value = false;
  fetchUser();
}

async function handleRemove() {
  await tryOrAlertAsync(async () => {
    await new UserQuery().deleteOne({ id: user.value?.id });
  });
  showPopup.value = false;
  edit.value = false;
  await router.go(0);
}

function handleRemovePopup() {
  popupIcon.value = "mdi-delete-alert-outline";
  popupTitle.value = "Verwijder account";
  popupMsg.value =
    "Je staat op het punt deze account te verwijderen. Ben je zeker dat je wilt verdergaan?";
  popupSubmit.value = handleRemove;
  showPopup.value = true;
}

async function restore() {
  await tryOrAlertAsync(async () => {
    await new UserQuery().updateOne({
      id: user.value?.id,
      deleted: false,
    });
  });
  router.go(0);
}

/*
async function handleRemovePermanent() {
  await tryOrAlertAsync(async () => {
    await new UserQuery().deleteOne({ id: user.value?.id }, true);
  });
  showPopup.value = false;
  edit.value = false;
  await router.push({ name: "user_overview" });
}

function handleRemovePopupPermanent() {
  popupIcon.value = "mdi-delete-alert-outline";
  popupTitle.value = "Verwijder account";
  popupMsg.value =
    "Je staat op het punt deze account permanent te verwijderen. Ben je zeker dat je wilt verdergaan?";
  popupSubmitMsg.value = "Verwijder account";
  popupSubmit.value = handleRemovePermanent;
  showPopup.value = true;
}*/

async function handleSave() {
  // update the address
  await tryOrAlertAsync(async () => {
    await new AddressQuery().updateOne({
      id: user.value?.address.id,
      street: user.value?.address.street,
      number: user.value?.address.number,
      city: user.value?.address.city,
      zip_code: user.value?.address.zip_code,
    });
  });
  // update the user
  await tryOrAlertAsync(async () => {
    await new UserQuery().updateOne({
      id: user.value?.id,
      email: user.value?.email,
      first_name: user.value?.first_name,
      last_name: user.value?.last_name,
      phone: user.value?.phone,
      student: roles.value.includes("Student"),
      super_student: roles.value.includes("Superstudent"),
      admin: roles.value.includes("Admin"),
    });
  });
  showPopup.value = false;
  edit.value = false;
}

function handleSavePopup() {
  popupIcon.value = "mdi-content-save-alert-outline";
  popupTitle.value = "Bewaar aanpassingen";
  popupMsg.value =
    "Je staat op het punt deze account permanent te bewerken. Ben je zeker dat je wilt verdergaan?";
  popupSubmit.value = handleSave;
  showPopup.value = true;
}

// popup content

const showPopup = ref(false);
const popupIcon = ref("");
const popupTitle = ref("");
const popupMsg = ref("");
const popupSubmit: Ref<() => void> = ref(() => {});
</script>

<style lang="sass" scoped>
a
  text-decoration: none
  color: black
</style>
